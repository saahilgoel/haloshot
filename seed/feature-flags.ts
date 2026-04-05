/**
 * Seed script: Insert default feature flags.
 *
 * Run via: npx tsx seed/feature-flags.ts
 */

import { createAdminClient } from "../lib/supabase/admin";

const DEFAULT_FLAGS = [
  {
    id: "waitlist_mode",
    description:
      "Enable waitlist instead of direct signup. When on, new users are added to the waitlist and need an invite to access the app.",
    enabled: false,
    rollout_percentage: 0,
    config: {},
  },
  {
    id: "referral_program",
    description:
      "Enable referral program. Users can share referral codes and earn credits when friends sign up.",
    enabled: true,
    rollout_percentage: 100,
    config: {
      credits_per_referral: 1,
      max_credits: 10,
    },
  },
  {
    id: "team_plan",
    description:
      "Enable Team plan subscription tier. Shows team pricing on the pricing page and unlocks team management features.",
    enabled: false,
    rollout_percentage: 0,
    config: {},
  },
  {
    id: "advanced_editor",
    description:
      "Enable post-generation image editor with background swap, outfit change, and lighting adjustments.",
    enabled: false,
    rollout_percentage: 0,
    config: {},
  },
  {
    id: "social_sharing",
    description:
      "Enable social sharing features. Users can share generated headshots via public links and to social platforms.",
    enabled: true,
    rollout_percentage: 100,
    config: {},
  },
];

async function seedFeatureFlags() {
  console.log(`Seeding ${DEFAULT_FLAGS.length} feature flags...`);

  const { error } = await createAdminClient()
    .from("feature_flags")
    .upsert(DEFAULT_FLAGS, { onConflict: "id" });

  if (error) {
    console.error("Failed to seed feature flags:", error);
    process.exit(1);
  }

  console.log(
    "Successfully seeded feature flags:",
    DEFAULT_FLAGS.map((f) => `${f.id} (${f.enabled ? "ON" : "OFF"})`)
  );
  process.exit(0);
}

seedFeatureFlags();
