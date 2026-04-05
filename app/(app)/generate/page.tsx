"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/app/UploadZone";
import { PresetPicker } from "@/components/app/PresetPicker";
import { GenerationProgress } from "@/components/app/GenerationProgress";
import { HeadshotGrid } from "@/components/app/HeadshotGrid";
import { SubscriptionGate } from "@/components/app/SubscriptionGate";
import { UsageIndicator } from "@/components/app/UsageIndicator";
import { useGeneration } from "@/lib/hooks/useGeneration";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { STYLE_PRESETS } from "@/lib/ai/prompts";
import { cn } from "@/lib/utils";

type Step = "upload" | "style" | "generating" | "results";

export default function GeneratePage() {
  const [step, setStep] = useState<Step>("upload");
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [faceProfileId, setFaceProfileId] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [model, setModel] = useState<"studio" | "quick">("studio");
  const [showPaywall, setShowPaywall] = useState(false);

  const { tier, isPro, isTeam } = useSubscription();
  const isProOrTeam = isPro || isTeam;
  const [generationsUsed, setGenerationsUsed] = useState(0);

  useEffect(() => {
    async function loadGenerationCount() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("generations_count_total")
        .eq("id", user.id)
        .single();
      if (profile) {
        setGenerationsUsed(profile.generations_count_total || 0);
      }
    }
    loadGenerationCount();
  }, []);

  const { startGeneration, job, isGenerating, error, generatedImages, similarityScores, isComplete } = useGeneration();

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

  // When generation completes, move to results
  if (isComplete && step === "generating") {
    setStep("results");
  }

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
        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h1 className="text-xl font-display font-bold text-white">Let&apos;s see the real you.</h1>
                <p className="text-sm text-white/50 mt-0.5">Upload 1-5 selfies. No filters — the AI needs your actual face.</p>
              </div>

              <UsageIndicator tier={tier} generationsUsed={generationsUsed} />

              <UploadZone onUploadComplete={handleUploadComplete} />

              {uploadedUrls.length > 0 && faceProfileId && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Button
                    onClick={() => setStep("style")}
                    className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-sm font-medium gap-2"
                  >
                    Pick Your First Impression
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Style Selection */}
          {step === "style" && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
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
                  <h1 className="text-2xl font-display font-bold text-white">What should your first impression say?</h1>
                  <p className="text-white/50 mt-1">Pick a look. Each one is optimized for different perception dimensions.</p>
                </div>
              </div>

              <PresetPicker
                selectedPreset={selectedPreset}
                onSelect={setSelectedPreset}
                isPro={isProOrTeam}
              />

              {/* Model Picker */}
              {selectedPreset && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">Choose your engine</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setModel("studio")}
                      className={cn(
                        "relative rounded-2xl border-2 p-4 text-left transition-all",
                        model === "studio"
                          ? "border-amber-500/70 bg-amber-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-amber-400" />
                        <span className="font-semibold text-white text-sm">Studio Quality</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">
                        2K resolution. Best identity match. Takes 45-60s per shot.
                      </p>
                      {model === "studio" && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setModel("quick")}
                      className={cn(
                        "relative rounded-2xl border-2 p-4 text-left transition-all",
                        model === "quick"
                          ? "border-violet-500/70 bg-violet-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-violet-400" />
                        <span className="font-semibold text-white text-sm">Quick Shot</span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Fast results in ~5 seconds. Good for previewing styles.
                      </p>
                      {model === "quick" && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-400" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {selectedPreset && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sticky bottom-20 md:bottom-4"
                >
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full h-14 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-base font-semibold gap-2 rounded-2xl shadow-lg shadow-violet-500/25"
                  >
                    <Sparkles className="h-5 w-5" />
                    Start My Glow-Up
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 3: Generating */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <GenerationProgress
                status={job?.status || "queued"}
                presetName={selectedPresetData?.name || ""}
                numImages={job?.numImages || 4}
                modelName={model}
                completedCount={generatedImages.length}
              />

              {/* Show images as they arrive */}
              {generatedImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>{generatedImages.length} of {job?.numImages || 4} headshots ready...</span>
                  </div>
                  <HeadshotGrid
                    images={generatedImages}
                    similarityScores={similarityScores}
                    isFreeUser={!isPro}
                    onDownload={(url) => {
                      if (!isPro) {
                        setShowPaywall(true);
                      } else {
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "haloshot-headshot.jpg";
                        a.click();
                      }
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Results */}
          {step === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-display font-bold text-white">Your glow-up is ready.</h1>
                <p className="text-white/50 mt-1">
                  {generatedImages.length} of {job?.numImages || generatedImages.length} headshots generated
                  {" with "}
                  {model === "studio" ? "Studio Quality" : "Quick Shot"}.
                  {!isPro && " Upgrade for watermark-free downloads."}
                </p>
              </div>

              <HeadshotGrid
                images={generatedImages}
                similarityScores={similarityScores}
                isFreeUser={!isPro}
                onDownload={(url) => {
                  if (!isPro) {
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
            </motion.div>
          )}
        </AnimatePresence>
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
