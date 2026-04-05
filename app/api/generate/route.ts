import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { STYLE_PRESETS } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { presetId, photoUrls } = await req.json();

    const preset = STYLE_PRESETS[presetId as keyof typeof STYLE_PRESETS];
    if (!preset) {
      return NextResponse.json({ error: "Invalid preset" }, { status: 400 });
    }

    const referencePhotoUrl = photoUrls?.[0];
    if (!referencePhotoUrl) {
      return NextResponse.json({ error: "No photo provided" }, { status: 400 });
    }

    // Build prompt — minimal, fast
    const prompt = preset.promptTemplate
      .replace("{subject_description}", "this person")
      .replace("{background}", preset.styleConfig.backgrounds[0])
      .replace("{outfit}", preset.styleConfig.outfits[0])
      .replace("{lighting}", "soft studio");

    // Fire ONE prediction — fast, avoids rate limits, stays under 10s timeout
    const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-dev/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          prompt,
          input_image: referencePhotoUrl,
          aspect_ratio: "3:4",
          guidance: 3.5,
          num_inference_steps: 28,
          output_format: "webp",
          output_quality: 90,
        },
        webhook: `https://haloshot.com/api/generate/webhook`,
        webhook_events_filter: ["completed"],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Replicate error:", errText);
      return NextResponse.json({ error: `Replicate: ${errText}` }, { status: 500 });
    }

    const prediction = await res.json();

    // Get or create a face profile for this user
    let { data: faceProfile } = await supabase
      .from("face_profiles")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!faceProfile) {
      const { data: newFp } = await supabase
        .from("face_profiles")
        .insert({ user_id: user.id, photo_urls: photoUrls, detected_features: {}, status: "ready", is_active: true })
        .select("id")
        .single();
      faceProfile = newFp;
    }

    // Create job record
    const { data: job } = await supabase
      .from("generation_jobs")
      .insert({
        user_id: user.id,
        face_profile_id: faceProfile?.id,
        preset_id: presetId,
        num_images: 1,
        status: "processing",
        replicate_prediction_id: prediction.id,
        model_version: "flux-kontext-dev",
      })
      .select()
      .single();

    return NextResponse.json({
      jobId: job?.id || prediction.id,
      predictionId: prediction.id,
      status: "processing"
    });
  } catch (error) {
    console.error("Generate error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
