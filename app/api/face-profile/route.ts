import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoUrls, detectedFeatures } = await req.json();

    if (!photoUrls?.length) {
      return NextResponse.json({ error: "No photos provided" }, { status: 400 });
    }

    // Deactivate any existing face profiles
    await supabase
      .from("face_profiles")
      .update({ is_active: false })
      .eq("user_id", user.id);

    // Create new face profile
    const { data: profile, error } = await supabase
      .from("face_profiles")
      .insert({
        user_id: user.id,
        photo_urls: photoUrls,
        detected_features: detectedFeatures || {},
        status: "ready", // In production, this would be "processing" until embeddings are computed
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Face profile error:", error);
      return NextResponse.json({ error: "Failed to create face profile" }, { status: 500 });
    }

    return NextResponse.json({ faceProfile: profile });
  } catch (error) {
    console.error("Face profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profiles } = await supabase
      .from("face_profiles")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    return NextResponse.json({ profiles: profiles || [] });
  } catch (error) {
    console.error("Face profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
