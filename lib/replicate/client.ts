import Replicate from "replicate";
import { MODELS } from "./models";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export { replicate };

export interface GenerateHeadshotParams {
  /** URL of the reference face photo */
  referenceImageUrl: string;
  /** The full prompt describing the desired output */
  prompt: string;
  /** Negative prompt to avoid undesired features */
  negativePrompt?: string;
  /** Number of images to generate */
  numOutputs?: number;
  /** Output image width */
  width?: number;
  /** Output image height */
  height?: number;
  /** Guidance scale for prompt adherence */
  guidanceScale?: number;
  /** Number of inference steps */
  numInferenceSteps?: number;
  /** Webhook URL for async notification */
  webhookUrl?: string;
}

/**
 * Start a headshot generation using Flux Dev with face conditioning.
 * Returns the Replicate prediction object.
 */
export async function generateHeadshot(params: GenerateHeadshotParams) {
  const {
    referenceImageUrl,
    prompt,
    negativePrompt,
    numOutputs = 4,
    width = 1024,
    height = 1024,
    guidanceScale = 3.5,
    numInferenceSteps = 28,
    webhookUrl,
  } = params;

  const prediction = await replicate.predictions.create({
    model: MODELS.flux_dev.id,
    input: {
      prompt,
      negative_prompt: negativePrompt,
      image: referenceImageUrl,
      num_outputs: numOutputs,
      width,
      height,
      guidance_scale: guidanceScale,
      num_inference_steps: numInferenceSteps,
    },
    ...(webhookUrl ? { webhook: webhookUrl, webhook_events_filter: ["completed"] } : {}),
  });

  return prediction;
}

/**
 * Poll the status of an existing prediction.
 */
export async function checkPredictionStatus(id: string) {
  return replicate.predictions.get(id);
}

/**
 * Cancel a running or queued prediction.
 */
export async function cancelPrediction(id: string) {
  return replicate.predictions.cancel(id);
}
