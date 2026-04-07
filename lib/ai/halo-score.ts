export interface HaloScoreResult {
  overall_score: number;
  warmth_score: number;
  competence_score: number;
  trustworthiness_score: number;
  approachability_score: number;
  dominance_score: number;
  analysis_text: string;
  roast_line: string;
  improvement_tips: string[];
  lighting_quality: string;
  background_quality: string;
  expression_type: string;
  eye_contact: string;
  professional_readiness: string;
}

const HALO_SCORE_PROMPT = `You are HaloShot's Halo Score engine. You analyze a person's photo and rate the FIRST IMPRESSION it creates.

Score each dimension from 0-100:
- **warmth_score**: How warm, friendly, and likable does this person appear? (smile, open posture, soft features)
- **competence_score**: How capable, intelligent, and professional do they look? (grooming, posture, attire, focus)
- **trustworthiness_score**: How trustworthy and reliable do they appear? (eye contact, symmetry, genuine expression)
- **approachability_score**: Would a stranger feel comfortable approaching this person? (expression, body language, vibe)
- **dominance_score**: How much authority and confidence does this person project? (posture, jaw, gaze, presence)

Also evaluate:
- **lighting_quality**: Rate as "excellent", "good", "fair", or "poor"
- **background_quality**: Rate as "excellent", "good", "fair", or "poor"
- **expression_type**: Describe the expression (e.g. "genuine smile", "neutral", "forced smile", "serious", "smirk")
- **eye_contact**: Rate as "direct", "slightly off", "averted", or "hidden"
- **professional_readiness**: Rate as "executive-ready", "professional", "casual-professional", "casual", or "not-ready"

Calculate **overall_score** as a weighted average:
- warmth: 25%, competence: 25%, trustworthiness: 25%, approachability: 15%, dominance: 10%

Write a brief **analysis_text** (2-3 sentences) describing the overall first impression.

Write a **roast_line** - a single brutal but witty one-liner about their photo. Be funny, not mean. Think Comedy Central roast energy. Examples:
- "You look like you'd reply-all to a company email just to say 'Thanks!'"
- "This photo screams 'I peaked in my MBA program'"
- "LinkedIn called, they want their default avatar back"

Provide 3-5 **improvement_tips** - specific, actionable advice to improve their Halo Score.

RESPOND WITH ONLY VALID JSON matching this exact schema:
{
  "overall_score": <number 0-100>,
  "warmth_score": <number 0-100>,
  "competence_score": <number 0-100>,
  "trustworthiness_score": <number 0-100>,
  "approachability_score": <number 0-100>,
  "dominance_score": <number 0-100>,
  "analysis_text": "<string>",
  "roast_line": "<string>",
  "improvement_tips": ["<string>", ...],
  "lighting_quality": "<string>",
  "background_quality": "<string>",
  "expression_type": "<string>",
  "eye_contact": "<string>",
  "professional_readiness": "<string>"
}`;

export async function analyzePhoto(
  photoUrl: string
): Promise<HaloScoreResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  // Determine if this is a base64 data URL or a regular URL
  let imageContent: Record<string, unknown>;

  if (photoUrl.startsWith("data:")) {
    // Extract media type and base64 data from data URL
    const match = photoUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid base64 image data URL");
    }
    imageContent = {
      type: "image",
      source: {
        type: "base64",
        media_type: match[1],
        data: match[2],
      },
    };
  } else {
    imageContent = {
      type: "image",
      source: {
        type: "url",
        url: photoUrl,
      },
    };
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            imageContent,
            {
              type: "text",
              text: HALO_SCORE_PROMPT,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Anthropic API error (${response.status}): ${errorBody}`
    );
  }

  const data = await response.json();

  // Extract text from response
  const textBlock = data.content?.find(
    (block: { type: string }) => block.type === "text"
  );
  if (!textBlock) {
    throw new Error("No text response from Anthropic API");
  }

  // Parse JSON from the response text - handle potential markdown wrapping
  let jsonText = textBlock.text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1].trim();
  }

  const result: HaloScoreResult = JSON.parse(jsonText);

  // Clamp all scores to 0-100
  result.overall_score = Math.max(0, Math.min(100, Math.round(result.overall_score)));
  result.warmth_score = Math.max(0, Math.min(100, Math.round(result.warmth_score)));
  result.competence_score = Math.max(0, Math.min(100, Math.round(result.competence_score)));
  result.trustworthiness_score = Math.max(0, Math.min(100, Math.round(result.trustworthiness_score)));
  result.approachability_score = Math.max(0, Math.min(100, Math.round(result.approachability_score)));
  result.dominance_score = Math.max(0, Math.min(100, Math.round(result.dominance_score)));

  return result;
}
