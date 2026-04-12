import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const source = url.searchParams.get("source") || "all"; // all, events, generations
  const search = url.searchParams.get("search") || "";
  const offset = (page - 1) * limit;

  try {
    if (source === "generations" || source === "all") {
      let query = supabase
        .from("generation_jobs")
        .select("id, user_id, preset_id, model_version, status, num_images, cost_usd, similarity_scores, created_at, updated_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`preset_id.ilike.%${search}%,model_version.ilike.%${search}%,status.ilike.%${search}%`);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      if (source === "generations") {
        return NextResponse.json({ data, total: count, page, limit });
      }
    }

    // Analytics events
    let eventsQuery = supabase
      .from("analytics_events")
      .select("id, user_id, event_name, event_properties, page_url, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      eventsQuery = eventsQuery.or(`event_name.ilike.%${search}%`);
    }

    const { data: events, count: eventsCount, error: eventsError } = await eventsQuery;

    // Also get generation jobs for the combined view
    const { data: jobs, count: jobsCount } = await supabase
      .from("generation_jobs")
      .select("id, user_id, preset_id, model_version, status, num_images, cost_usd, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    return NextResponse.json({
      events: { data: events || [], total: eventsCount || 0 },
      generations: { data: jobs || [], total: jobsCount || 0 },
      page,
      limit,
    });
  } catch (error) {
    console.error("Admin logs error:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
