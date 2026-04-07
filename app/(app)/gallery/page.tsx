"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
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
  X,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Skeleton } from "@/components/ui/skeleton";

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

interface Headshot {
  id: string;
  url: string;
  thumbnailUrl: string;
  preset: string;
  isFavorite: boolean;
  haloScore?: number;
  date: string;
}


export default function GalleryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sort, setSort] = useState<SortType>("newest");
  const [styleFilter, setStyleFilter] = useState("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [headshots, setHeadshots] = useState<Headshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHeadshot, setEditingHeadshot] = useState<Headshot | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [pendingEdit, setPendingEdit] = useState(false);

  useEffect(() => {
    async function fetchHeadshots() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("saved_headshots")
        .select("id, original_url, thumbnail_url, preset_id, is_favorite, halo_score, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gallery fetch error:", error);
      }

      if (data && data.length > 0) {
        setHeadshots(data.map(h => ({
          id: h.id,
          url: h.original_url,
          thumbnailUrl: h.thumbnail_url || h.original_url,
          preset: h.preset_id || "Unknown",
          isFavorite: h.is_favorite || false,
          haloScore: h.halo_score ?? undefined,
          date: new Date(h.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        })));
      }
      setLoading(false);
    }
    fetchHeadshots();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleEdit = async () => {
    if (!editingHeadshot || !editPrompt.trim()) return;
    setIsEditing(true);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: editingHeadshot.url,
          prompt: editPrompt,
          headshotId: editingHeadshot.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const currentCount = headshots.length;
        setEditingHeadshot(null);
        setEditPrompt("");
        setPendingEdit(true);
        toast({ title: "Editing in progress", description: "New version will appear at the top of your gallery." });

        // Poll for the new headshot to arrive
        const supabase = createClient();
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          if (attempts > 30) { clearInterval(poll); setPendingEdit(false); return; }
          const { data: fresh } = await supabase
            .from("saved_headshots")
            .select("id, original_url, thumbnail_url, preset_id, is_favorite, halo_score, created_at")
            .order("created_at", { ascending: false });
          if (fresh && fresh.length > currentCount) {
            setHeadshots(fresh.map(h => ({
              id: h.id,
              url: h.original_url,
              thumbnailUrl: h.thumbnail_url || h.original_url,
              preset: h.preset_id || "edit",
              isFavorite: h.is_favorite || false,
              haloScore: h.halo_score ?? undefined,
              date: new Date(h.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            })));
            setPendingEdit(false);
            clearInterval(poll);
            toast({ title: "Edit complete", description: "Your new headshot is ready!" });
          }
        }, 3000);
      } else {
        toast({ title: "Edit failed", description: data.error || "Please try again.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Edit failed:", err);
      toast({ title: "Edit failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsEditing(false);
    }
  };

  const filtered = headshots
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
      {loading ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[3/4] rounded-xl" />
              <div className="flex items-center justify-between px-1">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : hasHeadshots ? (
        <>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {pendingEdit && (
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <Skeleton className="h-full w-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-400 mx-auto mb-2" />
                    <p className="text-xs text-white/40">Editing...</p>
                  </div>
                </div>
              </div>
            )}
            {filtered.map((headshot) => {
              const isFav = headshot.isFavorite || favorites.has(headshot.id);
              const score = headshot.haloScore;
              const isHighScore = score && score >= 80;

              return (
                <Card
                  key={headshot.id}
                  className={cn(
                    "group overflow-hidden border-white/5 bg-white/[0.02] transition-all hover:-translate-y-1",
                    isHighScore &&
                      "border-halo/10 shadow-[0_0_20px_rgba(245,166,35,0.08)]"
                  )}
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                    onClick={() => setViewerIndex(filtered.indexOf(headshot))}
                  >
                    <img
                      src={headshot.thumbnailUrl}
                      alt="Headshot"
                      loading="lazy"
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

                    {/* Overlay actions — always visible on mobile */}
                    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent p-2 sm:p-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
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
                          <button
                            onClick={() => {
                              const a = document.createElement("a");
                              a.href = headshot.url;
                              a.download = `haloshot-${headshot.preset}.png`;
                              a.target = "_blank";
                              a.click();
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                          >
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
                            <DropdownMenuItem onClick={() => {
                              navigator.clipboard.writeText(headshot.url);
                            }}>
                              <Share2 className="mr-2 h-4 w-4" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setEditingHeadshot(headshot);
                              setEditPrompt("");
                            }}>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit with Prompt
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400"
                              onClick={async () => {
                                const supabase = createClient();
                                await supabase.from("saved_headshots").delete().eq("id", headshot.id);
                                setHeadshots(prev => prev.filter(h => h.id !== headshot.id));
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Info footer */}
                  <div className="flex items-center justify-between p-2 sm:p-3">
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
        <div>
          <Card className="flex flex-col items-center justify-center border-dashed border-white/10 p-8 sm:p-12 text-center">
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
        </div>
      )}

      {/* Fullscreen Viewer — hidden when edit modal is open */}
      {viewerIndex !== null && filtered[viewerIndex] && !editingHeadshot && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" && viewerIndex > 0) setViewerIndex(viewerIndex - 1);
            if (e.key === "ArrowRight" && viewerIndex < filtered.length - 1) setViewerIndex(viewerIndex + 1);
            if (e.key === "Escape") setViewerIndex(null);
          }}
          tabIndex={0}
          ref={(el) => el?.focus()}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/50">{viewerIndex + 1} / {filtered.length}</span>
              {filtered[viewerIndex].haloScore && (
                <span className={cn(
                  "text-sm font-bold",
                  filtered[viewerIndex].haloScore! >= 85 ? "text-amber-400" :
                  filtered[viewerIndex].haloScore! >= 70 ? "text-violet-400" : "text-white/40"
                )}>
                  {filtered[viewerIndex].haloScore} Halo
                </span>
              )}
            </div>
            <button onClick={() => setViewerIndex(null)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Image area with swipe */}
          <div
            className="flex-1 flex items-center justify-center px-4 relative overflow-hidden"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              (e.currentTarget as HTMLElement).dataset.touchX = String(touch.clientX);
            }}
            onTouchEnd={(e) => {
              const startX = Number((e.currentTarget as HTMLElement).dataset.touchX || 0);
              const endX = e.changedTouches[0].clientX;
              const diff = startX - endX;
              if (Math.abs(diff) > 60) {
                if (diff > 0 && viewerIndex < filtered.length - 1) setViewerIndex(viewerIndex + 1);
                if (diff < 0 && viewerIndex > 0) setViewerIndex(viewerIndex - 1);
              }
            }}
          >
            {/* Nav arrows (desktop) */}
            {viewerIndex > 0 && (
              <button
                onClick={() => setViewerIndex(viewerIndex - 1)}
                className="absolute left-2 sm:left-6 z-10 h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10"
              >
                <ChevronDown className="h-5 w-5 rotate-90" />
              </button>
            )}
            {viewerIndex < filtered.length - 1 && (
              <button
                onClick={() => setViewerIndex(viewerIndex + 1)}
                className="absolute right-2 sm:right-6 z-10 h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10"
              >
                <ChevronDown className="h-5 w-5 -rotate-90" />
              </button>
            )}

            <img
              src={filtered[viewerIndex].url}
              alt="Headshot"
              className="max-h-[80vh] max-w-full object-contain rounded-2xl"
            />
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-center gap-3 px-4 py-4 pb-[env(safe-area-inset-bottom)]">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 gap-2"
              onClick={() => {
                const a = document.createElement("a");
                a.href = filtered[viewerIndex].url;
                a.download = `haloshot-${filtered[viewerIndex].preset}.webp`;
                a.target = "_blank";
                a.click();
              }}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 gap-2"
              onClick={() => navigator.clipboard.writeText(filtered[viewerIndex].url)}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 gap-2"
              onClick={() => {
                setEditingHeadshot(filtered[viewerIndex]);
                setEditPrompt("");
                setViewerIndex(null);
              }}
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingHeadshot && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingHeadshot(null)}>
          <div className="bg-card border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Edit Headshot</h3>
              <button onClick={() => setEditingHeadshot(null)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <img src={editingHeadshot.url} alt="Current" className="h-32 w-24 rounded-xl object-cover" />
              <div className="flex-1 space-y-3">
                <p className="text-sm text-white/50">Describe what you want to change. The AI will re-generate from this image.</p>
                <Input
                  placeholder="e.g. Make the background a modern office, add a blazer"
                  value={editPrompt}
                  onChange={e => setEditPrompt(e.target.value)}
                  className="bg-white/5 border-white/10"
                  autoFocus
                  onKeyDown={e => { if (e.key === "Enter" && editPrompt.trim()) handleEdit(); }}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setEditingHeadshot(null)} className="border-white/10">
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!editPrompt.trim() || isEditing}
                className="bg-violet-600 hover:bg-violet-700 gap-2"
              >
                {isEditing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
                {isEditing ? "Generating..." : "Re-generate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
