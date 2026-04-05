export const APP_NAME = "HaloShot";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const FREE_GENERATION_LIMIT = 3;
export const PRO_GENERATION_LIMIT = Infinity;
export const DEFAULT_IMAGES_PER_GENERATION = 8;
export const PRO_IMAGES_PER_GENERATION = 12;
export const SIMILARITY_THRESHOLD = 0.5;
export const MAX_UPLOAD_SIZE_MB = 10;
export const MIN_IMAGE_DIMENSION = 512;
export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim());

export const SUBSCRIPTION_TIERS = {
  free: {
    name: "The Reality Check",
    price: 0,
    generations: 3,
    features: [
      "3 headshots total",
      "1 style",
      "Watermarked",
      "1024x1024",
    ],
  },
  pro: {
    name: "The Glow-Up",
    priceMonthly: 9.99,
    priceAnnual: 79.99,
    generations: Infinity,
    features: [
      "Unlimited generations",
      "All styles",
      "4K resolution",
      "No watermark",
      "Background swap",
      "Priority processing",
    ],
  },
  team: {
    name: "The Team Glow-Up",
    pricePerPerson: 7.99,
    minMembers: 5,
    generations: Infinity,
    features: [
      "Everything in The Glow-Up",
      "Consistent team styling",
      "Admin dashboard",
      "Brand guidelines",
      "Bulk export",
    ],
  },
} as const;
