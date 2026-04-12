"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Play, Upload, Loader2, X, DollarSign, Clock, Image as ImageIcon } from "lucide-react";

interface ModelInfo {
  id: string;
  provider: "replicate" | "fal";
  costPerImage: number;
}

interface GenerationResult {
  modelId: string;
  status: "succeeded" | "failed" | "running";
  imageUrl?: string;
  durationMs?: number;
  costEstimate?: number;
  error?: string;
  replicateMetrics?: Record<string, unknown>;
}

export default function PlaygroundPage() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [prompt, setPrompt] = useState(
    "Professional headshot of the person in the photo. Studio lighting, neutral background, sharp focus on eyes, warm and competent expression. Do not change the person's face or identity."
  );
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/playground")
      .then((r) => r.json())
      .then((d) => {
        setModels(d.models || []);
        // Default: select first 3 models
        setSelectedModels((d.models || []).slice(0, 3).map((m: ModelInfo) => m.id));
      })
      .catch(console.error);
  }, []);

  const handleFile = useCallback(async (file: File) => {
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    // Upload to a temporary URL via base64
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const toggleModel = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const runGeneration = async () => {
    if (selectedModels.length === 0 || !prompt) return;
    setIsRunning(true);
    setResults(selectedModels.map((id) => ({ modelId: id, status: "running" })));

    // Run all selected models in parallel
    const promises = selectedModels.map(async (modelId) => {
      try {
        const res = await fetch("/api/admin/playground", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId, prompt, imageUrl: imageUrl || undefined }),
        });
        const data = await res.json();
        return {
          modelId,
          status: data.status || "failed",
          imageUrl: data.imageUrl,
          durationMs: data.durationMs,
          costEstimate: data.costEstimate,
          error: data.error,
          replicateMetrics: data.replicateMetrics,
        } as GenerationResult;
      } catch (err) {
        return {
          modelId,
          status: "failed" as const,
          error: String(err),
        };
      }
    });

    // Update results as they come in
    for (const promise of promises) {
      const result = await promise;
      setResults((prev) =>
        prev.map((r) => (r.modelId === result.modelId ? result : r))
      );
    }

    setIsRunning(false);
  };

  const totalCost = results
    .filter((r) => r.status === "succeeded")
    .reduce((sum, r) => sum + (r.costEstimate || 0), 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-display font-bold">Model Playground</h2>
        <p className="text-sm text-muted-foreground">
          Compare models side-by-side. Test quality and cost before deciding.
        </p>
      </div>

      {/* Config */}
      <div className="grid gap-4 lg:grid-cols-[1fr,300px]">
        {/* Left: Prompt + models */}
        <div className="space-y-4">
          {/* Prompt */}
          <Card className="border-border bg-card">
            <CardContent className="p-4 space-y-3">
              <label className="text-sm font-medium">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
              />
            </CardContent>
          </Card>

          {/* Model selection */}
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <label className="text-sm font-medium mb-3 block">Models to compare</label>
              <div className="flex flex-wrap gap-2">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleModel(m.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                      selectedModels.includes(m.id)
                        ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                        : "border-border bg-card text-muted-foreground hover:border-border hover:bg-white/[0.03]"
                    )}
                  >
                    <span className="font-mono text-xs">{m.id}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      ${m.costPerImage.toFixed(3)}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {m.provider}
                    </Badge>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {selectedModels.length} selected &middot; Est. cost: ${selectedModels.reduce((sum, id) => {
                  const m = models.find((m) => m.id === id);
                  return sum + (m?.costPerImage || 0);
                }, 0).toFixed(3)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Image upload + run */}
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4 space-y-3">
              <label className="text-sm font-medium">Reference photo</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Reference"
                    className="w-full aspect-[3/4] rounded-lg object-cover"
                  />
                  <button
                    onClick={() => { setImagePreview(null); setImageUrl(""); }}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-8 text-sm text-muted-foreground hover:border-violet-500/30 hover:bg-white/[0.02] transition-colors"
                >
                  <Upload className="mb-2 h-6 w-6" />
                  Upload reference
                  <span className="text-xs mt-1">Optional for text-only models</span>
                </button>
              )}

              <div className="text-center text-[11px] text-muted-foreground">or paste URL</div>
              <Input
                placeholder="https://..."
                value={imageUrl.startsWith("data:") ? "" : imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value || null);
                }}
                className="h-8 text-xs font-mono"
              />
            </CardContent>
          </Card>

          <Button
            onClick={runGeneration}
            disabled={isRunning || selectedModels.length === 0}
            className="w-full gap-2 bg-violet-600 hover:bg-violet-500"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? "Generating..." : `Run ${selectedModels.length} model${selectedModels.length > 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>

      {/* Results grid */}
      {results.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold">Results</h3>
            {totalCost > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <DollarSign className="h-3.5 w-3.5 text-halo-400" />
                <span className="font-mono text-halo-400">${totalCost.toFixed(4)}</span>
                <span className="text-muted-foreground">total cost</span>
              </div>
            )}
          </div>

          <div className={cn(
            "grid gap-4",
            results.length === 1 && "grid-cols-1 max-w-md",
            results.length === 2 && "grid-cols-2",
            results.length >= 3 && "grid-cols-2 lg:grid-cols-3",
          )}>
            {results.map((r) => (
              <Card key={r.modelId} className="border-border bg-card overflow-hidden">
                {/* Image / loading */}
                <div className="aspect-[3/4] bg-black/20 relative">
                  {r.status === "running" ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                      <span className="text-sm text-muted-foreground">Generating...</span>
                    </div>
                  ) : r.status === "succeeded" && r.imageUrl ? (
                    <img
                      src={r.imageUrl}
                      alt={r.modelId}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                      <X className="h-8 w-8 text-red-400" />
                      <span className="text-sm text-red-400">Failed</span>
                      <span className="text-xs text-muted-foreground text-center">{r.error}</span>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">{r.modelId}</span>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px]",
                        r.status === "succeeded" ? "border-lime-400/20 text-lime-400" :
                        r.status === "failed" ? "border-red-400/20 text-red-400" :
                        "border-blue-400/20 text-blue-400"
                      )}
                    >
                      {r.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono">
                        {r.durationMs ? `${(r.durationMs / 1000).toFixed(1)}s` : "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3 w-3 text-halo-400" />
                      <span className="font-mono text-halo-400">
                        {r.costEstimate ? `$${r.costEstimate.toFixed(4)}` : "—"}
                      </span>
                    </div>
                  </div>

                  {r.replicateMetrics && (
                    <div className="border-t border-border pt-2 text-[10px] font-mono text-muted-foreground">
                      {Object.entries(r.replicateMetrics).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span>{k}:</span>
                          <span className="text-foreground">{typeof v === "number" ? v.toFixed(3) : String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
