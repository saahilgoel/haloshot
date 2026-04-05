import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { type, rating, message, generationJobId, pageUrl } = await req.json();

    if (!type) {
      return NextResponse.json({ error: "Feedback type required" }, { status: 400 });
    }

    const { error } = await supabase.from("feedback").insert({
      user_id: user?.id || null,
      type,
      rating: rating || null,
      message: message || null,
      generation_job_id: generationJobId || null,
      page_url: pageUrl || null,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
