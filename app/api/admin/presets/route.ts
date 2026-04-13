import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function checkAdmin(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  if (!adminEmails.includes(user.email?.toLowerCase() || "")) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();

  // Fetch presets and generation jobs in parallel
  const [{ data: presets }, { data: jobs }] = await Promise.all([
    supabase
      .from("style_presets")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("generation_jobs")
      .select("preset_id"),
  ]);

  // Count usage per preset
  const usageCounts: Record<string, number> = {};
  for (const job of jobs || []) {
    if (job.preset_id) {
      usageCounts[job.preset_id] = (usageCounts[job.preset_id] || 0) + 1;
    }
  }

  // Enrich presets with usage counts
  const enrichedPresets = (presets || []).map(p => ({
    ...p,
    usageCount: usageCounts[p.id] || 0,
  }));

  return NextResponse.json({ presets: enrichedPresets });
}

export async function POST(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("style_presets")
    .upsert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ preset: data });
}

export async function DELETE(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  const supabase = createAdminClient();

  await supabase.from("style_presets").update({ is_active: false }).eq("id", id);

  return NextResponse.json({ ok: true });
}
