import { NextRequest, NextResponse } from "next/server";
import { analyzePhoto, HaloScoreResult } from "@/lib/ai/halo-score";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

const FREE_DAILY_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth (optional - unauthenticated users get limited access)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Rate limiting for free users
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();

      if (profile?.subscription_tier === "free") {
        // Count today's scores
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const { count } = await supabase
          .from("halo_scores")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", todayStart.toISOString());

        if ((count ?? 0) >= FREE_DAILY_LIMIT) {
          return NextResponse.json(
            {
              error: "Daily limit reached",
              message: `Free accounts are limited to ${FREE_DAILY_LIMIT} scores per day. Upgrade to Pro for unlimited scores.`,
              limit: FREE_DAILY_LIMIT,
              used: count,
            },
            { status: 429 }
          );
        }
      }
    }

    // Parse request - accept JSON with photoUrl or multipart form with file
    let photoUrl: string;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("photo") as File | null;
      if (!file) {
        return NextResponse.json(
          { error: "No photo file provided" },
          { status: 400 }
        );
      }

      // Convert file to base64 data URL
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      photoUrl = `data:${file.type};base64,${base64}`;
    } else {
      const body = await req.json();
      photoUrl = body.photoUrl;
      if (!photoUrl) {
        return NextResponse.json(
          { error: "photoUrl is required" },
          { status: 400 }
        );
      }
    }

    // Analyze the photo
    const result: HaloScoreResult = await analyzePhoto(photoUrl);

    // Store in database if authenticated
    let scoreId: string | null = null;
    let faceProfileId: string | null = null;
    if (user) {
      const { data: scoreRow, error: insertError } = await supabase
        .from("halo_scores")
        .insert({
          user_id: user.id,
          photo_url: photoUrl.startsWith("data:") ? null : photoUrl,
          overall_score: result.overall_score,
          warmth_score: result.warmth_score,
          competence_score: result.competence_score,
          trustworthiness_score: result.trustworthiness_score,
          approachability_score: result.approachability_score,
          dominance_score: result.dominance_score,
          analysis_text: result.analysis_text,
          roast_line: result.roast_line,
          improvement_tips: result.improvement_tips,
          lighting_quality: result.lighting_quality,
          background_quality: result.background_quality,
          expression_type: result.expression_type,
          eye_contact: result.eye_contact,
          professional_readiness: result.professional_readiness,
        })
        .select("id")
        .single();

      if (!insertError && scoreRow) {
        scoreId = scoreRow.id;

        // Update profile's current halo score
        await supabase
          .from("profiles")
          .update({ current_halo_score: result.overall_score })
          .eq("id", user.id);
      }

      // If uploaded as a file (multipart), save to storage and create/update face_profile
      if (contentType.includes("multipart/form-data") && photoUrl.startsWith("data:")) {
        try {
          const mimeMatch = photoUrl.match(/^data:(image\/\w+);/);
          const ext = mimeMatch ? mimeMatch[1].split("/")[1] : "jpg";
          const filePath = `references/${user.id}/${Date.now()}.${ext}`;

          // Decode base64 and upload to Supabase Storage
          const base64Data = photoUrl.split(",")[1];
          const fileBuffer = Buffer.from(base64Data, "base64");

          const { error: uploadError } = await supabase.storage
            .from("headshots")
            .upload(filePath, fileBuffer, {
              contentType: mimeMatch ? mimeMatch[1] : "image/jpeg",
              upsert: false,
            });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from("headshots")
              .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            // Deactivate existing face profiles
            await supabase
              .from("face_profiles")
              .update({ is_active: false })
              .eq("user_id", user.id);

            // Create new face profile with the scored photo
            const { data: faceProfile } = await supabase
              .from("face_profiles")
              .insert({
                user_id: user.id,
                photo_urls: [publicUrl],
                detected_features: {},
                status: "ready",
                is_active: true,
              })
              .select("id")
              .single();

            if (faceProfile) {
              faceProfileId = faceProfile.id;
            }
          }
        } catch (fpError) {
          console.error("Failed to save scored photo as face profile:", fpError);
          // Non-blocking — scoring still succeeds
        }
      }
    }

    return NextResponse.json({
      id: scoreId,
      ...(faceProfileId ? { face_profile_id: faceProfileId } : {}),
      ...result,
    });
  } catch (error) {
    console.error("Halo Score error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze photo",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
