"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface GenerationJob {
  id: string;
  status: "queued" | "processing" | "completed" | "failed" | "canceled";
  presetId: string;
  numImages: number;
  generatedImageUrls: string[];
  similarityScores: number[];
  processingTimeMs: number | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

export function useGeneration() {
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGeneration = useCallback(async (params: {
    faceProfileId: string;
    presetId: string;
    customPrompt?: string;
    styleOptions?: Record<string, string>;
    photoUrls?: string[];
    model?: "studio" | "fast" | "quick";
  }) => {
    setIsGenerating(true);
    setError(null);
    setJob(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      // Start polling for status
      pollJobStatus(data.jobId);

      return data.jobId;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setIsGenerating(false);
      return null;
    }
  }, []);

  const pollJobStatus = useCallback((jobId: string) => {
    // Clear any existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate/${jobId}`);
        const data: GenerationJob = await res.json();

        setJob(data);

        if (data.status === "completed" || data.status === "failed" || data.status === "canceled") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setIsGenerating(false);

          if (data.status === "failed") {
            setError(data.errorMessage || "Generation failed");
          }
        }
      } catch {
        // Continue polling on network errors
      }
    }, 3000);
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
    job,
    isGenerating,
    error,
    startGeneration,
    generatedImages: job?.generatedImageUrls || [],
    similarityScores: job?.similarityScores || [],
    isComplete: job?.status === "completed",
    isFailed: job?.status === "failed",
  };
}
