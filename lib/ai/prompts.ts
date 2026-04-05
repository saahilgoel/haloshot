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
  haloPitch: string;
  promptTemplate: string;
  negativePrompt: string;
  styleConfig: {
    backgrounds: string[];
    outfits: string[];
    lighting: string[];
  };
}

export const STYLE_PRESETS: Record<string, StylePreset> = {
  linkedin_executive: {
    id: "linkedin_executive",
    name: "The Closer",
    description:
      "Power headshot that signals executive presence. Optimized for LinkedIn, board decks, and press features.",
    category: "professional",
    icon: "briefcase",
    isFree: true,
    haloPitch:
      "Boosts Competence +2.1 and Trust +1.8 on average. The #1 preset for landing inbound recruiter messages.",
    promptTemplate:
      "Executive portrait of {subject}, wearing {outfit}, against a {background} background. Precise studio lighting with subtle rim light, razor-sharp focus on eyes, shallow depth of field. Commanding yet approachable expression, slight forward lean suggesting engagement. Shot on medium format digital, corporate editorial quality.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, illustration, oversaturated, unnatural skin, bad teeth, crossed eyes, casual setting",
    styleConfig: {
      backgrounds: [
        "deep charcoal gradient",
        "navy blue gradient",
        "warm gray studio",
        "soft white with subtle shadow",
      ],
      outfits: [
        "a tailored navy blazer over a crisp white shirt",
        "a charcoal suit with a subtle navy tie",
        "a well-cut dark suit with pocket square",
        "a premium navy turtleneck under a structured blazer",
      ],
      lighting: [
        "Rembrandt lighting with subtle fill",
        "butterfly lighting with rim accent",
        "loop lighting with soft kicker",
      ],
    },
  },

  founder_energy: {
    id: "founder_energy",
    name: "Founder Mode",
    description:
      "The shot that says 'I just closed a round and I am building the future.' For pitch decks, TechCrunch, and your About page.",
    category: "professional",
    icon: "rocket",
    isFree: false,
    haloPitch:
      "Maximizes Dominance +2.4 and Approachability +1.6. The paradox combo that makes VCs reply to your cold email.",
    promptTemplate:
      "Charismatic founder portrait of {subject}, wearing {outfit}, {background}. Dynamic editorial lighting with warm directional key, confident half-smile suggesting knowing something others do not, slight head tilt conveying curiosity. Shallow depth of field, cinematic bokeh, magazine cover quality. Shot like a Forbes 30 Under 30 feature.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, illustration, oversaturated, unnatural skin, corporate stiffness, formal pose",
    styleConfig: {
      backgrounds: [
        "in a modern loft office with floor-to-ceiling windows and city skyline",
        "against an exposed brick wall with warm Edison bulb lighting",
        "in a sleek co-working space with blurred monitors in background",
        "against a dark textured wall with warm accent spot",
      ],
      outfits: [
        "a crisp black turtleneck",
        "a fitted dark henley with sleeves slightly pushed up",
        "a smart casual blazer over a premium crew-neck tee",
        "a minimal dark zip-up over a clean white tee",
      ],
      lighting: [
        "warm golden directional with subtle fill",
        "editorial side lighting with background separation",
        "natural window light with warm bounce",
      ],
    },
  },

  dating_magnetic: {
    id: "dating_magnetic",
    name: "Main Character",
    description:
      "The photo that gets right-swiped. Warm, magnetic, effortlessly attractive. Optimized for Hinge, Bumble, and your Instagram grid.",
    category: "dating",
    icon: "sparkles",
    isFree: false,
    haloPitch:
      "Warmth +2.8, Approachability +2.5. Users report 3x more matches within the first week of switching their main photo.",
    promptTemplate:
      "Naturally attractive portrait of {subject}, wearing {outfit}, {background}. Soft golden light creating warm skin tones, genuine relaxed smile with slight squint suggesting real laughter, candid energy. Shallow depth of field with dreamy bokeh, lifestyle photography feel. The kind of photo that looks effortless but is perfectly lit.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, corporate, stiff, fake smile, oversaturated, gym selfie, bathroom mirror, sunglasses",
    styleConfig: {
      backgrounds: [
        "outdoors in golden hour sunlight with warm bokeh foliage",
        "at a sunlit cafe terrace with soft ambient warmth",
        "on a city rooftop during magic hour with soft sky",
        "in a cozy bookstore with warm window light",
      ],
      outfits: [
        "a well-fitted casual linen shirt, top button undone",
        "a soft knit henley in earth tones",
        "a casual fitted crew-neck tee that fits perfectly",
        "a light casual button-down with rolled sleeves",
      ],
      lighting: [
        "golden hour rim light with warm fill",
        "soft diffused natural sunlight",
        "warm window light with gentle backlight",
      ],
    },
  },

  creative_edge: {
    id: "creative_edge",
    name: "The Portfolio",
    description:
      "Moody, editorial, unmistakably creative. For Behance, your studio website, and gallery openings.",
    category: "creative",
    icon: "palette",
    isFree: false,
    haloPitch:
      "Dominance +2.2 and Competence +1.9. Creative directors spend 40% longer viewing profiles with editorial-quality headshots.",
    promptTemplate:
      "Editorial creative portrait of {subject}, wearing {outfit}, {background}. Dramatic directional lighting with deep sculpted shadows, intentional mood, artistic composition with negative space. Cinematic color grading with muted tones, fashion photography sensibility. The headshot of someone whose work you want to hire.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, overly bright, flat lighting, corporate look, generic, stock photo feel",
    styleConfig: {
      backgrounds: [
        "in a dimly lit studio with paint-splattered walls",
        "against raw concrete with a single dramatic light source",
        "in a gallery space with deep shadows",
        "against a dark backdrop with a single colored gel accent",
      ],
      outfits: [
        "a structured black jacket with interesting texture",
        "an architectural minimalist black top",
        "a vintage-inspired dark ensemble",
        "a bold monochrome look with one statement piece",
      ],
      lighting: [
        "hard dramatic side light with no fill",
        "split lighting with subtle colored rim",
        "overhead spot with deep shadows",
      ],
    },
  },

  corporate_uniform: {
    id: "corporate_uniform",
    name: "The Team Shot",
    description:
      "Pixel-perfect consistency for your About page. Every team member looks equally polished, on-brand, and approachable.",
    category: "corporate",
    icon: "users",
    isFree: false,
    haloPitch:
      "Trust +2.6 across the entire team. Companies with consistent headshots see 34% higher trust scores on their About pages.",
    promptTemplate:
      "Consistent corporate headshot of {subject}, wearing {outfit}, against a {background} background. Perfectly even studio lighting with no harsh shadows, professional neutral expression with approachable slight smile, eyes directly at camera. Shot for team page consistency, clean and polished. Identical lighting setup, framing, and color temperature as a cohesive team set.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, illustration, dramatic lighting, casual setting, inconsistent lighting, artistic, moody",
    styleConfig: {
      backgrounds: [
        "clean white seamless",
        "light gray gradient",
        "soft brand-neutral gradient",
        "bright neutral cream",
      ],
      outfits: [
        "a dark business suit with a crisp white shirt",
        "professional business formal attire",
        "a tailored blazer with collared shirt",
        "polished corporate business wear",
      ],
      lighting: [
        "perfectly even two-light studio setup",
        "flat professional clamshell lighting",
        "soft frontal key with matching fill",
      ],
    },
  },

  south_asian_pro: {
    id: "south_asian_pro",
    name: "Desi Professional",
    description:
      "Lighting and color science tuned specifically for South Asian skin tones. No washed-out, no over-smoothed. Just you, looking incredible.",
    category: "professional",
    icon: "star",
    isFree: false,
    haloPitch:
      "Warmth +2.3, Trust +2.0. South Asian users see the biggest Halo Score jumps with skin-tone-optimized lighting -- avg +3.1 overall.",
    promptTemplate:
      "Professional headshot portrait of {subject}, wearing {outfit}, against a {background} background. Studio lighting specifically calibrated for rich South Asian skin tones with warm undertones preserved. True-to-life color reproduction, no whitewashing, no over-smoothing. Confident and warm expression, sharp focus on eyes. High-end portrait photography with accurate melanin-rich skin rendering, natural skin texture visible.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, illustration, whitewashed skin, oversaturated, unnatural skin tone, pale skin, over-smoothed, plastic skin, ashy tones",
    styleConfig: {
      backgrounds: [
        "warm rich gradient with amber undertones",
        "deep cream studio backdrop",
        "elegant dark chocolate backdrop",
        "subtle warm earth-toned gradient",
      ],
      outfits: [
        "a crisp formal shirt with structured collar",
        "a well-fitted blazer in charcoal with warm undertones",
        "elegant traditional-meets-modern formal wear",
        "smart Indo-Western fusion attire with clean lines",
      ],
      lighting: [
        "warm balanced studio lighting tuned for melanin-rich skin",
        "soft diffused key light with warm fill for even skin tones",
        "Rembrandt lighting with warm amber fill",
      ],
    },
  },

  real_estate_trust: {
    id: "real_estate_trust",
    name: "The Listing Agent",
    description:
      "The headshot that goes on every yard sign, brochure, and Zillow profile. Trustworthy, approachable, and market-ready.",
    category: "industry",
    icon: "home",
    isFree: false,
    haloPitch:
      "Trust +3.1, Approachability +2.4. Agents with high-Trust headshots get 28% more listing inquiries. Your face IS your brand.",
    promptTemplate:
      "Professional real estate agent portrait of {subject}, wearing {outfit}, {background}. Bright, clean, high-key lighting, warm trustworthy smile that says 'I will sell your home for above asking.' Approachable and professional, perfect for yard signs at any size. Commercial photography quality, crisp and print-ready, suitable for brochures and digital.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, painting, dark, moody, artistic, dramatic, edgy, casual",
    styleConfig: {
      backgrounds: [
        "in front of a luxury home exterior with soft focus",
        "against a bright white studio backdrop",
        "against a clean blue gradient suggesting sky and trust",
        "in a modern home interior with natural light",
      ],
      outfits: [
        "a sharp blazer with open collar and confident fit",
        "polished professional attire with a pop of color",
        "a well-tailored suit suggesting market expertise",
        "smart professional wear with approachable styling",
      ],
      lighting: [
        "bright high-key lighting with soft shadows",
        "clean fill lighting for print reproduction",
        "natural bright studio light with warm tones",
      ],
    },
  },

  social_scroll_stop: {
    id: "social_scroll_stop",
    name: "Scroll Stopper",
    description:
      "The profile photo that breaks the scroll. Vibrant, magnetic, algorithmically optimized for engagement across Instagram, TikTok, and X.",
    category: "social",
    icon: "zap",
    isFree: false,
    haloPitch:
      "Approachability +2.7, Warmth +2.3. Scroll Stopper photos get 4.2x more profile visits. The algorithm rewards faces that pop.",
    promptTemplate:
      "Vibrant scroll-stopping social media portrait of {subject}, wearing {outfit}, {background}. Punchy saturated colors optimized for small circular crops, high contrast face against background, magnetic eye contact. Modern editorial-meets-lifestyle feel, Instagram-native composition. The face that makes you tap the profile.",
    negativePrompt:
      "blurry, distorted face, extra limbs, deformed, low quality, cartoon, anime, dull colors, corporate, boring, stiff, formal, flat, washed out",
    styleConfig: {
      backgrounds: [
        "against a neon-lit urban wall with color spill on skin",
        "with vibrant bokeh city lights creating a halo effect",
        "in a trendy minimalist space with one bold color accent",
        "against a saturated gradient wall in trending colors",
      ],
      outfits: [
        "trendy elevated streetwear in bold tones",
        "a standout jacket or layered look with texture",
        "a bold colored top that pops against skin tone",
        "fashionable athleisure with clean lines",
      ],
      lighting: [
        "neon accent lighting with warm fill",
        "golden hour backlight with lens flare kiss",
        "ring light key with colored background spill",
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
