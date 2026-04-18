import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { analyzePhoto } from "@/lib/ai/halo-score";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  const log = (predId: string, msg: string, extra?: unknown) =>
    console.log(`[webhook ${predId.slice(0, 8)}] +${Date.now() - t0}ms ${msg}`, extra ?? "");

  try {
    const body = await req.json();
    const { id: predictionId, status, output, error: predictionError, metrics } = body;

    if (!predictionId) {
      console.log("[webhook] received without prediction ID");
      return NextResponse.json({ error: "Missing prediction ID" }, { status: 400 });
    }

    log(predictionId, "received", { status, hasOutput: !!output, predictTime: metrics?.predict_time });

    const supabase = createAdminClient();

    // Find job that contains this prediction ID
    const { data: jobs } = await supabase
      .from("generation_jobs")
      .select("*")
      .like("replicate_prediction_id", `%${predictionId}%`);

    const job = jobs?.[0];
    if (!job) {
      log(predictionId, "no job found — possible duplicate or stale webhook");
      return NextResponse.json({ ok: true }); // Don't error — might be a duplicate
    }
    log(predictionId, "matched job", { jobId: job.id, userId: job.user_id, currentImageCount: job.generated_image_urls?.length || 0 });

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
      const storageStart = Date.now();
      try {
        const imgRes = await fetch(imageUrl);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        log(predictionId, `image downloaded from replicate (${buffer.length} bytes in ${Date.now() - storageStart}ms)`);
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
        const uploadStart = Date.now();
        const { error: fullErr } = await supabase.storage
          .from("generated")
          .upload(fullPath, buffer, { contentType: `image/${ext}`, upsert: true });

        if (!fullErr) {
          permanentUrl = supabase.storage.from("generated").getPublicUrl(fullPath).data.publicUrl;
          log(predictionId, `full-size uploaded in ${Date.now() - uploadStart}ms`);
        } else {
          log(predictionId, "full-size upload FAILED", fullErr.message);
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
      log(predictionId, `progress: ${updatedUrls.length}/${totalPredictions}${allDone ? " — COMPLETE" : ""}`);

      // Estimate cost per image based on model
      const costPerImage: Record<string, number> = {
        "nano-banana-2": 0.003,
        "nano-banana": 0.0015,
        "flux-kontext-pro": 0.005,
        "flux-kontext-pro-edit": 0.005,
        "flux-kontext-dev": 0.0025,
        "flux-dev": 0.0025,
      };
      const perImage = costPerImage[job.model_version] || 0.003;
      const estimatedCost = updatedUrls.length * perImage;

      await supabase
        .from("generation_jobs")
        .update({
          generated_image_urls: updatedUrls,
          similarity_scores: updatedUrls.map(() => 0.85),
          status: allDone ? "completed" : "processing",
          completed_at: allDone ? new Date().toISOString() : null,
          processing_time_ms: metrics?.predict_time ? Math.round(metrics.predict_time * 1000) : null,
          cost_usd: estimatedCost,
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
      const isCapacityError = (predictionError || "").includes("unavailable") || (predictionError || "").includes("high demand") || (predictionError || "").includes("E003");
      log(predictionId, "prediction FAILED", { error: String(predictionError).slice(0, 200), isCapacityError });

      // If capacity error and model isn't already the fallback, retry with Flux Kontext Pro
      if (isCapacityError && job.model_version !== "flux-kontext-pro" && job.model_version !== "flux-kontext-pro-edit") {
        log(predictionId, "retrying with Flux Kontext Pro fallback");
        try {
          // Get a reference photo URL from the face profile
          const { data: faceProfile } = await supabase
            .from("face_profiles")
            .select("photo_urls")
            .eq("id", job.face_profile_id)
            .single();

          const refUrl = faceProfile?.photo_urls?.[0];
          if (refUrl) {
            const preset = job.preset_id || "linkedin_executive";
            const prompt = `Transform this photo into a professional headshot. Keep the person's face, features, and identity exactly the same. Studio lighting, sharp focus on eyes, professional photographer quality. Do not change the person's face or ethnicity.`;

            const retryRes = await fetch(
              "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  input: { prompt, input_image: refUrl, aspect_ratio: "3:4", output_format: "jpg" },
                  webhook: `https://haloshot.com/api/generate/webhook`,
                  webhook_events_filter: ["completed"],
                }),
              }
            );

            if (retryRes.ok) {
              const retryPrediction = await retryRes.json();
              // Append the retry prediction ID to the job
              const existingIds = job.replicate_prediction_id || "";
              await supabase
                .from("generation_jobs")
                .update({
                  replicate_prediction_id: existingIds + "," + retryPrediction.id,
                  error_message: `Retrying with Flux Kontext Pro (original model unavailable)`,
                })
                .eq("id", job.id);

              return NextResponse.json({ ok: true, retried: true });
            }
          }
        } catch (retryErr) {
          console.error("Fallback retry failed:", retryErr);
        }
      }

      // Re-read job to get latest state (other webhooks may have succeeded)
      const { data: freshJob } = await supabase
        .from("generation_jobs")
        .select("generated_image_urls, status, replicate_prediction_id")
        .eq("id", job.id)
        .single();

      if (freshJob?.status !== "processing") return NextResponse.json({ ok: true });

      const currentUrls = freshJob?.generated_image_urls || [];
      const totalPredictions = (freshJob?.replicate_prediction_id || "").split(",").filter(Boolean).length;
      // Don't mark as failed yet if there are still pending predictions
      // (other webhooks may still come in, or retries may be in flight)

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
      const scoreStart = Date.now();
      try {
        const score = await analyzePhoto(permanentUrl);
        await supabase
          .from("saved_headshots")
          .update({ halo_score: score.overall_score })
          .eq("id", savedHeadshot.id);
        log(predictionId, `halo-scored in ${Date.now() - scoreStart}ms`, { score: score.overall_score });
      } catch (err) {
        log(predictionId, `halo-score FAILED in ${Date.now() - scoreStart}ms`, err instanceof Error ? err.message : String(err));
      }
    }

    log(predictionId, `webhook done in ${Date.now() - t0}ms total`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[webhook] UNCAUGHT error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
