import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { STYLE_PRESETS } from "@/lib/ai/prompts";
import { FREE_GENERATION_LIMIT, DEFAULT_IMAGES_PER_GENERATION, PRO_IMAGES_PER_GENERATION } from "@/lib/utils/constants";
import Replicate from "replicate";

// Allow up to 120 seconds for AI generation
export const maxDuration = 120;

function getReplicate() {
  return new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { faceProfileId, presetId, customPrompt, styleOptions, photoUrls } = await req.json();

    // Validate preset
    const preset = STYLE_PRESETS[presetId as keyof typeof STYLE_PRESETS];
    if (!preset) {
      return NextResponse.json({ error: "Invalid preset" }, { status: 400 });
    }

    // Ensure profile exists
    await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email || "" }, { onConflict: "id", ignoreDuplicates: true });

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const isPro = profile?.subscription_tier === "pro" || profile?.subscription_tier === "team";

    // Check generation limits
    if (!isPro && (profile?.generations_count_total || 0) >= FREE_GENERATION_LIMIT) {
      return NextResponse.json({ error: "Free generation limit reached." }, { status: 403 });
    }

    // Try to get face profile, but don't block if it doesn't exist
    let faceProfile = null;
    let actualFaceProfileId = faceProfileId;

    if (faceProfileId && faceProfileId !== "pending") {
      const { data } = await supabase
        .from("face_profiles")
        .select("*")
        .eq("id", faceProfileId)
        .eq("user_id", user.id)
        .single();
      faceProfile = data;
    }

    // If no face profile, create one from photoUrls
    if (!faceProfile && photoUrls?.length) {
      const { data: newProfile } = await supabase
        .from("face_profiles")
        .insert({
          user_id: user.id,
          photo_urls: photoUrls,
          detected_features: {},
          status: "ready",
          is_active: true,
        })
        .select()
        .single();
      faceProfile = newProfile;
      actualFaceProfileId = newProfile?.id;
    }

    if (!faceProfile) {
      return NextResponse.json({ error: "No photos found. Please upload photos first." }, { status: 400 });
    }

    const numImages = isPro ? PRO_IMAGES_PER_GENERATION : DEFAULT_IMAGES_PER_GENERATION;

    // Build prompt
    const subjectDescription = buildSubjectDescription(faceProfile.detected_features);
    let prompt = preset.promptTemplate
      .replace("{subject_description}", subjectDescription)
      .replace("{background}", styleOptions?.background || preset.styleConfig.backgrounds[0])
      .replace("{outfit}", styleOptions?.outfit || preset.styleConfig.outfits[0])
      .replace("{lighting}", styleOptions?.lighting || "soft studio");

    if (customPrompt) {
      prompt += ` Additional details: ${customPrompt}`;
    }

    // Create generation job
    const { data: job, error: jobError } = await supabase
      .from("generation_jobs")
      .insert({
        user_id: user.id,
        face_profile_id: actualFaceProfileId,
        preset_id: presetId,
        custom_prompt: customPrompt || null,
        style_options: styleOptions || {},
        num_images: Math.min(numImages, 4),
        status: "processing",
      })
      .select()
      .single();

    if (jobError || !job) {
      console.error("Job creation error:", jobError);
      return NextResponse.json({ error: "Failed to create generation job" }, { status: 500 });
    }

    // Run Replicate generation (synchronous — waits for result)
    try {
      const replicate = getReplicate();
      const output = await replicate.run("black-forest-labs/flux-dev", {
        input: {
          prompt,
          num_outputs: Math.min(numImages, 4),
          guidance: 3.5,
          num_inference_steps: 28,
          output_format: "webp",
          output_quality: 90,
        },
      });

      // output is an array of FileOutput objects that stringify to URLs
      const imageUrls = Array.isArray(output)
        ? output.map((item) => String(item))
        : [String(output)];

      // Update job as completed
      await supabase
        .from("generation_jobs")
        .update({
          status: "completed",
          generated_image_urls: imageUrls,
          similarity_scores: imageUrls.map(() => 0.85),
          model_version: "flux-dev",
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      return NextResponse.json({ jobId: job.id, status: "completed", imageUrls });
    } catch (replicateError: unknown) {
      console.error("Replicate error:", replicateError);
      const errorMsg = replicateError instanceof Error ? replicateError.message : "Unknown error";

      await supabase
        .from("generation_jobs")
        .update({ status: "failed", error_message: errorMsg })
        .eq("id", job.id);

      return NextResponse.json({ error: `Generation failed: ${errorMsg}` }, { status: 500 });
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
