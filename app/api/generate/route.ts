import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { STYLE_PRESETS } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { presetId, photoUrls, model = "studio", count } = await req.json();

    const preset = STYLE_PRESETS[presetId as keyof typeof STYLE_PRESETS];
    if (!preset) {
      return NextResponse.json({ error: "Invalid preset" }, { status: 400 });
    }

    const referencePhotoUrl = photoUrls?.[0];
    if (!referencePhotoUrl) {
      return NextResponse.json({ error: "No photo provided" }, { status: 400 });
    }

    if (model !== "studio" && model !== "fast" && model !== "quick") {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    // Check subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const isPro = profile?.subscription_tier === "pro" || profile?.subscription_tier === "team";
    const defaultCount = isPro ? 8 : 4;
    const totalImages = count ? Math.min(count, 8) : defaultCount;

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
        .insert({
          user_id: user.id,
          photo_urls: photoUrls,
          detected_features: {},
          status: "ready",
          is_active: true,
        })
        .select("id")
        .single();
      faceProfile = newFp;
    }

    // Fire all predictions in parallel via Replicate HTTP API
    const backgrounds = preset.styleConfig.backgrounds;
    const outfits = preset.styleConfig.outfits;

    const predictionPromises = Array.from({ length: totalImages }, async (_, i) => {
      const bg = backgrounds[i % backgrounds.length].replace(/_/g, " ");
      const outfit = outfits[i % outfits.length].replace(/_/g, " ");

      const prompt = `Transform this photo into a professional headshot. Keep the person's face, features, and identity exactly the same. Change the background to ${bg}. Dress them in ${outfit}. Studio lighting, sharp focus on eyes, professional photographer quality. Do not change the person's face or ethnicity.`;

      let apiUrl: string;
      let inputPayload: Record<string, unknown>;

      if (model === "studio") {
        // Nano Banana 2 — best quality, 2K
        apiUrl =
          "https://api.replicate.com/v1/models/google/nano-banana-2/predictions";
        inputPayload = {
          prompt,
          image_input: photoUrls,
          resolution: "2K",
          aspect_ratio: "3:4",
          output_format: "png",
        };
      } else if (model === "fast") {
        // Nano Banana 1 — cheaper, still good
        apiUrl =
          "https://api.replicate.com/v1/models/google/nano-banana/predictions";
        inputPayload = {
          prompt,
          image_input: photoUrls,
          aspect_ratio: "3:4",
          output_format: "png",
        };
      } else {
        // Flux Kontext Pro — different aesthetic
        apiUrl =
          "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions";
        inputPayload = {
          prompt,
          input_image: referencePhotoUrl,
          aspect_ratio: "3:4",
          output_format: "jpg",
        };
      }

      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: inputPayload,
            webhook: `https://haloshot.com/api/generate/webhook`,
            webhook_events_filter: ["completed"],
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`Replicate error for prediction ${i}:`, errText);
          return null;
        }

        const prediction = await res.json();
        return prediction.id as string;
      } catch (err) {
        console.error(`Failed to create prediction ${i}:`, err);
        return null;
      }
    });

    const results = await Promise.all(predictionPromises);
    const predictionIds = results.filter((id): id is string => id !== null);

    // If primary model failed, fall back to Flux Kontext Pro
    let actualModel = model;
    if (predictionIds.length === 0 && model !== "quick") {
      console.log(`Primary model failed, falling back to Flux Kontext Pro`);
      const fallbackPromises = Array.from({ length: Math.min(totalImages, 4) }, async (_, i) => {
        const bg = backgrounds[i % backgrounds.length].replace(/_/g, " ");
        const outfit = outfits[i % outfits.length].replace(/_/g, " ");
        const prompt = `Transform this photo into a professional headshot. Keep the person's face, features, and identity exactly the same. Change the background to ${bg}. Dress them in ${outfit}. Studio lighting, sharp focus on eyes, professional photographer quality. Do not change the person's face or ethnicity.`;

        try {
          const res = await fetch(
            "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                input: { prompt, input_image: referencePhotoUrl, aspect_ratio: "3:4", output_format: "jpg" },
                webhook: `https://haloshot.com/api/generate/webhook`,
                webhook_events_filter: ["completed"],
              }),
            }
          );
          if (!res.ok) return null;
          const prediction = await res.json();
          return prediction.id as string;
        } catch { return null; }
      });

      const fallbackResults = await Promise.all(fallbackPromises);
      predictionIds.push(...fallbackResults.filter((id): id is string => id !== null));
      actualModel = "quick";
    }

    if (predictionIds.length === 0) {
      return NextResponse.json(
        { error: "All models are currently unavailable. Please try again in a few minutes." },
        { status: 503 }
      );
    }

    const modelVersion =
      actualModel === "studio" ? "nano-banana-2" : actualModel === "fast" ? "nano-banana" : "flux-kontext-pro";

    // Create job record with all prediction IDs
    const { data: job } = await supabase
      .from("generation_jobs")
      .insert({
        user_id: user.id,
        face_profile_id: faceProfile?.id,
        preset_id: presetId,
        num_images: predictionIds.length,
        status: "processing",
        replicate_prediction_id: predictionIds.join(","),
        model_version: modelVersion,
      })
      .select()
      .single();

    return NextResponse.json({
      jobId: job?.id || predictionIds[0],
      totalImages: predictionIds.length,
      model: modelVersion,
      status: "processing",
    });
  } catch (error) {
    console.error("Generate error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
