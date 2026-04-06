"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { STYLE_PRESETS } from "@/lib/ai/prompts";

interface PresetPickerProps {
  selectedPreset: string | null;
  onSelect: (presetId: string) => void;
  isPro: boolean;
}

const presetList = Object.values(STYLE_PRESETS);

const categories = [
  { id: "all", label: "All Styles" },
  { id: "professional", label: "Professional" },
  { id: "creative", label: "Creative" },
  { id: "dating", label: "Dating" },
  { id: "social", label: "Social" },
  { id: "corporate", label: "Corporate" },
  { id: "industry", label: "Industry" },
];

export function PresetPicker({ selectedPreset, onSelect, isPro }: PresetPickerProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPresets = activeCategory === "all"
    ? presetList
    : presetList.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeCategory === cat.id
                ? "bg-violet-600 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {filteredPresets.map((preset, index) => {
          const isLocked = !preset.isFree && !isPro;
          const isSelected = selectedPreset === preset.id;

          return (
            <motion.button
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !isLocked && onSelect(preset.id)}
              className={cn(
                "group relative flex flex-col rounded-2xl border p-4 text-left transition-all duration-300",
                isSelected
                  ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
                isLocked && "opacity-60 cursor-not-allowed"
              )}
            >
              {/* Icon + Lock */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{preset.icon}</span>
                {isLocked ? (
                  <Lock className="h-4 w-4 text-white/30" />
                ) : preset.isFree ? (
                  <Badge variant="secondary" className="text-[10px] bg-emerald-500/20 text-emerald-400 border-0">
                    FREE
                  </Badge>
                ) : null}
              </div>

              {/* Name + Description */}
              <h3 className="font-display text-sm font-semibold text-white mb-1">
                {preset.name}
              </h3>
              <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-2">
                {preset.description}
              </p>

              {/* Halo pitch */}
              <p className="text-[10px] text-amber-400/70 leading-snug line-clamp-2">
                {preset.haloPitch}
              </p>

              {/* Style options preview */}
              <div className="mt-3 flex flex-wrap gap-1">
                {preset.styleConfig.backgrounds.slice(0, 3).map(bg => (
                  <span
                    key={bg}
                    className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40"
                  >
                    {bg.replace(/_/g, " ")}
                  </span>
                ))}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="preset-selected"
                  className="absolute -top-px -right-px -bottom-px -left-px rounded-2xl border-2 border-violet-500 pointer-events-none"
                />
              )}

              {/* Pro badge overlay */}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-[1px]">
                  <Badge className="bg-violet-600 text-white gap-1 border-0">
                    <Sparkles className="h-3 w-3" />
                    PRO
                  </Badge>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
