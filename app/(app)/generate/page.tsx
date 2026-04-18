"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, ArrowRight, Sparkles, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/app/UploadZone";
import { PresetPicker } from "@/components/app/PresetPicker";
import { GenerationProgress } from "@/components/app/GenerationProgress";
import { HeadshotGrid } from "@/components/app/HeadshotGrid";
import { SubscriptionGate } from "@/components/app/SubscriptionGate";
import { UsageIndicator } from "@/components/app/UsageIndicator";
import { useGeneration, getPersistedJobId } from "@/lib/hooks/useGeneration";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { useUser } from "@/lib/hooks/useUser";
import { STYLE_PRESETS } from "@/lib/ai/prompts";
import { ScoreReveal } from "@/components/app/ScoreReveal";
import { cn } from "@/lib/utils";

type Step = "upload" | "style" | "generating" | "results";

export default function GeneratePage() {
  const [step, setStep] = useState<Step | "loading">("loading");
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [faceProfileId, setFaceProfileId] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [model, setModel] = useState<"studio" | "fast" | "quick">("studio");
  const [showPaywall, setShowPaywall] = useState(false);
  const [avgScore, setAvgScore] = useState(0);
  const { profile } = useUser();

  const { tier, isPro, isTeam } = useSubscription();
  const isProOrTeam = isPro || isTeam;
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  const { startGeneration, resumeJob, job, isGenerating, error, generatedImages, similarityScores, isComplete, isFailed } = useGeneration();

  useEffect(() => {
    async function loadInitialData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStep("upload"); return; }

      // Load generation count
      const { data: prof } = await supabase
        .from("profiles")
        .select("generations_count_total")
        .eq("id", user.id)
        .single();
      if (prof) {
        setGenerationsUsed(prof.generations_count_total || 0);
      }

      // Resume an in-flight job if the user bounced mid-generation.
      // Server-side work (Replicate + webhook → Supabase) kept running
      // regardless of whether the tab was open.
      const pending = getPersistedJobId();
      if (pending) {
        console.log("[generate] resuming in-flight job", pending);
        setStep("generating");
        resumeJob(pending);
        return;
      }

      // Check for existing face profile (from scoring)
      try {
        const res = await fetch("/api/face-profile");
        const data = await res.json();
        if (data.profiles && data.profiles.length > 0) {
          const fp = data.profiles[0];
          if (fp.photo_urls?.length > 0 && fp.status === "ready") {
            setUploadedUrls(fp.photo_urls);
            setFaceProfileId(fp.id);
            setHasExistingProfile(true);
            setStep("style");
            return;
          }
        }
      } catch (err) {
        console.error("Failed to check face profile:", err);
      }
      setStep("upload");
    }
    loadInitialData();
  }, [resumeJob]);

  const handleUploadComplete = useCallback(async (urls: string[]) => {
    setUploadedUrls(urls);

    // Create face profile
    try {
      const res = await fetch("/api/face-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrls: urls, detectedFeatures: {} }),
      });
      const data = await res.json();
      if (data.faceProfile) {
        setFaceProfileId(data.faceProfile.id);
      } else {
        // Even if face profile creation fails, allow proceeding
        // with a placeholder ID — the generate step will handle it
        console.warn("Face profile creation returned no data:", data);
        setFaceProfileId("pending");
      }
    } catch (err) {
      console.error("Failed to create face profile:", err);
      // Still allow user to proceed
      setFaceProfileId("pending");
    }
  }, []);

  const handleGenerate = async () => {
    if (!faceProfileId || !selectedPreset) return;

    setStep("generating");
    await startGeneration({
      faceProfileId,
      presetId: selectedPreset,
      photoUrls: uploadedUrls,
      model,
    });
  };

  // When generation completes or has partial results, move to results
  useEffect(() => {
    if (step !== "generating") return;
    if ((isComplete || isFailed) && generatedImages.length > 0) {
      setStep("results");
    }
    // If failed with zero images, GenerationProgress will show the error
  }, [step, isComplete, isFailed, generatedImages.length]);

  // Auto-transition: if we have images and job seems stuck, show results
  useEffect(() => {
    if (step !== "generating" || generatedImages.length === 0) return;
    // After 90s with images, assume remaining predictions won't arrive
    const timer = setTimeout(() => {
      if (generatedImages.length > 0) {
        setStep("results");
      }
    }, 60000);
    return () => clearTimeout(timer);
  }, [step, generatedImages.length]);

  // Poll for halo scores on results
  useEffect(() => {
    if (step !== "results" || !job?.id) return;

    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      if (attempts > 20) { clearInterval(poll); return; }

      try {
        const supabase = (await import("@/lib/supabase/client")).createClient();
        const { data } = await supabase
          .from("saved_headshots")
          .select("halo_score")
          .eq("generation_job_id", job.id)
          .not("halo_score", "is", null);

        if (data && data.length > 0) {
          const scores = data.map(d => d.halo_score as number);
          const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          setAvgScore(avg);
          clearInterval(poll);
        }
      } catch {}
    }, 3000);

    return () => clearInterval(poll);
  }, [step, job?.id]);

  const selectedPresetData = selectedPreset
    ? STYLE_PRESETS[selectedPreset as keyof typeof STYLE_PRESETS]
    : null;

  const steps = [
    { key: "upload", label: "Upload", number: 1 },
    { key: "style", label: "Style", number: 2 },
    { key: "generating", label: "Generate", number: 3 },
    { key: "results", label: "Results", number: 4 },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Step indicator */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "flex items-center gap-2",
                  s.key === step ? "text-white" : steps.findIndex(st => st.key === step) > i ? "text-violet-400" : "text-white/20"
                )}
              >
                <div className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium",
                  s.key === step
                    ? "bg-violet-600 text-white"
                    : steps.findIndex(st => st.key === step) > i
                    ? "bg-violet-600/30 text-violet-400"
                    : "bg-white/5 text-white/30"
                )}>
                  {s.number}
                </div>
                <span className="text-sm font-medium hidden md:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-px",
                  steps.findIndex(st => st.key === step) > i ? "bg-violet-500/50" : "bg-white/5"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
          {/* Loading state */}
          {step === "loading" && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
            </div>
          )}

          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <h1 className="text-xl font-display font-bold text-white">Let&apos;s see the real you.</h1>
                <p className="text-sm text-white/50 mt-0.5">Upload 1-5 selfies. No filters — the AI needs your actual face.</p>
              </div>

              <UsageIndicator tier={tier} generationsUsed={generationsUsed} />

              {/* Show existing photos if returning from score */}
              {hasExistingProfile && uploadedUrls.length > 0 && (
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <p className="text-sm text-violet-300 mb-3">Your scored photo is ready to use:</p>
                  <div className="flex gap-2">
                    {uploadedUrls.map((url, i) => (
                      <img key={i} src={url} alt="Your photo" className="h-20 w-20 rounded-lg object-cover border border-white/10" />
                    ))}
                  </div>
                  <Button
                    onClick={() => setStep("style")}
                    className="w-full mt-3 h-11 bg-violet-600 hover:bg-violet-700 text-sm font-medium gap-2"
                  >
                    Use this photo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <button
                    onClick={() => { setHasExistingProfile(false); setUploadedUrls([]); setFaceProfileId(null); }}
                    className="w-full mt-2 text-xs text-white/40 hover:text-white/70 text-center"
                  >
                    Upload different photos instead
                  </button>
                </div>
              )}

              {!hasExistingProfile && (
                <UploadZone onUploadComplete={handleUploadComplete} />
              )}

              {uploadedUrls.length > 0 && !faceProfileId && (
                <div className="flex items-center justify-center gap-3 h-11 rounded-md bg-violet-600/20 border border-violet-500/30 text-sm font-medium text-violet-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing your face...
                </div>
              )}

              {uploadedUrls.length > 0 && faceProfileId && !hasExistingProfile && (
                <Button
                  onClick={() => setStep("style")}
                  className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-sm font-medium gap-2"
                >
                  Pick Your Style
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Step 2: Style Selection */}
          {step === "style" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("upload")}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-lg sm:text-2xl font-display font-bold text-white">What should your first impression say?</h1>
                  <p className="text-white/50 mt-1">Pick a look. Each one is optimized for different perception dimensions.</p>
                </div>
              </div>

              {/* Photo preview + upload more option */}
              {uploadedUrls.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 shrink-0">
                      {uploadedUrls.slice(0, 3).map((url, i) => (
                        <img key={i} src={url} alt="Reference" className="h-12 w-12 rounded-lg object-cover border border-white/10" />
                      ))}
                      {uploadedUrls.length > 3 && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-xs text-white/40">
                          +{uploadedUrls.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70">{uploadedUrls.length} photo{uploadedUrls.length > 1 ? "s" : ""} loaded</p>
                      <p className="text-[11px] text-white/30 mt-0.5">
                        {uploadedUrls.length < 3 ? "Add more selfies for better accuracy" : "Ready to generate"}
                      </p>
                    </div>
                    <button
                      onClick={() => { setStep("upload"); setHasExistingProfile(false); }}
                      className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
                    >
                      {uploadedUrls.length < 3 ? "Add more" : "Change"}
                    </button>
                  </div>
                </div>
              )}

              <PresetPicker
                selectedPreset={selectedPreset}
                onSelect={setSelectedPreset}
                isPro={isProOrTeam}
              />

              {/* Model Picker */}
              {selectedPreset && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Choose your engine</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    {([
                      {
                        id: "studio" as const,
                        label: "Studio",
                        desc: "2K res. Best identity match. ~60s.",
                        cost: "~₹8.50/shot",
                        icon: Sparkles,
                        color: "amber",
                      },
                      {
                        id: "fast" as const,
                        label: "Fast",
                        desc: "Good quality. Cheaper. ~30s.",
                        cost: "~₹4/shot",
                        icon: Zap,
                        color: "violet",
                      },
                      {
                        id: "quick" as const,
                        label: "Flux",
                        desc: "Different aesthetic. ~5s.",
                        cost: "~₹5/shot",
                        icon: Zap,
                        color: "cyan",
                      },
                    ]).map((m) => {
                      const Icon = m.icon;
                      const isSelected = model === m.id;
                      const borderColor = isSelected
                        ? m.color === "amber" ? "border-amber-500/70 bg-amber-500/10"
                        : m.color === "violet" ? "border-violet-500/70 bg-violet-500/10"
                        : "border-cyan-500/70 bg-cyan-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20";
                      const dotColor = m.color === "amber" ? "bg-amber-400" : m.color === "violet" ? "bg-violet-400" : "bg-cyan-400";
                      const iconColor = m.color === "amber" ? "text-amber-400" : m.color === "violet" ? "text-violet-400" : "text-cyan-400";

                      return (
                        <button
                          key={m.id}
                          onClick={() => setModel(m.id)}
                          className={cn(
                            "relative rounded-2xl border-2 p-4 text-left transition-all",
                            borderColor
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={cn("h-5 w-5", iconColor)} />
                            <span className="font-semibold text-white text-sm">{m.label}</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed">{m.desc}</p>
                          <p className="text-[10px] text-white/30 mt-1">{m.cost}</p>
                          {isSelected && (
                            <div className={cn("absolute top-2 right-2 h-2 w-2 rounded-full", dotColor)} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedPreset && (
                <div className="sticky bottom-20 md:bottom-4 animate-in fade-in duration-300">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full h-14 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-base font-semibold gap-2 rounded-2xl shadow-lg shadow-violet-500/25"
                  >
                    <Sparkles className="h-5 w-5" />
                    Start My Glow-Up
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Generating */}
          {step === "generating" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <GenerationProgress
                status={job?.status || "queued"}
                presetName={selectedPresetData?.name || ""}
                numImages={job?.numImages || 4}
                modelName={model}
                completedCount={generatedImages.length}
                errorMessage={error || undefined}
                onRetry={isFailed ? handleGenerate : undefined}
              />

              {/* Show images as they arrive */}
              {generatedImages.length > 0 && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>{generatedImages.length} of {job?.numImages || 4} headshots ready...</span>
                  </div>
                  <HeadshotGrid
                    images={generatedImages}
                    similarityScores={similarityScores}
                    isFreeUser={!isProOrTeam}
                    onDownload={(url) => {
                      if (!isProOrTeam) {
                        setShowPaywall(true);
                      } else {
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "haloshot-headshot.jpg";
                        a.click();
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Results */}
          {step === "results" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center">
                <h1 className="text-2xl font-display font-bold text-white">Your glow-up is ready.</h1>
                {avgScore > 0 ? (
                  <ScoreReveal
                    score={avgScore}
                    bestScore={profile?.current_halo_score ?? undefined}
                    presetName={selectedPresetData?.name}
                  />
                ) : (
                  <p className="text-white/50 mt-1 text-sm">
                    Scoring your headshots...
                  </p>
                )}
              </div>

              <HeadshotGrid
                images={generatedImages}
                similarityScores={similarityScores}
                isFreeUser={!isProOrTeam}
                onDownload={(url) => {
                  if (!isProOrTeam) {
                    setShowPaywall(true);
                  } else {
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "haloshot-headshot.jpg";
                    a.click();
                  }
                }}
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("style");
                    setSelectedPreset(null);
                  }}
                  className="flex-1"
                >
                  Try Different Style
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Generate More
                </Button>
                <Button
                  onClick={() => window.location.href = "/gallery"}
                  className="flex-1 bg-violet-600 hover:bg-violet-700"
                >
                  View Gallery
                </Button>
              </div>
            </div>
          )}
      </div>

      {/* Paywall */}
      <SubscriptionGate
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="no_watermark"
      />
    </div>
  );
}
