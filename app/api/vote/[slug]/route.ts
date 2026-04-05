import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/vote/[slug]
 * Get poll data and results for a Help Me Pick poll.
 * Public endpoint -- no auth required.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Missing poll slug" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Fetch the poll with creator info
    const { data: poll, error: pollError } = await supabase
      .from("photo_votes")
      .select("*")
      .eq("share_slug", slug)
      .single();

    if (pollError || !poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    // Fetch creator profile (limited fields for privacy)
    const { data: creator } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", poll.user_id)
      .single();

    const isExpired = poll.expires_at
      ? new Date(poll.expires_at) < new Date()
      : false;

    return NextResponse.json({
      id: poll.id,
      photo_a_url: poll.photo_a_url,
      photo_b_url: poll.photo_b_url,
      votes_a: poll.votes_a ?? 0,
      votes_b: poll.votes_b ?? 0,
      total_votes: (poll.votes_a ?? 0) + (poll.votes_b ?? 0),
      is_expired: isExpired,
      expires_at: poll.expires_at,
      created_at: poll.created_at,
      creator: creator
        ? { name: creator.full_name, avatar_url: creator.avatar_url }
        : null,
    });
  } catch (error) {
    console.error("Get poll error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
