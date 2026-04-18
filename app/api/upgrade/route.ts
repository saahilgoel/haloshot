// POST /api/upgrade — instantly upgrades authenticated user to pro
// No payment required during alpha
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await supabase.from("profiles").update({
    subscription_tier: "pro",
    subscription_status: "active",
    subscription_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  }).eq("id", user.id);

  return NextResponse.json({ success: true, tier: "pro" });
}
