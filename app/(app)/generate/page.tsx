"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/app/UploadZone";
import { PresetPicker } from "@/components/app/PresetPicker";
import { GenerationProgress } from "@/components/app/GenerationProgress";
import { HeadshotGrid } from "@/components/app/HeadshotGrid";
import { SubscriptionGate } from "@/components/app/SubscriptionGate";
import { UsageIndicator } from "@/components/app/UsageIndicator";
import { useGeneration } from "@/lib/hooks/useGeneration";
import { STYLE_PRESETS } from "@/lib/ai/prompts";
import { cn } from "@/lib/utils";

type Step = "upload" | "style" | "generating" | "results";

export default function GeneratePage() {
  const [step, setStep] = useState<Step>("upload");
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [faceProfileId, setFaceProfileId] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // TODO: Replace with real user data from useUser/useSubscription hooks
  const isPro = false;
  const tier = "free" as const;
  const generationsUsed = 0;

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
      }
    } catch (err) {
      console.error("Failed to create face profile:", err);
    }
  }, []);

  const handleGenerate = async () => {
    if (!faceProfileId || !selectedPreset) return;

    setStep("generating");
    await startGeneration({
      faceProfileId,
      presetId: selectedPreset,
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

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-display font-bold text-white">Upload your selfies</h1>
                <p className="text-white/50 mt-1">We need 1-5 clear photos of your face. Better photos = better headshots.</p>
              </div>

              <UsageIndicator tier={tier} generationsUsed={generationsUsed} />

              <UploadZone onUploadComplete={handleUploadComplete} />

              {uploadedUrls.length > 0 && faceProfileId && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Button
                    onClick={() => setStep("style")}
                    className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-base font-medium gap-2"
                  >
                    Choose Your Style
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
                  <h1 className="text-2xl font-display font-bold text-white">Choose your style</h1>
                  <p className="text-white/50 mt-1">Pick a look that matches your vibe.</p>
                </div>
              </div>

              <PresetPicker
                selectedPreset={selectedPreset}
                onSelect={setSelectedPreset}
                isPro={isPro}
              />

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
                    Generate {selectedPresetData?.name} Headshots
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
            >
              <GenerationProgress
                status={job?.status || "queued"}
                presetName={selectedPresetData?.name || ""}
                numImages={job?.numImages || 8}
              />
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
                <h1 className="text-2xl font-display font-bold text-white">Your headshots</h1>
                <p className="text-white/50 mt-1">
                  {generatedImages.length} headshots generated.
                  {!isPro && " Upgrade to Pro to download without watermark."}
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
                    // Trigger download
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
                  Try Another Style
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
