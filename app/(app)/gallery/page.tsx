"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Download,
  Filter,
  Camera,
  Sparkles,
  ArrowUpDown,
  Share2,
  MoreHorizontal,
  Trash2,
  Edit3,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SortType = "newest" | "highest" | "favorites";
type FilterType = "all" | "favorites" | string;

const sortOptions: { id: SortType; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "highest", label: "Highest Score" },
  { id: "favorites", label: "Favorites" },
];

const stylePresets = [
  "All",
  "Corporate",
  "Casual",
  "Creative",
  "LinkedIn",
  "Founder",
  "Editorial",
];

// TODO: replace with real data from Supabase
const mockHeadshots: Array<{
  id: string;
  url: string;
  preset: string;
  isFavorite: boolean;
  haloScore?: number;
  date: string;
}> = [];

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" as const },
  }),
};

export default function GalleryPage() {
  const [sort, setSort] = useState<SortType>("newest");
  const [styleFilter, setStyleFilter] = useState("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = mockHeadshots
    .filter((h) => {
      if (sort === "favorites")
        return h.isFavorite || favorites.has(h.id);
      if (styleFilter !== "All") return h.preset === styleFilter;
      return true;
    })
    .sort((a, b) => {
      if (sort === "highest")
        return (b.haloScore ?? 0) - (a.haloScore ?? 0);
      return 0; // newest = default order from API
    });

  const hasHeadshots = filtered.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Gallery</h1>
          <p className="mt-1 text-white/40">
            Every version of your best self, scored.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-white/10"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {sortOptions.find((s) => s.id === sort)?.label}
              <ChevronDown className="h-3.5 w-3.5 text-white/40" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => setSort(opt.id)}
                className={cn(sort === opt.id && "text-violet-400")}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Style filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {stylePresets.map((preset) => (
          <button
            key={preset}
            onClick={() => setStyleFilter(preset)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              styleFilter === preset
                ? "bg-violet-500/15 text-violet-400"
                : "text-white/40 hover:bg-white/5 hover:text-white/60"
            )}
          >
            {preset === "All" && (
              <Filter className="mr-1.5 inline h-3.5 w-3.5" />
            )}
            {preset}
          </button>
        ))}
      </div>

      {/* Grid */}
      {hasHeadshots ? (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((headshot, i) => {
              const isFav = headshot.isFavorite || favorites.has(headshot.id);
              const score = headshot.haloScore;
              const isHighScore = score && score >= 80;

              return (
                <motion.div
                  key={headshot.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    className={cn(
                      "group overflow-hidden border-white/5 bg-white/[0.02] transition-all",
                      isHighScore &&
                        "border-halo/10 shadow-[0_0_20px_rgba(245,166,35,0.08)]"
                    )}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={headshot.url}
                        alt="Headshot"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Halo Score badge */}
                      {score && (
                        <div
                          className={cn(
                            "absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-sm transition-all",
                            isHighScore
                              ? "bg-halo/20 text-halo shadow-[0_0_16px_rgba(245,166,35,0.4)]"
                              : score >= 60
                                ? "bg-violet-500/20 text-violet-300"
                                : "bg-white/10 text-white/50"
                          )}
                        >
                          {score}
                        </div>
                      )}

                      {/* Overlay actions */}
                      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex justify-end">
                          <button
                            onClick={() => toggleFavorite(headshot.id)}
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                              isFav
                                ? "bg-rose-500 text-white"
                                : "bg-black/30 text-white hover:bg-black/50"
                            )}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                isFav && "fill-current"
                              )}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1.5">
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    {/* Info footer */}
                    <div className="flex items-center justify-between p-3">
                      <div>
                        <Badge
                          variant="secondary"
                          className="bg-white/5 text-[10px] text-white/40"
                        >
                          {headshot.preset}
                        </Badge>
                        <p className="mt-1 text-[11px] text-white/25">
                          {headshot.date}
                        </p>
                      </div>
                      {score && (
                        <span
                          className={cn(
                            "text-xs font-bold",
                            isHighScore ? "text-halo" : "text-white/30"
                          )}
                        >
                          {score} Halo
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="outline" className="border-white/10">
              Load more
            </Button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="flex flex-col items-center justify-center border-dashed border-white/10 p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
              <Camera className="h-8 w-8 text-violet-400" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold">
              Your gallery is empty.
            </h3>
            <p className="mb-6 max-w-sm text-sm text-white/40">
              Your first impression shouldn&apos;t be. Generate a headshot and
              see how it scores.
            </p>
            <Button asChild className="bg-violet-600 hover:bg-violet-500">
              <Link href="/generate">
                <Sparkles className="h-4 w-4" />
                Generate headshots
              </Link>
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
