import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { analyzePhoto } from "@/lib/ai/halo-score";

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

    let savedHeadshot: { id: string } | null = null;
    let permanentUrl = "";

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
      permanentUrl = imageUrl;
      let thumbnailUrl = imageUrl;
      try {
        const imgRes = await fetch(imageUrl);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const ext = imageUrl.includes(".webp") ? "webp" : "png";
        const fullPath = `headshots/${job.user_id}/${job.id}/${predictionId}.${ext}`;

        // Try to generate thumbnail with sharp (may not be available)
        let thumbBuffer: Buffer | null = null;
        try {
          const sharpModule = await import("sharp");
          const s = sharpModule.default;
          thumbBuffer = await s(buffer).resize(400).webp({ quality: 75 }).toBuffer();
        } catch {
          console.log("Sharp not available, skipping thumbnail");
        }

        // Upload full size
        const { error: fullErr } = await supabase.storage
          .from("generated")
          .upload(fullPath, buffer, { contentType: `image/${ext}`, upsert: true });

        if (!fullErr) {
          permanentUrl = supabase.storage.from("generated").getPublicUrl(fullPath).data.publicUrl;
        }

        // Upload thumbnail if generated
        if (thumbBuffer) {
          const thumbPath = `headshots/${job.user_id}/${job.id}/${predictionId}-thumb.webp`;
          const { error: thumbErr } = await supabase.storage
            .from("generated")
            .upload(thumbPath, thumbBuffer, { contentType: "image/webp", upsert: true });

          if (!thumbErr) {
            thumbnailUrl = supabase.storage.from("generated").getPublicUrl(thumbPath).data.publicUrl;
          } else {
            thumbnailUrl = permanentUrl;
          }
        } else {
          thumbnailUrl = permanentUrl;
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
      const { data: savedHs } = await supabase.from("saved_headshots").insert({
        user_id: job.user_id,
        generation_job_id: job.id,
        original_url: permanentUrl,
        thumbnail_url: thumbnailUrl,
        preset_id: job.preset_id,
        resolution: "1024x1024",
      }).select("id").single();
      savedHeadshot = savedHs;

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
      // Re-read job to get latest state (other webhooks may have succeeded)
      const { data: freshJob } = await supabase
        .from("generation_jobs")
        .select("generated_image_urls, status")
        .eq("id", job.id)
        .single();

      if (freshJob?.status !== "processing") return NextResponse.json({ ok: true });

      const currentUrls = freshJob?.generated_image_urls || [];

      if (currentUrls.length > 0) {
        // Some images succeeded — mark completed with partial results
        await supabase
          .from("generation_jobs")
          .update({
            status: "completed",
            error_message: predictionError || "Some images failed, showing partial results",
            completed_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      } else {
        // No images yet — mark failed
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

    // Auto-score AFTER all DB writes are done (must await or Vercel kills it)
    if (status === "succeeded" && savedHeadshot && permanentUrl) {
      try {
        const score = await analyzePhoto(permanentUrl);
        await supabase
          .from("saved_headshots")
          .update({ halo_score: score.overall_score })
          .eq("id", savedHeadshot.id);
      } catch (err) {
        console.error("Auto-score failed:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
