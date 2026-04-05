import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Get referral stats for current user
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("referral_code, referral_credits")
      .eq("id", user.id)
      .single();

    // Get referral events
    const { data: events } = await supabase
      .from("referral_events")
      .select("*")
      .eq("referrer_id", user.id)
      .order("created_at", { ascending: false });

    const clicks = events?.filter(e => e.event_type === "click").length || 0;
    const signups = events?.filter(e => e.event_type === "signup").length || 0;
    const conversions = events?.filter(e => e.event_type === "conversion").length || 0;

    return NextResponse.json({
      referralCode: profile?.referral_code,
      credits: profile?.referral_credits || 0,
      stats: { clicks, signups, conversions },
      recentEvents: events?.slice(0, 10) || [],
    });
  } catch (error) {
    console.error("Referral error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Track a referral event (click, signup, etc.)
export async function POST(req: NextRequest) {
  try {
    const { referralCode, eventType, referredEmail } = await req.json();

    if (!referralCode || !eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    // Find the referrer
    const { data: referrer } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", referralCode)
      .single();

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Log the event
    await supabase.from("referral_events").insert({
      referrer_id: referrer.id,
      event_type: eventType,
      referred_email: referredEmail || null,
    });

    // If signup, grant referral credits
    if (eventType === "signup") {
      await supabase.rpc("increment_referral_credits", {
        uid: referrer.id,
        amount: 5,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Referral tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
