/**
 * One-off script: migrate expired Replicate URLs → R2 permanent URLs
 *
 * Usage: npx tsx scripts/migrate-urls.ts
 *
 * Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, R2_*
 */

import { createClient } from "@supabase/supabase-js";
import { uploadToR2 } from "../lib/storage/r2";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrate() {
  // Get all headshots with Replicate URLs
  const { data: headshots, error } = await supabase
    .from("saved_headshots")
    .select("id, user_id, generation_job_id, original_url")
    .or("original_url.like.%replicate.delivery%,original_url.like.%replicate.com%,original_url.like.%pbxt.replicate%");

  if (error) {
    console.error("Query error:", error);
    return;
  }

  console.log(`Found ${headshots?.length || 0} headshots with Replicate URLs`);

  if (!headshots?.length) {
    console.log("Nothing to migrate.");
    return;
  }

  let migrated = 0;
  let failed = 0;
  let expired = 0;

  for (const hs of headshots) {
    process.stdout.write(`[${migrated + failed + expired + 1}/${headshots.length}] ${hs.id.slice(0, 8)}... `);

    try {
      const res = await fetch(hs.original_url);

      if (!res.ok) {
        console.log(`EXPIRED (${res.status})`);
        expired++;
        continue;
      }

      const contentType = res.headers.get("content-type") || "image/png";
      const buffer = Buffer.from(await res.arrayBuffer());

      if (buffer.length < 1000) {
        console.log(`EXPIRED (too small: ${buffer.length}b)`);
        expired++;
        continue;
      }

      const ext = contentType.includes("webp") ? "webp" : "png";
      const key = `headshots/${hs.user_id}/${hs.generation_job_id || "unknown"}/${hs.id}.${ext}`;
      const permanentUrl = await uploadToR2(buffer, key, contentType);

      await supabase
        .from("saved_headshots")
        .update({ original_url: permanentUrl, thumbnail_url: permanentUrl })
        .eq("id", hs.id);

      console.log(`OK → ${permanentUrl.slice(-40)}`);
      migrated++;
    } catch (err) {
      console.log(`FAILED: ${err instanceof Error ? err.message : err}`);
      failed++;
    }
  }

  console.log(`\nDone: ${migrated} migrated, ${expired} expired, ${failed} failed`);

  if (expired > 0) {
    console.log(`\n⚠ ${expired} images had expired Replicate URLs and cannot be recovered.`);
    console.log("Consider deleting those rows or re-generating.");
  }
}

migrate().catch(console.error);
