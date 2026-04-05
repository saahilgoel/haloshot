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
  SlidersHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterType = "all" | "favorites" | "style";

const filters: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
  { id: "style", label: "By Style" },
];

// TODO: replace with real data from Supabase
const mockHeadshots: Array<{
  id: string;
  url: string;
  preset: string;
  isFavorite: boolean;
  date: string;
}> = [
  // Empty for now
];

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" as const },
  }),
};

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filtered = mockHeadshots.filter((h) => {
    if (activeFilter === "favorites") return h.isFavorite || favorites.has(h.id);
    return true;
  });

  const hasHeadshots = filtered.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Gallery</h1>
          <p className="mt-1 text-muted-foreground">
            All your generated headshots in one place.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4" />
          Sort
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeFilter === filter.id
                ? "bg-violet-500/15 text-violet-400"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {filter.id === "favorites" && <Heart className="mr-1.5 inline h-3.5 w-3.5" />}
            {filter.id === "style" && <Filter className="mr-1.5 inline h-3.5 w-3.5" />}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {hasHeadshots ? (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((headshot, i) => (
              <motion.div
                key={headshot.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Card className="group overflow-hidden">
                  <div className="relative aspect-[3/4] bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={headshot.url}
                      alt="Headshot"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Overlay actions */}
                    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                      {/* Top right: favorite */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => toggleFavorite(headshot.id)}
                          className="rounded-full bg-black/30 p-1.5 backdrop-blur-sm hover:bg-black/50"
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              headshot.isFavorite || favorites.has(headshot.id)
                                ? "fill-pink-400 text-pink-400"
                                : "text-white"
                            )}
                          />
                        </button>
                      </div>
                      {/* Bottom: info + download */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="rounded-full bg-violet-500/80 px-2 py-0.5 text-xs font-medium text-white">
                            {headshot.preset}
                          </span>
                          <p className="mt-1 text-xs text-white/70">
                            {headshot.date}
                          </p>
                        </div>
                        <button className="rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30">
                          <Download className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load more */}
          <div className="flex justify-center pt-4">
            <Button variant="outline">Load more</Button>
          </div>
        </>
      ) : (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
              <Camera className="h-8 w-8 text-violet-400" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold">
              Your gallery is empty
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Generate your first headshot and it will appear here. All your
              creations are saved automatically.
            </p>
            <Button
              asChild
              className="bg-violet-600 hover:bg-violet-500"
            >
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
