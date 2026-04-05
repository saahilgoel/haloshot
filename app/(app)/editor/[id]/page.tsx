"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Wand2, ImageIcon, Palette, Sun, Eraser, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const backgrounds = [
  { id: "neutral_gray", label: "Gray", color: "#6B7280" },
  { id: "soft_blue", label: "Blue", color: "#3B82F6" },
  { id: "warm_white", label: "White", color: "#F9FAFB" },
  { id: "dark_charcoal", label: "Dark", color: "#1F2937" },
  { id: "modern_office", label: "Office", color: "#78716C" },
  { id: "transparent", label: "None", color: "transparent" },
];

const outfits = [
  { id: "navy_blazer", label: "Navy Blazer" },
  { id: "charcoal_suit", label: "Charcoal Suit" },
  { id: "black_turtleneck", label: "Black Turtleneck" },
  { id: "professional_blouse", label: "Professional Blouse" },
  { id: "casual_smart", label: "Smart Casual" },
  { id: "open_collar", label: "Open Collar" },
];

const lightingPresets = [
  { id: "soft_studio", label: "Soft Studio", icon: "🌤" },
  { id: "dramatic", label: "Dramatic", icon: "🌑" },
  { id: "golden_hour", label: "Golden Hour", icon: "🌅" },
  { id: "natural_window", label: "Natural Window", icon: "🪟" },
  { id: "ring_light", label: "Ring Light", icon: "💡" },
];

export default function EditorPage({ params }: { params: { id: string } }) {
  const [selectedBg, setSelectedBg] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [selectedLighting, setSelectedLighting] = useState<string | null>(null);
  const [brightness, setBrightness] = useState([50]);
  const [warmth, setWarmth] = useState([50]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);

  // Placeholder image URL — in production, fetched from saved_headshots
  const originalUrl = editedUrl || "/images/placeholder-headshot.jpg";

  const applyEdit = async (editType: string, editParams: Record<string, unknown>) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: originalUrl, editType, editParams }),
      });
      const data = await res.json();
      if (data.editedUrl) {
        setEditedUrl(data.editedUrl);
      }
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/gallery">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Gallery
              </Button>
            </Link>
            <h1 className="font-display font-bold text-white">Editor</h1>
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-400 border-0">PRO</Badge>
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
            <Download className="h-4 w-4" />
            Save & Download
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Image preview */}
        <div className="flex items-center justify-center">
          <motion.div
            className="relative aspect-[3/4] max-h-[70vh] w-auto rounded-2xl overflow-hidden bg-white/5"
            layout
          >
            <div className="h-full w-full bg-gradient-to-br from-violet-900/50 to-gray-900 flex items-center justify-center text-white/20">
              <ImageIcon className="h-20 w-20" />
            </div>

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                  <span className="text-sm text-white/70">Applying edit...</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Editor controls */}
        <div className="space-y-4">
          <Tabs defaultValue="background" className="w-full">
            <TabsList className="grid grid-cols-4 w-full bg-white/5">
              <TabsTrigger value="background" className="text-xs gap-1">
                <ImageIcon className="h-3.5 w-3.5" />
                BG
              </TabsTrigger>
              <TabsTrigger value="outfit" className="text-xs gap-1">
                <Palette className="h-3.5 w-3.5" />
                Outfit
              </TabsTrigger>
              <TabsTrigger value="lighting" className="text-xs gap-1">
                <Sun className="h-3.5 w-3.5" />
                Light
              </TabsTrigger>
              <TabsTrigger value="touch" className="text-xs gap-1">
                <Eraser className="h-3.5 w-3.5" />
                Touch Up
              </TabsTrigger>
            </TabsList>

            {/* Background */}
            <TabsContent value="background" className="space-y-4 mt-4">
              <h3 className="text-sm font-medium text-white">Choose Background</h3>
              <div className="grid grid-cols-3 gap-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setSelectedBg(bg.id);
                      applyEdit("background_swap", { background: bg.id });
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl p-3 transition-all",
                      selectedBg === bg.id
                        ? "bg-violet-500/20 ring-2 ring-violet-500"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <div
                      className="h-12 w-12 rounded-lg border border-white/10"
                      style={{
                        backgroundColor: bg.color,
                        backgroundImage: bg.id === "transparent"
                          ? "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 12px 12px"
                          : undefined,
                      }}
                    />
                    <span className="text-xs text-white/60">{bg.label}</span>
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* Outfit */}
            <TabsContent value="outfit" className="space-y-4 mt-4">
              <h3 className="text-sm font-medium text-white">Change Outfit</h3>
              <div className="grid grid-cols-2 gap-2">
                {outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => setSelectedOutfit(outfit.id)}
                    className={cn(
                      "rounded-xl p-3 text-sm text-left transition-all",
                      selectedOutfit === outfit.id
                        ? "bg-violet-500/20 ring-2 ring-violet-500 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    )}
                  >
                    {outfit.label}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => applyEdit("relight", { outfit: selectedOutfit })}
                disabled={!selectedOutfit || isProcessing}
                className="w-full bg-violet-600 hover:bg-violet-700 gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Apply Outfit Change
              </Button>
            </TabsContent>

            {/* Lighting */}
            <TabsContent value="lighting" className="space-y-4 mt-4">
              <h3 className="text-sm font-medium text-white">Lighting Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {lightingPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedLighting(preset.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl p-3 text-sm transition-all",
                      selectedLighting === preset.id
                        ? "bg-violet-500/20 ring-2 ring-violet-500 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    )}
                  >
                    <span>{preset.icon}</span>
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Brightness</span>
                    <span className="text-white/40">{brightness[0]}%</span>
                  </div>
                  <Slider value={brightness} onValueChange={setBrightness} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Warmth</span>
                    <span className="text-white/40">{warmth[0]}%</span>
                  </div>
                  <Slider value={warmth} onValueChange={setWarmth} max={100} step={1} />
                </div>
              </div>

              <Button
                onClick={() => applyEdit("relight", { lighting: selectedLighting, brightness: brightness[0], warmth: warmth[0] })}
                disabled={isProcessing}
                className="w-full bg-violet-600 hover:bg-violet-700 gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Apply Lighting
              </Button>
            </TabsContent>

            {/* Touch Up */}
            <TabsContent value="touch" className="space-y-4 mt-4">
              <h3 className="text-sm font-medium text-white">Touch Up</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={() => applyEdit("upscale", { scale: 4 })}
                  disabled={isProcessing}
                >
                  <Wand2 className="h-4 w-4 text-violet-400" />
                  Upscale to 4K
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={() => applyEdit("background_swap", {})}
                  disabled={isProcessing}
                >
                  <Eraser className="h-4 w-4 text-violet-400" />
                  Remove Background
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
