import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { STYLE_PRESETS } from "@/lib/ai/prompts";
import { FREE_GENERATION_LIMIT, DEFAULT_IMAGES_PER_GENERATION, PRO_IMAGES_PER_GENERATION } from "@/lib/utils/constants";

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

    if (!isPro && (profile?.generations_count_total || 0) >= FREE_GENERATION_LIMIT) {
      return NextResponse.json({ error: "Free generation limit reached." }, { status: 403 });
    }

    // Get or create face profile
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

    const referencePhotoUrl = faceProfile.photo_urls?.[0];
    if (!referencePhotoUrl) {
      return NextResponse.json({ error: "No reference photo found" }, { status: 400 });
    }

    const numImages = isPro ? PRO_IMAGES_PER_GENERATION : DEFAULT_IMAGES_PER_GENERATION;
    const batchSize = Math.min(numImages, 4);

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
        num_images: batchSize,
        status: "processing",
      })
      .select()
      .single();

    if (jobError || !job) {
      console.error("Job creation error:", jobError);
      return NextResponse.json({ error: "Failed to create generation job" }, { status: 500 });
    }

    // Fire off async predictions with webhooks — returns IMMEDIATELY
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/generate/webhook`;

    try {
      const predictionIds: string[] = [];

      for (let i = 0; i < batchSize; i++) {
        const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-dev/predictions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: {
              prompt: `${prompt} Variation ${i + 1}, unique pose and expression.`,
              input_image: referencePhotoUrl,
              aspect_ratio: "3:4",
              guidance: 3.5,
              num_inference_steps: 28,
              output_format: "webp",
              output_quality: 90,
              seed: Math.floor(Math.random() * 1000000) + i * 1000,
            },
            webhook: webhookUrl,
            webhook_events_filter: ["completed"],
          }),
        });

        if (!res.ok) {
          const errBody = await res.text();
          console.error(`Replicate prediction ${i} failed:`, errBody);
          continue;
        }

        const prediction = await res.json();
        predictionIds.push(prediction.id);
      }

      if (predictionIds.length === 0) {
        await supabase
          .from("generation_jobs")
          .update({ status: "failed", error_message: "Failed to start any predictions" })
          .eq("id", job.id);
        return NextResponse.json({ error: "Failed to start generation" }, { status: 500 });
      }

      // Store prediction IDs in the job
      await supabase
        .from("generation_jobs")
        .update({
          replicate_prediction_id: predictionIds.join(","),
          model_version: "flux-kontext-dev",
        })
        .eq("id", job.id);

      // Return immediately — webhook will update the job when images are ready
      return NextResponse.json({ jobId: job.id, predictions: predictionIds.length });
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
