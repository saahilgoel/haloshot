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

    // Find the generation job by prediction ID
    const { data: job } = await supabase
      .from("generation_jobs")
      .select("*")
      .eq("replicate_prediction_id", predictionId)
      .single();

    if (!job) {
      console.error("No job found for prediction:", predictionId);
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Already completed — idempotency guard
    if (job.status === "completed" || job.status === "failed") {
      return NextResponse.json({ ok: true });
    }

    if (status === "succeeded" && output) {
      const imageUrls = Array.isArray(output) ? output : [output];
      const processingTimeMs = metrics?.predict_time
        ? Math.round(metrics.predict_time * 1000)
        : null;

      // TODO: Run face similarity scoring against reference photos
      // For now, accept all images with placeholder scores
      const similarityScores = imageUrls.map(() => 0.85);

      // Update job as completed
      await supabase
        .from("generation_jobs")
        .update({
          status: "completed",
          generated_image_urls: imageUrls,
          similarity_scores: similarityScores,
          processing_time_ms: processingTimeMs,
          completed_at: new Date().toISOString(),
          cost_usd: (metrics?.predict_time || 0) * 0.0023, // Approximate cost
        })
        .eq("id", job.id);

      // Increment user generation count
      await supabase.rpc("increment_generation_count", { uid: job.user_id });

      // Auto-save headshots
      const headshots = imageUrls.map((url: string, i: number) => ({
        user_id: job.user_id,
        generation_job_id: job.id,
        original_url: url,
        thumbnail_url: url,
        preset_id: job.preset_id,
        resolution: "1024x1024",
      }));

      await supabase.from("saved_headshots").insert(headshots);
    } else if (status === "failed") {
      await supabase
        .from("generation_jobs")
        .update({
          status: "failed",
          error_message: predictionError || "Generation failed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
