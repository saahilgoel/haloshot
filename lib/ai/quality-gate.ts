import { computeSimilarity } from "../replicate/face-similarity";
import { SIMILARITY_THRESHOLD } from "../utils/constants";

export interface ScoredImage {
  url: string;
  similarityScore: number;
  passed: boolean;
}

/**
 * Score every generated image against the reference face photos.
 * Uses the highest similarity score across all reference images.
 */
export async function scoreGeneration(
  referenceUrls: string[],
  generatedUrls: string[]
): Promise<ScoredImage[]> {
  const scored = await Promise.all(
    generatedUrls.map(async (generatedUrl) => {
      // Compare against all reference images and take the max score
      const scores = await Promise.all(
        referenceUrls.map((refUrl) => computeSimilarity(refUrl, generatedUrl))
      );
      const bestScore = Math.max(...scores, 0);

      return {
        url: generatedUrl,
        similarityScore: bestScore,
        passed: bestScore >= SIMILARITY_THRESHOLD,
      };
    })
  );

  return scored;
}

/**
 * Filter to only images that pass the similarity threshold.
 */
export function filterPassingImages(
  images: ScoredImage[],
  threshold: number = SIMILARITY_THRESHOLD
): ScoredImage[] {
  return images.filter((img) => img.similarityScore >= threshold);
}

/**
 * Rank images by quality (similarity score) in descending order.
 */
export function rankByQuality(images: ScoredImage[]): ScoredImage[] {
  return [...images].sort((a, b) => b.similarityScore - a.similarityScore);
}
