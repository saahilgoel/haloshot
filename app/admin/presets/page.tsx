"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PresetEditor } from "@/components/admin/PresetEditor";
import {
  Briefcase,
  Camera,
  Palette,
  Star,
  Zap,
  Crown,
  Sparkles,
  Sun,
  GripVertical,
  Plus,
  RefreshCw,
  Loader2,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  camera: Camera,
  palette: Palette,
  star: Star,
  zap: Zap,
  crown: Crown,
  sparkles: Sparkles,
  sun: Sun,
};

interface Preset {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  is_active: boolean;
  is_free: boolean;
  usageCount: number;
  prompt_template: string;
  negative_prompt: string;
  style_config: Record<string, unknown> | null;
}

export default function PresetsPage() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  async function fetchPresets() {
    try {
      const res = await fetch("/api/admin/presets");
      const json = await res.json();
      setPresets(json.presets || []);
    } catch (err) {
      console.error("Failed to fetch presets:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchPresets();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchPresets();
  }

  async function toggleActive(id: string) {
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    const newActive = !preset.is_active;
    setPresets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: newActive } : p))
    );
    try {
      await fetch("/api/admin/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: newActive }),
      });
    } catch (err) {
      // Revert on failure
      setPresets((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !newActive } : p))
      );
    }
  }

  const editingPreset = editingId
    ? presets.find((p) => p.id === editingId)
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </div>
    );
  }

  if (showNew || editingPreset) {
    const editorData = editingPreset
      ? {
          name: editingPreset.name,
          description: editingPreset.description,
          category: editingPreset.category,
          icon: editingPreset.icon || "briefcase",
          promptTemplate: editingPreset.prompt_template || "",
          negativePrompt: editingPreset.negative_prompt || "",
          styleConfig: editingPreset.style_config
            ? JSON.stringify(editingPreset.style_config, null, 2)
            : "{}",
          active: editingPreset.is_active,
          free: editingPreset.is_free,
        }
      : undefined;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold">Presets</h2>
            <p className="text-sm text-muted-foreground">
              {editingPreset ? `Editing: ${editingPreset.name}` : "Create new preset"}
            </p>
          </div>
        </div>
        <div className="max-w-2xl">
          <PresetEditor
            initialData={editorData}
            onSave={() => {
              setEditingId(null);
              setShowNew(false);
              fetchPresets();
            }}
            onCancel={() => {
              setEditingId(null);
              setShowNew(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Presets</h2>
          <p className="text-sm text-muted-foreground">
            Manage headshot generation presets and prompt templates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-border gap-1.5"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowNew(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Preset
          </Button>
        </div>
      </div>

      {presets.length === 0 ? (
        <Card className="border-border bg-card border-dashed">
          <CardContent className="py-16 text-center">
            <Palette className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">No presets found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first preset to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => {
            const iconKey = preset.icon || (preset.style_config as Record<string, unknown>)?.icon as string || "briefcase";
            const Icon = iconMap[iconKey] || Briefcase;
            return (
              <Card
                key={preset.id}
                className={cn(
                  "border-border bg-card transition-colors cursor-pointer group",
                  !preset.is_active && "opacity-50",
                  "hover:border-violet-500/30"
                )}
                onClick={() => setEditingId(preset.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          preset.is_active
                            ? "bg-violet-500/10 text-violet-400"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{preset.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {preset.category}
                        </p>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={preset.is_active}
                        onCheckedChange={() => toggleActive(preset.id)}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {preset.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        preset.is_free
                          ? "bg-lime-400/10 text-lime-400 border-lime-400/20"
                          : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                      )}
                    >
                      {preset.is_free ? "Free" : "Paid"}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {preset.usageCount.toLocaleString()} uses
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
