import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl, prompt, headshotId } = await req.json();

    if (!imageUrl || !prompt) {
      return NextResponse.json({ error: "Image URL and prompt required" }, { status: 400 });
    }

    // Use Flux Kontext Pro for prompt-based editing (fast, good at edits)
    const res = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            prompt: `${prompt}. Keep the person's face and identity exactly the same. Professional quality.`,
            input_image: imageUrl,
            aspect_ratio: "3:4",
            output_format: "jpg",
          },
          webhook: `https://haloshot.com/api/generate/webhook`,
          webhook_events_filter: ["completed"],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Replicate edit error:", res.status, errText);

      // Provide more specific error messages based on status
      if (res.status === 422) {
        return NextResponse.json({ error: "Invalid image or prompt. Please try a different image." }, { status: 422 });
      }
      if (res.status === 429) {
        return NextResponse.json({ error: "Service is busy. Please try again in a minute." }, { status: 429 });
      }
      if (res.status >= 500) {
        return NextResponse.json({ error: "AI service is temporarily unavailable. Please try again shortly." }, { status: 502 });
      }
      return NextResponse.json({ error: "Failed to start edit. Please try again." }, { status: 500 });
    }

    const prediction = await res.json();

    // Create a job so the webhook can find it
    await supabase.from("generation_jobs").insert({
      user_id: user.id,
      preset_id: "edit",
      num_images: 1,
      status: "processing",
      replicate_prediction_id: prediction.id,
      model_version: "flux-kontext-pro-edit",
      face_profile_id: null, // Edit jobs don't have a face profile
    });

    return NextResponse.json({ ok: true, predictionId: prediction.id });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
