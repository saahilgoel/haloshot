import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const model = url.searchParams.get("model") || "all";
  const status = url.searchParams.get("status") || "all";
  const offset = (page - 1) * limit;

  try {
    // Detailed generation jobs
    let query = supabase
      .from("generation_jobs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (model !== "all") {
      query = query.eq("model_version", model);
    }
    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: jobs, count, error } = await query;
    if (error) throw error;

    // Aggregate stats
    const { data: allJobs } = await supabase
      .from("generation_jobs")
      .select("model_version, status, cost_usd, num_images, similarity_scores, created_at");

    // Compute aggregates
    const stats = {
      total: allJobs?.length || 0,
      byModel: {} as Record<string, { count: number; totalCost: number; avgSimilarity: number; totalImages: number }>,
      byStatus: {} as Record<string, number>,
      totalCost: 0,
      totalImages: 0,
    };

    for (const job of allJobs || []) {
      // By model
      const m = job.model_version || "unknown";
      if (!stats.byModel[m]) stats.byModel[m] = { count: 0, totalCost: 0, avgSimilarity: 0, totalImages: 0 };
      stats.byModel[m].count++;
      stats.byModel[m].totalCost += parseFloat(job.cost_usd || "0");
      stats.byModel[m].totalImages += job.num_images || 0;

      const scores = job.similarity_scores || [];
      if (scores.length > 0) {
        const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        stats.byModel[m].avgSimilarity = (stats.byModel[m].avgSimilarity * (stats.byModel[m].count - 1) + avg) / stats.byModel[m].count;
      }

      // By status
      stats.byStatus[job.status] = (stats.byStatus[job.status] || 0) + 1;

      // Totals
      stats.totalCost += parseFloat(job.cost_usd || "0");
      stats.totalImages += job.num_images || 0;
    }

    return NextResponse.json({ jobs: jobs || [], total: count || 0, stats, page, limit });
  } catch (error) {
    console.error("Admin generations error:", error);
    return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 });
  }
}
