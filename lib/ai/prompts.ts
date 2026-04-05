export interface StylePreset {
  id: string;
  name: string;
  description: string;
  category:
    | "professional"
    | "creative"
    | "dating"
    | "social"
    | "corporate"
    | "industry";
  icon: string;
  isFree: boolean;
  promptTemplate: string;
  negativePrompt: string;
  styleConfig: {
    backgrounds: string[];
    outfits: string[];
    lighting: string[];
  };
}

export const STYLE_PRESETS: Record<string, StylePreset> = {
  linkedin_professional: {
    id: "linkedin_professional",
    name: "LinkedIn Professional",
    description:
      "Clean, confident headshot perfect for LinkedIn and corporate profiles",
    category: "professional",
    icon: "briefcase",
    isFree: true,
    promptTemplate:
      "Professional headshot portrait of {subject}, wearing {outfit}, against a {background} background. Soft studio lighting, sharp focus on face, shallow depth of field, confident expression, looking directly at camera. Corporate photography style, high-end studio portrait.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, illustration, oversaturated, unnatural skin, bad teeth, crossed eyes",
    styleConfig: {
      backgrounds: [
        "neutral gray gradient",
        "soft blue gradient",
        "white studio",
        "light beige",
      ],
      outfits: [
        "a dark navy blazer over a white shirt",
        "a charcoal suit with a subtle tie",
        "business professional attire",
        "a well-fitted dark suit",
      ],
      lighting: [
        "soft studio lighting",
        "Rembrandt lighting",
        "butterfly lighting",
      ],
    },
  },

  founder_speaker: {
    id: "founder_speaker",
    name: "Founder / Speaker",
    description:
      "Bold, approachable look for founders, speakers, and thought leaders",
    category: "professional",
    icon: "mic",
    isFree: false,
    promptTemplate:
      "Charismatic portrait of {subject}, wearing {outfit}, {background}. Warm directional lighting, slight smile conveying confidence, editorial photography style. Shallow depth of field, bokeh background, magazine-quality portrait.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, illustration, oversaturated, unnatural skin",
    styleConfig: {
      backgrounds: [
        "in a modern office with floor-to-ceiling windows",
        "against a dark textured wall with warm accent lighting",
        "on stage with soft spotlight",
        "in a co-working space with natural light",
      ],
      outfits: [
        "a crisp black turtleneck",
        "a smart-casual blazer with no tie",
        "a fitted crew-neck sweater",
        "a casual button-down shirt",
      ],
      lighting: [
        "warm directional lighting",
        "golden hour side lighting",
        "editorial studio lighting",
      ],
    },
  },

  creative_portfolio: {
    id: "creative_portfolio",
    name: "Creative Portfolio",
    description:
      "Artistic, moody headshot for designers, artists, and creatives",
    category: "creative",
    icon: "palette",
    isFree: false,
    promptTemplate:
      "Artistic portrait of {subject}, wearing {outfit}, {background}. Dramatic lighting with deep shadows, creative composition, moody atmosphere. Editorial fashion photography style, cinematic color grading, artistic expression.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, overly bright, flat lighting, corporate look",
    styleConfig: {
      backgrounds: [
        "in a dimly lit art studio with paint splatters",
        "against a textured concrete wall",
        "in a gallery with dramatic shadows",
        "against a dark backdrop with colored gel lighting",
      ],
      outfits: [
        "a black leather jacket",
        "an oversized vintage sweater",
        "a minimalist black top",
        "a bold patterned shirt",
      ],
      lighting: [
        "dramatic side lighting",
        "split lighting",
        "rim lighting with colored gels",
      ],
    },
  },

  dating_warm: {
    id: "dating_warm",
    name: "Dating Profile",
    description:
      "Warm, approachable, and natural look for dating app profiles",
    category: "dating",
    icon: "heart",
    isFree: false,
    promptTemplate:
      "Natural, warm portrait of {subject}, wearing {outfit}, {background}. Soft natural sunlight, genuine smile, approachable and friendly expression. Lifestyle photography style, warm color tones, natural setting, candid feel.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, corporate, stiff pose, fake smile, oversaturated",
    styleConfig: {
      backgrounds: [
        "outdoors in a sunlit park with bokeh foliage",
        "in a cozy coffee shop with warm tones",
        "on a city street during golden hour",
        "in front of colorful street art",
      ],
      outfits: [
        "a casual fitted t-shirt",
        "a light linen shirt",
        "a comfortable henley",
        "a casual denim jacket",
      ],
      lighting: [
        "golden hour natural light",
        "soft window light",
        "warm ambient lighting",
      ],
    },
  },

  corporate_team: {
    id: "corporate_team",
    name: "Corporate Team",
    description:
      "Consistent, polished team headshots for company websites and directories",
    category: "corporate",
    icon: "users",
    isFree: false,
    promptTemplate:
      "Professional corporate headshot of {subject}, wearing {outfit}, against a {background} background. Even studio lighting, neutral expression with slight smile, looking directly at camera. Consistent corporate photography, clean and polished, suitable for company website.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, illustration, dramatic lighting, casual setting",
    styleConfig: {
      backgrounds: [
        "clean white",
        "light gray gradient",
        "corporate blue gradient",
        "neutral cream",
      ],
      outfits: [
        "a dark business suit with tie",
        "business formal attire",
        "a professional blazer and collared shirt",
        "corporate business wear",
      ],
      lighting: [
        "even studio lighting",
        "flat professional lighting",
        "soft frontal lighting",
      ],
    },
  },

  real_estate: {
    id: "real_estate",
    name: "Real Estate Agent",
    description:
      "Trustworthy, professional headshot for real estate marketing materials",
    category: "industry",
    icon: "home",
    isFree: false,
    promptTemplate:
      "Professional real estate agent portrait of {subject}, wearing {outfit}, {background}. Bright, clean lighting, trustworthy warm smile, approachable and professional. Commercial photography style, high-end quality, suitable for yard signs and brochures.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, dark, moody, artistic",
    styleConfig: {
      backgrounds: [
        "in front of a luxury home exterior",
        "against a bright white studio backdrop",
        "in a modern home interior",
        "with a soft blue gradient background",
      ],
      outfits: [
        "a sharp blazer with an open collar",
        "professional business attire",
        "a well-tailored suit",
        "smart business casual wear",
      ],
      lighting: [
        "bright natural light",
        "soft fill lighting",
        "clean studio lighting",
      ],
    },
  },

  social_media: {
    id: "social_media",
    name: "Social Media",
    description:
      "Eye-catching, vibrant headshot optimized for Instagram and social profiles",
    category: "social",
    icon: "camera",
    isFree: false,
    promptTemplate:
      "Vibrant social media portrait of {subject}, wearing {outfit}, {background}. Trendy photography style, punchy colors, slightly editorial feel. Modern composition, Instagram-worthy, high engagement aesthetic, confident and stylish.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, dull colors, corporate, boring, stiff",
    styleConfig: {
      backgrounds: [
        "against a neon-lit urban wall",
        "with colorful bokeh city lights",
        "in a trendy minimalist space",
        "against a vibrant mural",
      ],
      outfits: [
        "trendy streetwear",
        "a stylish oversized jacket",
        "a bold colored top",
        "fashionable casual attire",
      ],
      lighting: [
        "neon accent lighting",
        "golden hour backlight",
        "ring light with soft fill",
      ],
    },
  },

  indian_professional: {
    id: "indian_professional",
    name: "Indian Professional",
    description:
      "Optimized for South Asian skin tones and features with culturally relevant styling",
    category: "professional",
    icon: "star",
    isFree: false,
    promptTemplate:
      "Professional headshot portrait of {subject}, wearing {outfit}, against a {background} background. Optimized studio lighting for South Asian skin tones, true-to-life skin color reproduction. Confident and warm expression, sharp focus on face, high-end studio portrait photography. Accurate skin tone representation, no whitewashing.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, illustration, whitewashed skin, oversaturated, unnatural skin tone, pale skin",
    styleConfig: {
      backgrounds: [
        "warm neutral gradient",
        "soft cream studio backdrop",
        "elegant dark backdrop",
        "subtle earth-toned gradient",
      ],
      outfits: [
        "a crisp formal shirt with collar",
        "a well-fitted blazer in charcoal",
        "traditional formal wear",
        "smart Indo-Western fusion attire",
      ],
      lighting: [
        "warm balanced studio lighting",
        "soft diffused lighting for even skin tones",
        "Rembrandt lighting with warm fill",
      ],
    },
  },
};

/**
 * Build a complete prompt by filling in a preset template with subject
 * details and optional overrides.
 */
export function buildPrompt(
  presetId: string,
  subjectDescription: string,
  options?: {
    background?: string;
    outfit?: string;
    lighting?: string;
  }
): string {
  const preset = STYLE_PRESETS[presetId];
  if (!preset) {
    throw new Error(`Unknown style preset: ${presetId}`);
  }

  const { styleConfig, promptTemplate } = preset;

  const background =
    options?.background ??
    styleConfig.backgrounds[
      Math.floor(Math.random() * styleConfig.backgrounds.length)
    ];

  const outfit =
    options?.outfit ??
    styleConfig.outfits[
      Math.floor(Math.random() * styleConfig.outfits.length)
    ];

  const lighting =
    options?.lighting ??
    styleConfig.lighting[
      Math.floor(Math.random() * styleConfig.lighting.length)
    ];

  let prompt = promptTemplate
    .replace("{subject}", subjectDescription)
    .replace("{outfit}", outfit)
    .replace("{background}", background);

  // Append lighting instruction if not already embedded
  if (!prompt.toLowerCase().includes(lighting.toLowerCase())) {
    prompt += ` ${lighting}.`;
  }

  return prompt;
}
