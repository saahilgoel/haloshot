export const MODELS = {
  flux_dev: {
    id: "black-forest-labs/flux-dev" as const,
    version: "latest",
    description: "High-quality image generation with face conditioning support",
  },
  flux_schnell: {
    id: "black-forest-labs/flux-schnell" as const,
    version: "latest",
    description: "Fast image generation for previews and drafts",
  },
  face_swap: {
    id: "lucataco/faceswap" as const,
    version: "latest",
    description: "Face swap for post-processing headshots",
  },
  background_remove: {
    id: "cjwbw/rembg" as const,
    version: "latest",
    description: "Remove background from headshot images",
  },
  upscale: {
    id: "nightmareai/real-esrgan" as const,
    version: "latest",
    description: "Upscale images to 4K resolution",
  },
} as const;

export type ModelKey = keyof typeof MODELS;
