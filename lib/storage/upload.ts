import { createAdminClient } from "../supabase/admin";

const DEFAULT_BUCKET = "uploads";

/**
 * Upload a file to Supabase Storage.
 * Returns the storage path (not the full URL).
 */
export async function uploadToSupabase(
  file: File | Buffer,
  userId: string,
  bucket: string = DEFAULT_BUCKET
): Promise<string> {
  const timestamp = Date.now();
  const extension =
    file instanceof File ? file.name.split(".").pop() || "jpg" : "jpg";
  const path = `${userId}/${timestamp}.${extension}`;

  const body = file instanceof File ? file : file;
  const contentType =
    file instanceof File ? file.type : `image/${extension}`;

  const { error } = await createAdminClient().storage.from(bucket).upload(path, body, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return path;
}

/**
 * Get the public CDN URL for a file in Supabase Storage.
 */
export function getPublicUrl(
  path: string,
  bucket: string = DEFAULT_BUCKET
): string {
  const { data } = createAdminClient().storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}
