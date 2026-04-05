"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, X, CheckCircle, AlertCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
}

interface UploadedFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
  error?: string;
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

    const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);
  }, [files.length, maxFiles]);

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(f => formData.append("photos", f.file));

    try {
      setFiles(prev => prev.map(f => ({ ...f, status: "uploading" as const })));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setFiles(prev =>
        prev.map((f, i) => ({
          ...f,
          status: "done" as const,
          url: data.urls[i],
        }))
      );

      onUploadComplete(data.urls);
    } catch (error) {
      setFiles(prev =>
        prev.map(f => ({
          ...f,
          status: "error" as const,
          error: error instanceof Error ? error.message : "Upload failed",
        }))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 md:p-12 cursor-pointer transition-all duration-300",
          isDragging
            ? "border-violet-500 bg-violet-500/10 scale-[1.02]"
            : "border-white/10 bg-white/[0.02] hover:border-violet-500/50 hover:bg-white/[0.04]",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
        whileHover={{ scale: files.length < maxFiles ? 1.01 : 1 }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          disabled={files.length >= maxFiles}
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
            <Upload className="h-8 w-8 text-violet-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-white">
              Drop your selfies here
            </p>
            <p className="text-sm text-white/50 mt-1">
              or click to browse. JPG, PNG, or WebP up to 10MB.
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <ImageIcon className="h-4 w-4" />
              Choose Files
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                // Camera capture on mobile
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.capture = "user";
                input.onchange = (ev) => {
                  const target = ev.target as HTMLInputElement;
                  if (target.files) addFiles(target.files);
                };
                input.click();
              }}
            >
              <Camera className="h-4 w-4" />
              Take Selfie
            </Button>
          </div>
        </div>

        {/* Upload guidelines */}
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-white/40">
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-emerald-400" /> Look straight at camera</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-emerald-400" /> Good lighting</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-emerald-400" /> Clear face, no sunglasses</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-emerald-400" /> 1-5 photos</span>
        </div>
      </motion.div>

      {/* Preview grid */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {files.map((file, index) => (
                <motion.div
                  key={file.preview}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={file.preview}
                    alt={`Upload ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {/* Status overlay */}
                  {file.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    </div>
                  )}
                  {file.status === "done" && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                  )}
                  {file.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-red-400" />
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5 text-white" />
                  </button>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={uploadFiles}
              disabled={isUploading || files.every(f => f.status === "done")}
              className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-base font-medium"
            >
              {isUploading
                ? "Uploading..."
                : files.every(f => f.status === "done")
                ? "Photos Uploaded"
                : `Upload ${files.length} Photo${files.length > 1 ? "s" : ""}`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
