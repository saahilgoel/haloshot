import { NextRequest, NextResponse } from "next/server";

// Model configs with estimated costs
const MODELS: Record<string, {
  provider: "replicate" | "fal";
  apiUrl: string;
  costPerImage: number;
  buildInput: (prompt: string, imageUrl: string) => Record<string, unknown>;
}> = {
  "nano-banana-2": {
    provider: "replicate",
    apiUrl: "https://api.replicate.com/v1/models/google/nano-banana-2/predictions",
    costPerImage: 0.003,
    buildInput: (prompt, imageUrl) => ({
      prompt,
      image_input: [imageUrl],
      resolution: "2K",
      aspect_ratio: "3:4",
      output_format: "png",
    }),
  },
  "nano-banana": {
    provider: "replicate",
    apiUrl: "https://api.replicate.com/v1/models/google/nano-banana/predictions",
    costPerImage: 0.0015,
    buildInput: (prompt, imageUrl) => ({
      prompt,
      image_input: [imageUrl],
      aspect_ratio: "3:4",
      output_format: "png",
    }),
  },
  "flux-kontext-pro": {
    provider: "replicate",
    apiUrl: "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions",
    costPerImage: 0.005,
    buildInput: (prompt, imageUrl) => ({
      prompt,
      input_image: imageUrl,
      aspect_ratio: "3:4",
      output_format: "jpg",
    }),
  },
  "flux-kontext-max": {
    provider: "replicate",
    apiUrl: "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-max/predictions",
    costPerImage: 0.01,
    buildInput: (prompt, imageUrl) => ({
      prompt,
      input_image: imageUrl,
      aspect_ratio: "3:4",
      output_format: "jpg",
    }),
  },
  "fal-flux-pro": {
    provider: "fal",
    apiUrl: "https://queue.fal.run/fal-ai/flux-pro/v1.1",
    costPerImage: 0.05,
    buildInput: (prompt) => ({
      prompt,
      image_size: { width: 768, height: 1024 },
      num_images: 1,
      output_format: "jpeg",
    }),
  },
  "fal-flux-dev": {
    provider: "fal",
    apiUrl: "https://queue.fal.run/fal-ai/flux/dev",
    costPerImage: 0.025,
    buildInput: (prompt) => ({
      prompt,
      image_size: { width: 768, height: 1024 },
      num_images: 1,
      output_format: "jpeg",
    }),
  },
};

export async function GET() {
  // Return available models and their costs
  const models = Object.entries(MODELS).map(([id, config]) => ({
    id,
    provider: config.provider,
    costPerImage: config.costPerImage,
  }));
  return NextResponse.json({ models });
}

export async function POST(req: NextRequest) {
  try {
    const { modelId, prompt, imageUrl } = await req.json();

    const model = MODELS[modelId];
    if (!model) {
      return NextResponse.json({ error: "Unknown model" }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const startTime = Date.now();

    if (model.provider === "replicate") {
      const token = process.env.REPLICATE_API_TOKEN;
      if (!token) return NextResponse.json({ error: "REPLICATE_API_TOKEN not set" }, { status: 500 });

      // Create prediction
      const createRes = await fetch(model.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: model.buildInput(prompt, imageUrl || ""),
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.text();
        return NextResponse.json({ error: `Replicate error: ${err}` }, { status: 500 });
      }

      const prediction = await createRes.json();

      // Poll for completion
      let result = prediction;
      while (result.status !== "succeeded" && result.status !== "failed" && result.status !== "canceled") {
        await new Promise((r) => setTimeout(r, 2000));
        const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        result = await pollRes.json();
      }

      const durationMs = Date.now() - startTime;

      if (result.status === "failed") {
        return NextResponse.json({
          modelId,
          status: "failed",
          error: result.error || "Generation failed",
          durationMs,
          costEstimate: 0,
        });
      }

      const output = Array.isArray(result.output) ? result.output[0] : result.output;
      // Replicate returns actual metrics
      const actualCost = result.metrics?.predict_time
        ? result.metrics.predict_time * (model.costPerImage / 10)  // rough estimate based on time
        : model.costPerImage;

      return NextResponse.json({
        modelId,
        status: "succeeded",
        imageUrl: output,
        durationMs,
        costEstimate: model.costPerImage,
        replicateMetrics: result.metrics || null,
        predictionId: result.id,
      });
    } else {
      // fal.ai
      const falKey = process.env.FAL_KEY;
      if (!falKey) return NextResponse.json({ error: "FAL_KEY not set" }, { status: 500 });

      const createRes = await fetch(model.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Key ${falKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model.buildInput(prompt, imageUrl || "")),
      });

      if (!createRes.ok) {
        const err = await createRes.text();
        return NextResponse.json({ error: `fal.ai error: ${err}` }, { status: 500 });
      }

      const response = await createRes.json();

      // fal queue: poll status endpoint
      const requestId = response.request_id;
      if (requestId) {
        // Queue mode — poll
        const statusUrl = model.apiUrl.replace("queue.fal.run", "queue.fal.run") + `/requests/${requestId}/status`;
        let status = response;
        while (status.status === "IN_QUEUE" || status.status === "IN_PROGRESS") {
          await new Promise((r) => setTimeout(r, 2000));
          const pollRes = await fetch(statusUrl, {
            headers: { Authorization: `Key ${falKey}` },
          });
          status = await pollRes.json();
        }

        // Get result
        const resultUrl = model.apiUrl + `/requests/${requestId}`;
        const resultRes = await fetch(resultUrl, {
          headers: { Authorization: `Key ${falKey}` },
        });
        const result = await resultRes.json();
        const durationMs = Date.now() - startTime;

        const output = result.images?.[0]?.url || result.output?.url || null;

        return NextResponse.json({
          modelId,
          status: output ? "succeeded" : "failed",
          imageUrl: output,
          durationMs,
          costEstimate: model.costPerImage,
          error: output ? null : "No output image",
        });
      }

      // Sync mode
      const durationMs = Date.now() - startTime;
      const output = response.images?.[0]?.url || response.output?.url || null;

      return NextResponse.json({
        modelId,
        status: output ? "succeeded" : "failed",
        imageUrl: output,
        durationMs,
        costEstimate: model.costPerImage,
      });
    }
  } catch (error) {
    console.error("Playground error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
