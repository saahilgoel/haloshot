"use client";

import { useState } from "react";
import { Lock, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STYLE_PRESETS } from "@/lib/ai/prompts";

interface PresetPickerProps {
  selectedPreset: string | null;
  onSelect: (presetId: string) => void;
  isPro: boolean;
}

const presetList = Object.values(STYLE_PRESETS);

const categories = [
  { id: "all", label: "All" },
  { id: "professional", label: "Professional" },
  { id: "creative", label: "Creative" },
  { id: "dating", label: "Dating" },
  { id: "social", label: "Social" },
  { id: "corporate", label: "Corporate" },
  { id: "industry", label: "Industry" },
];

// Unique gradient + accent for each preset — creates instant visual identity
const presetVisuals: Record<string, { gradient: string; glow: string; tagline: string }> = {
  linkedin_executive: {
    gradient: "from-slate-800 via-slate-700 to-blue-900",
    glow: "shadow-blue-500/20",
    tagline: "Close deals. Open doors.",
  },
  founder_energy: {
    gradient: "from-amber-900 via-orange-800 to-yellow-900",
    glow: "shadow-amber-500/20",
    tagline: "Raise rounds. Turn heads.",
  },
  dating_magnetic: {
    gradient: "from-pink-900 via-rose-800 to-fuchsia-900",
    glow: "shadow-pink-500/20",
    tagline: "Swipe right. Every time.",
  },
  creative_edge: {
    gradient: "from-purple-900 via-indigo-800 to-violet-900",
    glow: "shadow-purple-500/20",
    tagline: "Moody. Editorial. You.",
  },
  corporate_uniform: {
    gradient: "from-zinc-800 via-gray-700 to-neutral-800",
    glow: "shadow-zinc-500/20",
    tagline: "Team-ready. Pixel-perfect.",
  },
  south_asian_pro: {
    gradient: "from-amber-800 via-yellow-900 to-orange-900",
    glow: "shadow-yellow-500/20",
    tagline: "Warm. Polished. Authentic.",
  },
  real_estate_trust: {
    gradient: "from-emerald-900 via-teal-800 to-cyan-900",
    glow: "shadow-emerald-500/20",
    tagline: "Trust on every yard sign.",
  },
  social_scroll_stop: {
    gradient: "from-cyan-900 via-blue-800 to-indigo-900",
    glow: "shadow-cyan-500/20",
    tagline: "Stop the scroll. Own it.",
  },
};

const fallbackVisual = {
  gradient: "from-zinc-800 via-zinc-700 to-zinc-800",
  glow: "shadow-white/10",
  tagline: "Your best look yet.",
};

export function PresetPicker({ selectedPreset, onSelect, isPro }: PresetPickerProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPresets = activeCategory === "all"
    ? presetList
    : presetList.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-5">
      {/* Category chips — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
              activeCategory === cat.id
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Preset grid — visual cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredPresets.map((preset) => {
          const isLocked = !preset.isFree && !isPro;
          const isSelected = selectedPreset === preset.id;
          const visual = presetVisuals[preset.id] || fallbackVisual;

          return (
            <button
              key={preset.id}
              onClick={() => !isLocked && onSelect(preset.id)}
              className={cn(
                "group relative flex flex-col rounded-2xl overflow-hidden text-left transition-all duration-300",
                "border border-white/[0.06] hover:border-white/15",
                isSelected && "ring-2 ring-violet-500 ring-offset-2 ring-offset-background scale-[1.02] shadow-lg",
                isSelected && visual.glow,
                isLocked && "cursor-not-allowed",
                !isSelected && !isLocked && "hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              {/* Gradient hero — the visual identity */}
              <div className={cn(
                "relative flex items-center justify-center bg-gradient-to-br py-8 sm:py-10",
                visual.gradient
              )}>
                {/* Ambient texture */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.3),transparent_60%)]" />

                {/* Large icon */}
                <span className="relative text-4xl sm:text-5xl drop-shadow-lg select-none">
                  {preset.icon}
                </span>

                {/* Badge: FREE, PRO, or selected checkmark */}
                {isSelected ? (
                  <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </div>
                ) : preset.isFree ? (
                  <span className="absolute top-2 right-2 rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    Free
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-violet-600/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                    <Sparkles className="h-2.5 w-2.5" />
                    Pro
                  </span>
                )}

                {/* Lock overlay for non-pro users on paid presets */}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="flex items-center gap-1.5 rounded-full bg-violet-600/90 px-3 py-1 text-xs font-semibold text-white shadow-xl backdrop-blur">
                      <Lock className="h-3 w-3" />
                      Unlock with Pro
                    </div>
                  </div>
                )}
              </div>

              {/* Name + tagline */}
              <div className="flex flex-col gap-0.5 p-3 bg-white/[0.02]">
                <h3 className="text-sm font-semibold text-white truncate">
                  {preset.name}
                </h3>
                <p className="text-[11px] text-white/40 truncate">
                  {visual.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
