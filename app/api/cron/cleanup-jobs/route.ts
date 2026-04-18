import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 30;

// Runs on a Vercel cron (see vercel.json). Sweeps any generation job that's
// been "processing" or "queued" for > STALE_MINUTES and marks it canceled.
// This catches deploy-orphans (where a new deploy interrupted in-flight work),
// Replicate webhooks that never fired, and any other stuck state.
const STALE_MINUTES = 15;

export async function GET(req: NextRequest) {
  // Vercel cron requests carry a bearer token that matches CRON_SECRET when
  // configured. Reject anything else so randoms can't trigger this endpoint.
  const auth = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const cutoff = new Date(Date.now() - STALE_MINUTES * 60_000).toISOString();

  const { data: stale, error } = await supabase
    .from("generation_jobs")
    .select("id, replicate_prediction_id, created_at")
    .in("status", ["processing", "queued"])
    .lt("created_at", cutoff);

  if (error) {
    console.error("[cron cleanup] query failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!stale || stale.length === 0) {
    return NextResponse.json({ swept: 0 });
  }

  console.log(`[cron cleanup] sweeping ${stale.length} stale jobs older than ${STALE_MINUTES}min`);

  // Best-effort Replicate cancels — don't block the sweep on them.
  await Promise.allSettled(
    stale.flatMap((job: { replicate_prediction_id: string | null }) =>
      (job.replicate_prediction_id || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
        .map((id: string) =>
          fetch(`https://api.replicate.com/v1/predictions/${id}/cancel`, {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
          }),
        ),
    ),
  );

  const { error: updateError } = await supabase
    .from("generation_jobs")
    .update({
      status: "canceled",
      error_message: `Auto-canceled: exceeded ${STALE_MINUTES}min processing time`,
      completed_at: new Date().toISOString(),
    })
    .in("id", stale.map((j: { id: string }) => j.id));

  if (updateError) {
    console.error("[cron cleanup] update failed", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ swept: stale.length, jobIds: stale.map((j) => j.id) });
}
