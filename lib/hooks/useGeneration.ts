"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

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

type JobRow = {
  id: string;
  status: GenerationJob["status"];
  preset_id: string;
  num_images: number;
  generated_image_urls: string[] | null;
  similarity_scores: number[] | null;
  processing_time_ms: number | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

const POLL_INTERVAL_MS = 4000;
const NO_IMAGE_TIMEOUT_MS = 150_000;
const STALL_TIMEOUT_MS = 210_000;
const ACTIVE_JOB_KEY = "haloshot:activeJobId";

function rowToJob(row: JobRow): GenerationJob {
  return {
    id: row.id,
    status: row.status,
    presetId: row.preset_id,
    numImages: row.num_images,
    generatedImageUrls: row.generated_image_urls || [],
    similarityScores: row.similarity_scores || [],
    processingTimeMs: row.processing_time_ms,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

function persistActiveJob(jobId: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (jobId) localStorage.setItem(ACTIVE_JOB_KEY, jobId);
    else localStorage.removeItem(ACTIVE_JOB_KEY);
  } catch {}
}

export function getPersistedJobId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_JOB_KEY);
  } catch {
    return null;
  }
}

export function useGeneration() {
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pollStartRef = useRef<number>(0);
  const jobIdRef = useRef<string | null>(null);

  const stopWatching = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
  }, []);

  const finalize = useCallback((data: GenerationJob) => {
    if (data.status === "completed" || data.status === "failed" || data.status === "canceled") {
      stopWatching();
      persistActiveJob(null);
      setIsGenerating(false);
      if (data.status === "failed") {
        setError(data.errorMessage || "Generation failed");
      }
      return true;
    }
    return false;
  }, [stopWatching]);

  const watchJob = useCallback((jobId: string) => {
    stopWatching();
    jobIdRef.current = jobId;
    pollStartRef.current = Date.now();
    persistActiveJob(jobId);
    setIsGenerating(true);

    console.log(`[useGeneration] watching job ${jobId} (realtime + poll fallback)`);

    // Realtime: push updates the instant the webhook writes the row.
    // Survives tab backgrounding on most browsers; on iOS Safari it drops the
    // socket after a few minutes, which is why we keep polling as a safety net.
    try {
      const supabase = createClient();
      const channel = supabase
        .channel(`job-${jobId}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "generation_jobs", filter: `id=eq.${jobId}` },
          (payload) => {
            const row = payload.new as JobRow;
            console.log(`[useGeneration] realtime update`, {
              status: row.status,
              images: row.generated_image_urls?.length || 0,
            });
            const data = rowToJob(row);
            setJob(data);
            finalize(data);
          }
        )
        .subscribe((status) => {
          console.log(`[useGeneration] realtime channel status: ${status}`);
        });
      channelRef.current = channel;
    } catch (err) {
      console.warn("[useGeneration] realtime setup failed — polling only", err);
    }

    // Polling fallback — also does initial fetch + timeout enforcement.
    const poll = async () => {
      const elapsed = Date.now() - pollStartRef.current;
      try {
        const res = await fetch(`/api/generate/${jobId}`);
        const data: GenerationJob = await res.json();
        console.log(`[useGeneration] poll +${Math.round(elapsed / 1000)}s`, {
          status: data.status,
          images: data.generatedImageUrls?.length || 0,
          expected: data.numImages,
        });

        setJob(data);
        if (finalize(data)) return;

        const imageCount = data.generatedImageUrls?.length || 0;
        if (imageCount === 0 && elapsed > NO_IMAGE_TIMEOUT_MS) {
          console.warn(`[useGeneration] no images after ${Math.round(elapsed / 1000)}s — giving up`);
          stopWatching();
          persistActiveJob(null);
          setIsGenerating(false);
          setError("Generation is taking unusually long. The model may be overloaded — please try again.");
        } else if (imageCount > 0 && elapsed > STALL_TIMEOUT_MS) {
          console.warn(`[useGeneration] partial stall at ${imageCount}/${data.numImages}`);
          stopWatching();
          persistActiveJob(null);
          setIsGenerating(false);
        }
      } catch (err) {
        console.warn("[useGeneration] poll threw — will retry", err);
      }
    };

    // Fire immediately so resumed jobs show state without waiting for the interval
    poll();
    pollingRef.current = setInterval(poll, POLL_INTERVAL_MS);
  }, [stopWatching, finalize]);

  const startGeneration = useCallback(async (params: {
    faceProfileId: string;
    presetId: string;
    customPrompt?: string;
    styleOptions?: Record<string, string>;
    photoUrls?: string[];
    model?: "studio" | "fast" | "quick";
    count?: number;
  }) => {
    const t0 = Date.now();
    console.log("[useGeneration] startGeneration", { preset: params.presetId, model: params.model, count: params.count });
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
      console.log(`[useGeneration] POST /api/generate -> ${res.status} in ${Date.now() - t0}ms`, data);

      if (!res.ok) throw new Error(data.error || "Generation failed");

      watchJob(data.jobId);
      return data.jobId;
    } catch (err) {
      console.error("[useGeneration] startGeneration threw", err);
      setError(err instanceof Error ? err.message : "Generation failed");
      setIsGenerating(false);
      return null;
    }
  }, [watchJob]);

  const resumeJob = useCallback((jobId: string) => {
    setError(null);
    setJob(null);
    watchJob(jobId);
  }, [watchJob]);

  useEffect(() => {
    return () => { stopWatching(); };
  }, [stopWatching]);

  return {
    job,
    isGenerating,
    error,
    startGeneration,
    resumeJob,
    generatedImages: job?.generatedImageUrls || [],
    similarityScores: job?.similarityScores || [],
    isComplete: job?.status === "completed",
    isFailed: job?.status === "failed",
  };
}
