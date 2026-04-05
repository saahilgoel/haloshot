import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: job } = await supabase
      .from("generation_jobs")
      .select("*")
      .eq("id", params.jobId)
      .eq("user_id", user.id)
      .single();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      presetId: job.preset_id,
      numImages: job.num_images,
      generatedImageUrls: job.generated_image_urls,
      similarityScores: job.similarity_scores,
      processingTimeMs: job.processing_time_ms,
      errorMessage: job.error_message,
      createdAt: job.created_at,
      completedAt: job.completed_at,
    });
  } catch (error) {
    console.error("Job status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
