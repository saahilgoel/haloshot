import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

      // Persist image to Supabase Storage so it doesn't expire
      let permanentUrl = imageUrl;
      try {
        const imgRes = await fetch(imageUrl);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const ext = imageUrl.includes(".webp") ? "webp" : "png";
        const storagePath = `headshots/${job.user_id}/${job.id}/${predictionId}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("generated")
          .upload(storagePath, buffer, {
            contentType: `image/${ext}`,
            upsert: true,
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from("generated")
            .getPublicUrl(storagePath);
          permanentUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.error("Failed to persist image to storage, using original URL:", err);
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
      await supabase.from("saved_headshots").insert({
        user_id: job.user_id,
        generation_job_id: job.id,
        original_url: permanentUrl,
        thumbnail_url: permanentUrl,
        preset_id: job.preset_id,
        resolution: "1024x1024",
      });

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
