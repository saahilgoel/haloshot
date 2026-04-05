import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, name, useCase, source, referralCode, utmSource, utmMedium, utmCampaign } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check if already on waitlist
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ message: "You're already on the waitlist!", position: null });
    }

    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        email,
        name: name || null,
        use_case: useCase || null,
        source: source || "organic",
        referral_code: referralCode || null,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "You're already on the waitlist!" });
      }
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    // Get position
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .eq("status", "waiting");

    return NextResponse.json({
      message: "You're on the waitlist!",
      position: count || 0,
    });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
