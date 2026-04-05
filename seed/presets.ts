/**
 * Seed script: Insert all style presets into the style_presets table.
 *
 * Run via: npx tsx seed/presets.ts
 * Or add to package.json: "seed": "tsx seed/presets.ts"
 */

import { createAdminClient } from "../lib/supabase/admin";
import { STYLE_PRESETS } from "../lib/ai/prompts";

async function seedPresets() {
  const presets = Object.values(STYLE_PRESETS).map((preset, index) => ({
    id: preset.id,
    name: preset.name,
    description: preset.description,
    category: preset.category,
    icon_emoji: preset.icon,
    prompt_template: preset.promptTemplate,
    negative_prompt: preset.negativePrompt,
    style_config: preset.styleConfig,
    is_free: preset.isFree,
    is_active: true,
    sort_order: index,
    preview_images: [],
  }));

  console.log(`Seeding ${presets.length} style presets...`);

  const { data, error } = await createAdminClient()
    .from("style_presets")
    .upsert(presets, { onConflict: "id" });

  if (error) {
    console.error("Failed to seed presets:", error);
    process.exit(1);
  }

  console.log("Successfully seeded style presets:", presets.map((p) => p.id));
  process.exit(0);
}

seedPresets();
