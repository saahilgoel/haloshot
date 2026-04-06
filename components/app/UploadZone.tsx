"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, X, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface UploadZoneProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
}

interface UploadedFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
}

export function UploadZone({ onUploadComplete, maxFiles = 5 }: UploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray
      .filter(f => ["image/jpeg", "image/png", "image/webp"].includes(f.type))
      .filter(f => f.size <= 10 * 1024 * 1024)
      .slice(0, maxFiles - files.length);

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
    }))]);
  }, [files.length, maxFiles]);

  const removeFile = (index: number) => {
    setFiles(prev => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const uploadFiles = async () => {
    if (!files.length) return;
    setIsUploading(true);
    const supabase = createClient();

    try {
      setFiles(prev => prev.map(f => ({ ...f, status: "uploading" as const })));
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i].file;
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("selfies").upload(path, file, { contentType: file.type });
        if (error) throw new Error(error.message);
        const { data: urlData } = supabase.storage.from("selfies").getPublicUrl(path);
        urls.push(urlData.publicUrl);
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "done" as const, url: urlData.publicUrl } : f));
      }
      onUploadComplete(urls);
    } catch (error) {
      setFiles(prev => prev.map(f => f.status !== "done" ? { ...f, status: "error" as const } : f));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const hasFiles = files.length > 0;

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
        disabled={files.length >= maxFiles}
      />

      {/* Compact layout: drop zone + previews side by side */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-2xl border-2 border-dashed p-4 transition-all",
          isDragging ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/[0.02]",
        )}
      >
        <div className="flex gap-3 items-start">
          {/* Photo previews */}
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={file.preview}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden"
              >
                <img src={file.preview} alt="" className="h-full w-full object-cover" />
                {file.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  </div>
                )}
                {file.status === "done" && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                )}
                {file.status === "error" && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add more button (when files exist but not at max) */}
          {hasFiles && files.length < maxFiles && (
            <button
              onClick={() => inputRef.current?.click()}
              className="h-20 w-20 shrink-0 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center hover:border-violet-500/50 hover:bg-white/[0.03] transition-all"
            >
              <Plus className="h-5 w-5 text-white/30" />
            </button>
          )}

          {/* Drop zone text (only when no files) */}
          {!hasFiles && (
            <div
              onClick={() => inputRef.current?.click()}
              className="flex-1 flex items-center gap-4 cursor-pointer py-2"
            >
              <div className="h-12 w-12 shrink-0 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Show us the real you.</p>
                <p className="text-xs text-white/40 mt-0.5">Drop photos or click to browse. 1-5 selfies, no filters.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
                  <Camera className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Compact info when files exist */}
          {hasFiles && (
            <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
              <p className="text-xs text-white/50">{files.length} photo{files.length > 1 ? "s" : ""} selected</p>
              <p className="text-[11px] text-white/30 mt-0.5">Good lighting + eyes forward = better results</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload button — hidden once all files are done */}
      {hasFiles && !files.every(f => f.status === "done") && (
        <Button
          onClick={uploadFiles}
          disabled={isUploading}
          className="w-full bg-violet-600 hover:bg-violet-700 h-10 text-sm font-medium"
        >
          {isUploading ? "Uploading..." : `Upload ${files.length} Photo${files.length > 1 ? "s" : ""}`}
        </Button>
      )}
    </div>
  );
}
