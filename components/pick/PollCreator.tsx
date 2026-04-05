"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Check, ImagePlus, GripVertical, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Headshot {
  id: string;
  url: string;
  presetName?: string;
  haloScore?: number;
}

interface PollCreatorProps {
  headshots: Headshot[];
  onSelectionChange?: (selected: [Headshot, Headshot] | null) => void;
  selectedPair: [Headshot, Headshot] | null;
  onUploadNew?: () => void;
}

export function PollCreator({
  headshots,
  onSelectionChange,
  selectedPair,
  onUploadNew,
}: PollCreatorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [orderedPair, setOrderedPair] = useState<Headshot[]>([]);

  const toggleSelect = useCallback(
    (headshot: Headshot) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(headshot.id)) {
          next.delete(headshot.id);
          const remaining = orderedPair.filter((h) => h.id !== headshot.id);
          setOrderedPair(remaining);
          onSelectionChange?.(null);
        } else {
          if (next.size >= 2) return prev;
          next.add(headshot.id);
          const newPair = [...orderedPair, headshot];
          setOrderedPair(newPair);
          if (newPair.length === 2) {
            onSelectionChange?.([newPair[0], newPair[1]]);
          }
        }
        return next;
      });
    },
    [orderedPair, onSelectionChange]
  );

  const handleReorder = (newOrder: Headshot[]) => {
    setOrderedPair(newOrder);
    if (newOrder.length === 2) {
      onSelectionChange?.([newOrder[0], newOrder[1]]);
    }
  };

  const removeFromPair = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setOrderedPair((prev) => prev.filter((h) => h.id !== id));
    onSelectionChange?.(null);
  };

  return (
    <div className="space-y-8">
      {/* Selected pair preview */}
      <AnimatePresence>
        {orderedPair.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="mb-3 text-sm font-medium text-white/60">
              {orderedPair.length === 1
                ? "Pick one more photo"
                : "Drag to reorder. Left = Photo A, Right = Photo B."}
            </p>
            <Reorder.Group
              axis="x"
              values={orderedPair}
              onReorder={handleReorder}
              className="flex gap-4"
            >
              {orderedPair.map((headshot, idx) => (
                <Reorder.Item
                  key={headshot.id}
                  value={headshot}
                  className="relative flex-1"
                >
                  <motion.div
                    layout
                    className="relative overflow-hidden rounded-2xl border-2 border-violet-500/50 bg-white/[0.03] cursor-grab active:cursor-grabbing"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={headshot.url}
                        alt={`Photo ${idx === 0 ? "A" : "B"}`}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                      <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold text-white">
                        Photo {idx === 0 ? "A" : "B"}
                      </span>
                      <button
                        onClick={() => removeFromPair(headshot.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center p-3">
                      <GripVertical className="h-5 w-5 text-white/40" />
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
              {orderedPair.length === 1 && (
                <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02]">
                  <p className="text-sm text-white/30">Select Photo B</p>
                </div>
              )}
            </Reorder.Group>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-white/60">
            {selectedIds.size === 0
              ? "Select 2 photos from your gallery"
              : `${selectedIds.size}/2 selected`}
          </p>
          {onUploadNew && (
            <Button
              variant="outline"
              size="sm"
              onClick={onUploadNew}
              className="gap-1.5 border-white/10 text-white/60 hover:text-white"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Upload new
            </Button>
          )}
        </div>

        {headshots.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {headshots.map((headshot, i) => {
              const isSelected = selectedIds.has(headshot.id);
              const isDisabled = selectedIds.size >= 2 && !isSelected;

              return (
                <motion.button
                  key={headshot.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  onClick={() => !isDisabled && toggleSelect(headshot)}
                  disabled={isDisabled}
                  className={cn(
                    "group relative aspect-[3/4] overflow-hidden rounded-xl transition-all",
                    isSelected
                      ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0a0a14]"
                      : "hover:ring-1 hover:ring-white/20",
                    isDisabled && "cursor-not-allowed opacity-40"
                  )}
                >
                  <img
                    src={headshot.url}
                    alt="Headshot"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-violet-600/30"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 shadow-lg">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                  {headshot.haloScore && (
                    <div className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-halo backdrop-blur-sm">
                      {headshot.haloScore}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center border-dashed border-white/10 p-12 text-center">
            <ImagePlus className="mb-3 h-8 w-8 text-white/20" />
            <p className="mb-1 text-sm font-medium text-white/50">
              No headshots yet
            </p>
            <p className="mb-4 text-xs text-white/30">
              Generate some headshots first, then come back to create a poll.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10"
              onClick={onUploadNew}
            >
              Upload photos
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
