import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAILS } from "@/lib/utils/constants";

async function checkAdmin(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return null;
  }
  return user;
}

export async function GET(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClient();

  const [
    { count: totalUsers },
    { count: proUsers },
    { count: totalGenerations },
    { count: todayGenerations },
    { data: recentSignups },
    { data: recentGenerations },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("subscription_tier", "pro"),
    supabase.from("generation_jobs").select("*", { count: "exact", head: true }),
    supabase.from("generation_jobs").select("*", { count: "exact", head: true }).gte("created_at", new Date().toISOString().split("T")[0]),
    supabase.from("profiles").select("id, created_at").order("created_at", { ascending: false }).limit(30),
    supabase.from("generation_jobs").select("id, status, created_at, preset_id").order("created_at", { ascending: false }).limit(50),
  ]);

  // Calculate MRR (pro users × $9.99)
  const mrr = (proUsers || 0) * 9.99;

  // Free to paid conversion rate
  const conversionRate = totalUsers ? ((proUsers || 0) / totalUsers * 100).toFixed(1) : "0";

  return NextResponse.json({
    metrics: {
      mrr,
      totalUsers: totalUsers || 0,
      proUsers: proUsers || 0,
      totalGenerations: totalGenerations || 0,
      todayGenerations: todayGenerations || 0,
      conversionRate: parseFloat(conversionRate),
    },
    recentSignups: recentSignups || [],
    recentGenerations: recentGenerations || [],
  });
}
