"use client";

import { useState, useCallback } from "react";
import type { HaloScoreResult } from "@/lib/ai/halo-score";

interface UseHaloScoreReturn {
  analyzePhoto: (photoUrl: string) => Promise<HaloScoreResult & { id: string | null }>;
  analyzeFile: (file: File) => Promise<HaloScoreResult & { id: string | null }>;
  isAnalyzing: boolean;
  score: (HaloScoreResult & { id: string | null }) | null;
  error: string | null;
  reset: () => void;
}

export function useHaloScore(): UseHaloScoreReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<(HaloScoreResult & { id: string | null }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzePhoto = useCallback(async (photoUrl: string) => {
    setIsAnalyzing(true);
    setError(null);
    setScore(null);

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to analyze photo");
      }

      setScore(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeFile = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setScore(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch("/api/score", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to analyze photo");
      }

      setScore(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setScore(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return { analyzePhoto, analyzeFile, isAnalyzing, score, error, reset };
}
