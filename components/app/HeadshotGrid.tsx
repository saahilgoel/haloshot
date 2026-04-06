"use client";

import { useState } from "react";
import { Download, Heart, Share2, Maximize2, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeadshotGridProps {
  images: string[];
  similarityScores?: number[];
  onDownload?: (url: string) => void;
  onFavorite?: (url: string) => void;
  onShare?: (url: string) => void;
  onSelect?: (url: string) => void;
  showScores?: boolean;
  isFreeUser?: boolean;
}

export function HeadshotGrid({
  images,
  similarityScores = [],
  onDownload,
  onFavorite,
  onShare,
  onSelect,
  showScores = true,
  isFreeUser = false,
}: HeadshotGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const toggleFavorite = (url: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
    onFavorite?.(url);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {images.map((url, index) => {
          const score = similarityScores[index];
          const isFav = favorites.has(url);

          return (
            <div
              key={url}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5"
            >
              {/* Image */}
              <img
                src={url}
                alt={`Headshot ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Watermark for free users */}
              {isFreeUser && (
                <div className="absolute bottom-2 right-2 text-[10px] text-white/30 font-medium tracking-wider">
                  HALOSHOT
                </div>
              )}

              {/* Similarity score badge */}
              {showScores && score != null && (
                <div className="absolute top-2 left-2">
                  <Badge
                    className={cn(
                      "text-[10px] font-mono border-0",
                      score >= 0.8
                        ? "bg-emerald-500/80 text-white"
                        : score >= 0.6
                        ? "bg-amber-500/80 text-white"
                        : "bg-red-500/80 text-white"
                    )}
                  >
                    <Star className="h-2.5 w-2.5 mr-0.5" />
                    {(score * 100).toFixed(0)}%
                  </Badge>
                </div>
              )}

              {/* Actions — always visible on mobile, hover on desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 flex items-center justify-between">
                  <div className="flex gap-1 sm:gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(url); }}
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                        isFav
                          ? "bg-rose-500 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedImage(url); }}
                      className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onDownload?.(url); }}
                    className="bg-violet-600 hover:bg-violet-700 h-8 text-xs"
                  >
                    <Download className="h-3.5 w-3.5 sm:mr-1" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center z-10"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={expandedImage}
            alt="Expanded headshot"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
          />
          <div className="absolute bottom-6 pb-[env(safe-area-inset-bottom)] flex gap-3">
            <Button
              onClick={(e) => { e.stopPropagation(); onDownload?.(expandedImage); }}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={(e) => { e.stopPropagation(); onShare?.(expandedImage); }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
