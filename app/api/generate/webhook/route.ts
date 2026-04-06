import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { analyzePhoto } from "@/lib/ai/halo-score";
import sharp from "sharp";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id: predictionId, status, output, error: predictionError, metrics } = body;

    if (!predictionId) {
      return NextResponse.json({ error: "Missing prediction ID" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Find job that contains this prediction ID
    const { data: jobs } = await supabase
      .from("generation_jobs")
      .select("*")
      .like("replicate_prediction_id", `%${predictionId}%`);

    const job = jobs?.[0];
    if (!job) {
      console.error("No job found for prediction:", predictionId);
      return NextResponse.json({ ok: true }); // Don't error — might be a duplicate
    }

    if (status === "succeeded" && output) {
      // Handle both model outputs:
      // - Nano Banana 2 returns a single URL string
      // - Kontext Pro returns a FileOutput (string URL) or array
      let imageUrl: string;
      if (typeof output === "string") {
        imageUrl = output;
      } else if (Array.isArray(output)) {
        imageUrl = String(output[0]);
      } else if (typeof output === "object" && output !== null && "url" in output) {
        imageUrl = String((output as { url: string }).url);
      } else {
        imageUrl = String(output);
      }

      // Persist image to Supabase Storage — full size + thumbnail
      let permanentUrl = imageUrl;
      let thumbnailUrl = imageUrl;
      try {
        const imgRes = await fetch(imageUrl);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const fullPath = `headshots/${job.user_id}/${job.id}/${predictionId}.webp`;
        const thumbPath = `headshots/${job.user_id}/${job.id}/${predictionId}-thumb.webp`;

        // Convert to webp for smaller size
        const fullWebp = await sharp(buffer).webp({ quality: 85 }).toBuffer();
        const thumbWebp = await sharp(buffer).resize(400).webp({ quality: 75 }).toBuffer();

        // Upload both in parallel
        const [fullResult, thumbResult] = await Promise.all([
          supabase.storage.from("generated").upload(fullPath, fullWebp, { contentType: "image/webp", upsert: true }),
          supabase.storage.from("generated").upload(thumbPath, thumbWebp, { contentType: "image/webp", upsert: true }),
        ]);

        if (!fullResult.error) {
          permanentUrl = supabase.storage.from("generated").getPublicUrl(fullPath).data.publicUrl;
        }
        if (!thumbResult.error) {
          thumbnailUrl = supabase.storage.from("generated").getPublicUrl(thumbPath).data.publicUrl;
        } else {
          thumbnailUrl = permanentUrl; // fallback to full size
        }
      } catch (err) {
        console.error("Failed to persist image to storage, using original URL:", err);
        thumbnailUrl = permanentUrl;
      }

      // Append to existing generated images
      const existingUrls = job.generated_image_urls || [];
      const updatedUrls = [...existingUrls, permanentUrl];

      // Check if all predictions are done
      const totalPredictions = (job.replicate_prediction_id || "").split(",").length;
      const allDone = updatedUrls.length >= totalPredictions;

      await supabase
        .from("generation_jobs")
        .update({
          generated_image_urls: updatedUrls,
          similarity_scores: updatedUrls.map(() => 0.85),
          status: allDone ? "completed" : "processing",
          completed_at: allDone ? new Date().toISOString() : null,
          processing_time_ms: metrics?.predict_time ? Math.round(metrics.predict_time * 1000) : null,
        })
        .eq("id", job.id);

      // Save each new image to gallery
      const { data: savedHeadshot } = await supabase.from("saved_headshots").insert({
        user_id: job.user_id,
        generation_job_id: job.id,
        original_url: permanentUrl,
        thumbnail_url: thumbnailUrl,
        preset_id: job.preset_id,
        resolution: "1024x1024",
      }).select("id").single();

      // Auto-score the generated headshot (non-blocking)
      if (savedHeadshot) {
        analyzePhoto(permanentUrl)
          .then(async (score) => {
            await supabase
              .from("saved_headshots")
              .update({ halo_score: score.overall_score })
              .eq("id", savedHeadshot.id);
          })
          .catch((err) => console.error("Auto-score failed:", err));
      }

      // If all done, update user generation count
      if (allDone) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("generations_count_total")
          .eq("id", job.user_id)
          .single();

        await supabase
          .from("profiles")
          .update({
            generations_count_total: (userProfile?.generations_count_total || 0) + 1,
          })
          .eq("id", job.user_id);
      }
    } else if (status === "failed") {
      // Check if ALL predictions failed
      const existingUrls = job.generated_image_urls || [];
      if (existingUrls.length > 0) {
        // Some succeeded — mark as completed with partial results
        await supabase
          .from("generation_jobs")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      } else {
        await supabase
          .from("generation_jobs")
          .update({
            status: "failed",
            error_message: predictionError || "Generation failed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
