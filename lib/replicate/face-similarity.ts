import { replicate } from "./client";
import { SIMILARITY_THRESHOLD } from "../utils/constants";

/**
 * Compute cosine similarity between face embeddings of two images.
 * Uses an InsightFace embedding model on Replicate to extract 512-d vectors,
 * then computes cosine similarity locally.
 *
 * Returns a score between 0 (completely different) and 1 (identical).
 */
export async function computeSimilarity(
  imageUrl1: string,
  imageUrl2: string
): Promise<number> {
  // Run InsightFace embedding extraction for both images in parallel
  const [embedding1, embedding2] = await Promise.all([
    getEmbedding(imageUrl1),
    getEmbedding(imageUrl2),
  ]);

  if (!embedding1 || !embedding2) {
    // If face detection failed for either image, return 0
    return 0;
  }

  return cosineSimilarity(embedding1, embedding2);
}

/**
 * Filter generated images by similarity to a reference face.
 * Returns only images that pass the threshold.
 */
export async function filterBySimilarity(
  referenceUrl: string,
  generatedUrls: string[],
  threshold: number = SIMILARITY_THRESHOLD
): Promise<{ url: string; score: number }[]> {
  const results = await Promise.all(
    generatedUrls.map(async (url) => {
      const score = await computeSimilarity(referenceUrl, url);
      return { url, score };
    })
  );

  return results
    .filter((r) => r.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function getEmbedding(imageUrl: string): Promise<number[] | null> {
  try {
    const output = await replicate.run(
      "daanelson/insightface:latest" as `${string}/${string}:${string}`,
      {
        input: {
          image: imageUrl,
          return_embedding: true,
        },
      }
    );

    // The model returns an array of detected faces, each with an embedding
    if (Array.isArray(output) && output.length > 0) {
      return (output[0] as any).embedding as number[];
    }

    return null;
  } catch {
    return null;
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}
