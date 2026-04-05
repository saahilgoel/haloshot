import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check pro subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_tier === "free") {
      return NextResponse.json({ error: "Editor requires Pro subscription" }, { status: 403 });
    }

    const { imageUrl, editType, editParams } = await req.json();

    if (!imageUrl || !editType) {
      return NextResponse.json({ error: "Image URL and edit type required" }, { status: 400 });
    }

    let prediction;

    switch (editType) {
      case "background_swap": {
        prediction = await replicate.predictions.create({
          model: "cjwbw/rembg",
          input: { image: imageUrl },
        });
        break;
      }

      case "upscale": {
        prediction = await replicate.predictions.create({
          model: "nightmareai/real-esrgan",
          input: {
            image: imageUrl,
            scale: editParams?.scale || 4,
            face_enhance: true,
          },
        });
        break;
      }

      case "relight": {
        prediction = await replicate.predictions.create({
          model: "black-forest-labs/flux-dev",
          input: {
            prompt: `${editParams?.prompt || "Professional headshot with"} ${editParams?.lighting || "soft studio lighting"}`,
            image: imageUrl,
            guidance_scale: 3.5,
          },
        });
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown edit type" }, { status: 400 });
    }

    // Poll for result (simple implementation)
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      result = await replicate.predictions.get(result.id);
    }

    if (result.status === "failed") {
      return NextResponse.json({ error: "Edit failed" }, { status: 500 });
    }

    const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    return NextResponse.json({ editedUrl: outputUrl });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
