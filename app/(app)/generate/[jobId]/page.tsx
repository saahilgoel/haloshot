"use client";

import { useEffect, useState } from "react";
import { GenerationProgress } from "@/components/app/GenerationProgress";
import { HeadshotGrid } from "@/components/app/HeadshotGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

interface JobData {
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
  presetId: string;
  numImages: number;
  generatedImageUrls: string[];
  similarityScores: number[];
  processingTimeMs: number | null;
  errorMessage: string | null;
}

export default function GenerationResultPage({ params }: { params: { jobId: string } }) {
  const [job, setJob] = useState<JobData | null>(null);

  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/generate/${params.jobId}`);
      const data = await res.json();
      setJob(data);

      if (data.status === "queued" || data.status === "processing") {
        setTimeout(poll, 3000);
      }
    };
    poll();
  }, [params.jobId]);

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/generate">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-display font-bold text-white">
          {job.status === "completed" ? "Your Headshots" : "Generating..."}
        </h1>
      </div>

      {(job.status === "queued" || job.status === "processing") && (
        <GenerationProgress
          status={job.status}
          presetName={job.presetId}
          numImages={job.numImages}
        />
      )}

      {job.status === "completed" && (
        <>
          <p className="text-white/50">
            {job.generatedImageUrls.length} headshots ready.
            Generated in {job.processingTimeMs ? `${(job.processingTimeMs / 1000).toFixed(1)}s` : "under a minute"}.
          </p>
          <HeadshotGrid
            images={job.generatedImageUrls}
            similarityScores={job.similarityScores}
          />
          <div className="flex gap-3">
            <Link href="/generate" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Sparkles className="h-4 w-4" />
                Generate More
              </Button>
            </Link>
            <Link href="/gallery" className="flex-1">
              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                View Gallery
              </Button>
            </Link>
          </div>
        </>
      )}

      {job.status === "failed" && (
        <div className="text-center py-12">
          <p className="text-lg text-white mb-2">Generation failed</p>
          <p className="text-white/50 mb-6">{job.errorMessage || "Something went wrong. Please try again."}</p>
          <Link href="/generate">
            <Button className="bg-violet-600 hover:bg-violet-700">Try Again</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
