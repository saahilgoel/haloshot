"use client";

import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DownloadButtonProps {
  imageUrl: string;
  isPro: boolean;
  onUpgradeNeeded?: () => void;
}

export function DownloadButton({ imageUrl, isPro, onUpgradeNeeded }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const download = async (format: string, size: string) => {
    if (!isPro && (size === "2048" || size === "4096" || format === "png")) {
      onUpgradeNeeded?.();
      return;
    }

    setDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `haloshot-headshot-${size}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-violet-600 hover:bg-violet-700 gap-2" disabled={downloading}>
          <Download className="h-4 w-4" />
          {downloading ? "Downloading..." : "Download"}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => download("jpg", "1024")}>
          JPG 1024x1024
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => download("jpg", "2048")}>
          JPG 2048x2048 {!isPro && "🔒"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => download("jpg", "4096")}>
          JPG 4096x4096 {!isPro && "🔒"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => download("png", "1024")}>
          PNG (transparent) {!isPro && "🔒"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => download("webp", "1024")}>
          WebP 1024x1024
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
