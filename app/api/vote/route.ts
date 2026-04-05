import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Simple in-memory rate limiter by IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 votes per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

/**
 * POST /api/vote
 * Submit a vote on a Help Me Pick poll.
 * Body: { slug: string, choice: 'a' | 'b' }
 * No auth required (public voting). Rate limited by IP.
 */
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many votes. Please slow down." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { slug, choice } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid slug" },
        { status: 400 }
      );
    }

    if (choice !== "a" && choice !== "b") {
      return NextResponse.json(
        { error: "Choice must be 'a' or 'b'" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Fetch the poll
    const { data: poll, error: fetchError } = await supabase
      .from("photo_votes")
      .select("*")
      .eq("share_slug", slug)
      .single();

    if (fetchError || !poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    // Check expiry
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This poll has expired" },
        { status: 410 }
      );
    }

    // Increment the appropriate vote count
    const column = choice === "a" ? "votes_a" : "votes_b";
    const currentCount = choice === "a" ? poll.votes_a : poll.votes_b;

    const { data: updated, error: updateError } = await supabase
      .from("photo_votes")
      .update({ [column]: (currentCount ?? 0) + 1 })
      .eq("id", poll.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to record vote" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      votes_a: updated.votes_a,
      votes_b: updated.votes_b,
    });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
