import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/nudge
 * Trigger nudge sends (admin only).
 * Body: { nudgeId: string, targetSegment?: { tier?: string, daysSinceGeneration?: number } }
 *
 * This is a placeholder for push notification / email sending.
 * In production, this would integrate with a notification service (e.g., Resend, FCM, OneSignal).
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the caller is an authenticated admin
    const serverSupabase = await createClient();
    const {
      data: { user },
    } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check admin status (simple email-based check; replace with proper role check in production)
    const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());
    if (!adminEmails.includes(user.email ?? "")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nudgeId, targetSegment } = body;

    if (!nudgeId || typeof nudgeId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid nudgeId" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Fetch the nudge message
    const { data: nudge, error: nudgeError } = await supabase
      .from("nudge_messages")
      .select("*")
      .eq("id", nudgeId)
      .single();

    if (nudgeError || !nudge) {
      return NextResponse.json(
        { error: "Nudge message not found" },
        { status: 404 }
      );
    }

    if (!nudge.is_active) {
      return NextResponse.json(
        { error: "Nudge message is not active" },
        { status: 400 }
      );
    }

    // Build target user query
    let query = supabase.from("profiles").select("id, email, full_name");

    // Filter by tier
    const tier = targetSegment?.tier ?? nudge.target_tier;
    if (tier && tier !== "all") {
      query = query.eq("subscription_tier", tier);
    }

    // Filter by days since last generation
    const daysSince =
      targetSegment?.daysSinceGeneration ?? nudge.target_days_since_generation;
    if (daysSince) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysSince);
      query = query.lte("halo_score_updated_at", cutoffDate.toISOString());
    }

    const { data: targetUsers, error: usersError } = await query;

    if (usersError) {
      return NextResponse.json(
        { error: "Failed to query target users" },
        { status: 500 }
      );
    }

    const targetCount = targetUsers?.length ?? 0;

    // TODO: Integrate with notification service (Resend for email, FCM for push)
    // For now, just increment sent_count and return the target list
    //
    // Example integration:
    // for (const user of targetUsers) {
    //   await resend.emails.send({
    //     from: 'HaloShot <nudge@haloshot.ai>',
    //     to: user.email,
    //     subject: nudge.message,
    //     html: buildNudgeEmail(nudge, user),
    //   });
    // }

    // Update sent count
    const { error: updateError } = await supabase
      .from("nudge_messages")
      .update({ sent_count: (nudge.sent_count ?? 0) + targetCount })
      .eq("id", nudgeId);

    if (updateError) {
      console.error("Failed to update nudge sent_count:", updateError);
    }

    return NextResponse.json({
      success: true,
      nudge_id: nudgeId,
      category: nudge.category,
      message: nudge.message,
      target_count: targetCount,
      target_users: targetUsers?.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.full_name,
      })),
      note: "Notification sending is a placeholder. Integrate with Resend/FCM in production.",
    });
  } catch (error) {
    console.error("Nudge trigger error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
