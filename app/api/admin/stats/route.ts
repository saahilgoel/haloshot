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
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    const [
      { data: profiles, count: totalUsers },
      { data: allJobs },
      { count: totalScores },
      { count: totalHeadshots },
      { data: feedback },
    ] = await Promise.all([
      supabase.from("profiles").select("id, full_name, subscription_tier, generations_count_total, current_halo_score, created_at, updated_at", { count: "exact" }).order("created_at", { ascending: false }),
      supabase.from("generation_jobs").select("id, user_id, status, model_version, num_images, cost_usd, preset_id, created_at").order("created_at", { ascending: false }),
      supabase.from("halo_scores").select("id", { count: "exact", head: true }),
      supabase.from("saved_headshots").select("id", { count: "exact", head: true }),
      supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

    // Get emails from auth
    let emailMap = new Map<string, string>();
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      authUsers?.users?.forEach((u) => {
        if (u.email) emailMap.set(u.id, u.email);
      });
    } catch {
      // auth.admin may not be available
    }

    // Compute stats
    const gensToday = (allJobs || []).filter(j => j.created_at >= todayStart).length;
    const gensMonth = (allJobs || []).filter(j => j.created_at >= monthStart).length;
    const totalCost = (allJobs || []).reduce((sum, j) => sum + parseFloat(j.cost_usd || "0"), 0);
    const totalImages = (allJobs || []).reduce((sum, j) => sum + (j.num_images || 0), 0);
    const completedJobs = (allJobs || []).filter(j => j.status === "completed").length;
    const failedJobs = (allJobs || []).filter(j => j.status === "failed").length;

    // By plan
    const byPlan: Record<string, number> = {};
    for (const p of profiles || []) {
      const plan = p.subscription_tier || "free";
      byPlan[plan] = (byPlan[plan] || 0) + 1;
    }
    const proUsers = (byPlan["pro"] || 0) + (byPlan["team"] || 0);
    const mrr = proUsers * 9.99;
    const conversionRate = (totalUsers || 0) > 0 ? (proUsers / (totalUsers || 1) * 100) : 0;

    // Users with enriched data
    const users = (profiles || []).map(p => ({
      id: p.id,
      name: p.full_name || "—",
      email: emailMap.get(p.id) || "—",
      plan: p.subscription_tier || "free",
      generations: p.generations_count_total || 0,
      haloScore: p.current_halo_score,
      joined: p.created_at,
      lastActive: p.updated_at || p.created_at,
    }));

    // Signups per day (last 7 days)
    const signupsPerDay = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (6 - i));
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
      return {
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        signups: (profiles || []).filter(p => p.created_at >= dayStart && p.created_at < dayEnd).length,
      };
    });

    // Generations per day (last 7 days)
    const gensPerDay = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (6 - i));
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: (allJobs || []).filter(j => j.created_at >= dayStart && j.created_at < dayEnd).length,
      };
    });

    // Recent activity
    const recentSignups = (profiles || []).slice(0, 5).map(p => ({
      type: "signup", text: `${emailMap.get(p.id) || p.full_name || "User"} signed up`, time: p.created_at,
    }));
    const recentGens = (allJobs || []).slice(0, 5).map(j => ({
      type: "generation", text: `${j.num_images} images ${j.status} (${j.model_version || "unknown"})`, time: j.created_at,
    }));
    const recentActivity = [...recentSignups, ...recentGens]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        proUsers,
        mrr,
        conversionRate,
        totalJobs: (allJobs || []).length,
        completedJobs,
        failedJobs,
        totalImages,
        totalCost,
        totalScores: totalScores || 0,
        totalHeadshots: totalHeadshots || 0,
        gensToday,
        gensMonth,
        byPlan,
      },
      users,
      signupsPerDay,
      gensPerDay,
      recentActivity,
      feedback: feedback || [],
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
