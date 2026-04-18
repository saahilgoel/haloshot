import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 15;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const t0 = Date.now();
  const log = (msg: string, extra?: unknown) =>
    console.log(`[cancel ${jobId.slice(0, 8)}] +${Date.now() - t0}ms ${msg}`, extra ?? "");

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Service-role client for the update — the row's RLS may not permit
    // the user to write status=canceled directly.
    const admin = createAdminClient();

    const { data: job } = await admin
      .from("generation_jobs")
      .select("id, user_id, status, replicate_prediction_id")
      .eq("id", jobId)
      .single();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (job.status !== "processing" && job.status !== "queued") {
      log("already terminal", { status: job.status });
      return NextResponse.json({ ok: true, alreadyTerminal: true, status: job.status });
    }

    // Fire cancel on every Replicate prediction in parallel. Ignore failures —
    // a prediction may already be done / canceled, and we still want to flip
    // the job row regardless.
    const predictionIds = ((job.replicate_prediction_id as string | null) || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    log("canceling predictions", { count: predictionIds.length });

    await Promise.allSettled(
      predictionIds.map(async (id: string) => {
        const res = await fetch(`https://api.replicate.com/v1/predictions/${id}/cancel`, {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
        });
        log(`replicate cancel ${id.slice(0, 8)} -> ${res.status}`);
      }),
    );

    await admin
      .from("generation_jobs")
      .update({
        status: "canceled",
        error_message: "Canceled by user",
        completed_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    log("done");
    return NextResponse.json({ ok: true, canceled: predictionIds.length });
  } catch (error) {
    log("UNCAUGHT", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Cancel failed" }, { status: 500 });
  }
}
