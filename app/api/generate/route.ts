import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { STYLE_PRESETS } from "@/lib/ai/prompts";
import { FREE_GENERATION_LIMIT, DEFAULT_IMAGES_PER_GENERATION, PRO_IMAGES_PER_GENERATION } from "@/lib/utils/constants";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { faceProfileId, presetId, customPrompt, styleOptions } = await req.json();

    // Validate preset
    const preset = STYLE_PRESETS[presetId as keyof typeof STYLE_PRESETS];
    if (!preset) {
      return NextResponse.json({ error: "Invalid preset" }, { status: 400 });
    }

    // Get user profile for subscription check
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check subscription for non-free presets
    const isPro = profile.subscription_tier === "pro" || profile.subscription_tier === "team";
    if (!preset.isFree && !isPro) {
      return NextResponse.json({ error: "Upgrade to Pro to use this style" }, { status: 403 });
    }

    // Check generation limits
    if (!isPro && profile.generations_count_total >= FREE_GENERATION_LIMIT) {
      return NextResponse.json({ error: "Free generation limit reached. Upgrade to Pro for unlimited generations." }, { status: 403 });
    }

    // Get face profile
    const { data: faceProfile } = await supabase
      .from("face_profiles")
      .select("*")
      .eq("id", faceProfileId)
      .eq("user_id", user.id)
      .single();

    if (!faceProfile || faceProfile.status !== "ready") {
      return NextResponse.json({ error: "Face profile not ready" }, { status: 400 });
    }

    const numImages = isPro ? PRO_IMAGES_PER_GENERATION : DEFAULT_IMAGES_PER_GENERATION;

    // Build the prompt
    const subjectDescription = buildSubjectDescription(faceProfile.detected_features);
    let prompt = preset.promptTemplate
      .replace("{subject_description}", subjectDescription)
      .replace("{background}", styleOptions?.background || preset.styleConfig.backgrounds[0])
      .replace("{outfit}", styleOptions?.outfit || preset.styleConfig.outfits[0])
      .replace("{lighting}", styleOptions?.lighting || preset.styleConfig.lighting?.[0] || "soft studio");

    if (customPrompt) {
      prompt += ` Additional details: ${customPrompt}`;
    }

    // Create generation job
    const { data: job, error: jobError } = await supabase
      .from("generation_jobs")
      .insert({
        user_id: user.id,
        face_profile_id: faceProfileId,
        preset_id: presetId,
        custom_prompt: customPrompt || null,
        style_options: styleOptions || {},
        num_images: numImages,
        status: "queued",
      })
      .select()
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Failed to create generation job" }, { status: 500 });
    }

    // Start Replicate prediction
    try {
      const prediction = await replicate.predictions.create({
        model: "black-forest-labs/flux-dev",
        input: {
          prompt,
          negative_prompt: preset.negativePrompt,
          num_outputs: Math.min(numImages, 4), // Flux does max 4 per batch
          guidance_scale: 3.5,
          num_inference_steps: 28,
          output_format: "webp",
          output_quality: 90,
        },
        webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/generate/webhook`,
        webhook_events_filter: ["completed", "output"],
      });

      // Update job with prediction ID
      await supabase
        .from("generation_jobs")
        .update({
          replicate_prediction_id: prediction.id,
          status: "processing",
          model_version: "flux-dev",
        })
        .eq("id", job.id);

      return NextResponse.json({ jobId: job.id, predictionId: prediction.id });
    } catch (replicateError) {
      await supabase
        .from("generation_jobs")
        .update({ status: "failed", error_message: "Failed to start AI generation" })
        .eq("id", job.id);

      return NextResponse.json({ error: "Failed to start generation" }, { status: 500 });
    }
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildSubjectDescription(features: Record<string, string> | null): string {
  if (!features) return "a person";
  const parts: string[] = [];
  if (features.gender) parts.push(features.gender);
  if (features.skin_tone) parts.push(`with ${features.skin_tone} skin tone`);
  if (features.hair_color) parts.push(`${features.hair_color} hair`);
  if (features.glasses) parts.push("wearing glasses");
  if (features.facial_hair) parts.push(`with ${features.facial_hair}`);
  return parts.length > 0 ? `a ${parts.join(", ")}` : "a person";
}
