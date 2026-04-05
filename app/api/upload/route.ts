import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MAX_UPLOAD_SIZE_MB, SUPPORTED_IMAGE_TYPES } from "@/lib/utils/constants";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];

    if (!files.length || files.length > 5) {
      return NextResponse.json(
        { error: "Please upload between 1 and 5 photos" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}. Use JPG, PNG, or WebP.` },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large. Maximum ${MAX_UPLOAD_SIZE_MB}MB.` },
          { status: 400 }
        );
      }

      // Upload to Supabase Storage
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("selfies")
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from("selfies")
        .getPublicUrl(path);

      uploadedUrls.push(urlData.publicUrl);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
