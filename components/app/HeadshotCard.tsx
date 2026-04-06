"use client";

import { useState } from "react";
import { Download, Heart, Share2, MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HeadshotCardProps {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  presetId?: string;
  presetName?: string;
  isFavorite?: boolean;
  createdAt: string;
  onDownload?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function HeadshotCard({
  imageUrl,
  thumbnailUrl,
  presetName,
  isFavorite: initialFavorite = false,
  createdAt,
  onDownload,
  onFavorite,
  onShare,
  onEdit,
  onDelete,
}: HeadshotCardProps) {
  const [isFav, setIsFav] = useState(initialFavorite);

  const handleFavorite = () => {
    setIsFav(!isFav);
    onFavorite?.();
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="transition-transform duration-200 hover:-translate-y-1">
      <Card className="group overflow-hidden bg-white/[0.03] border-white/10 hover:border-white/20 transition-all">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={thumbnailUrl || imageUrl}
            alt="Headshot"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 inset-x-3 flex justify-between items-center">
              <div className="flex gap-1.5">
                <button
                  onClick={handleFavorite}
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                    isFav ? "bg-rose-500 text-white" : "bg-white/15 text-white hover:bg-white/25"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
                </button>
                <button
                  onClick={onShare}
                  className="h-8 w-8 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              <Button
                size="sm"
                onClick={onDownload}
                className="bg-violet-600 hover:bg-violet-700 h-8"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex items-center justify-between">
          <div>
            {presetName && (
              <Badge variant="secondary" className="text-[10px] mb-1">
                {presetName}
              </Badge>
            )}
            <p className="text-xs text-white/40">{formattedDate}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-7 w-7 rounded-full hover:bg-white/10 flex items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-white/40" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </div>
  );
}
