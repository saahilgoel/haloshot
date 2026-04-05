"use client";

import { useState } from "react";
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
  X,
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
  icon: string;
  active: boolean;
  free: boolean;
  usageCount: number;
  promptTemplate: string;
  negativePrompt: string;
  styleConfig: string;
}

const mockPresets: Preset[] = [
  {
    id: "1",
    name: "Corporate Classic",
    description: "Clean professional headshot with neutral background",
    category: "professional",
    icon: "briefcase",
    active: true,
    free: false,
    usageCount: 2840,
    promptTemplate: "Professional headshot of {{subject}}, clean neutral gray background, studio lighting, sharp focus",
    negativePrompt: "blurry, low quality, distorted",
    styleConfig: '{"guidance_scale": 7.5, "strength": 0.65}',
  },
  {
    id: "2",
    name: "LinkedIn Pro",
    description: "Optimized for LinkedIn profile photos",
    category: "professional",
    icon: "zap",
    active: true,
    free: false,
    usageCount: 3120,
    promptTemplate: "Professional headshot of {{subject}}, warm lighting, slight smile, business casual, bokeh background",
    negativePrompt: "blurry, low quality, distorted",
    styleConfig: '{"guidance_scale": 7.0, "strength": 0.60}',
  },
  {
    id: "3",
    name: "Creative Studio",
    description: "Artistic headshot with creative lighting",
    category: "creative",
    icon: "palette",
    active: true,
    free: false,
    usageCount: 1560,
    promptTemplate: "Creative portrait of {{subject}}, dramatic Rembrandt lighting, artistic, editorial style",
    negativePrompt: "blurry, low quality, distorted, cartoon",
    styleConfig: '{"guidance_scale": 8.0, "strength": 0.70}',
  },
  {
    id: "4",
    name: "Natural Light",
    description: "Soft, natural outdoor-style lighting",
    category: "casual",
    icon: "sun",
    active: true,
    free: true,
    usageCount: 4200,
    promptTemplate: "Natural light portrait of {{subject}}, golden hour, soft shadows, outdoor feel",
    negativePrompt: "harsh shadows, overexposed, underexposed",
    styleConfig: '{"guidance_scale": 7.0, "strength": 0.55}',
  },
  {
    id: "5",
    name: "Executive Suite",
    description: "Premium headshot for C-level executives",
    category: "executive",
    icon: "crown",
    active: true,
    free: false,
    usageCount: 890,
    promptTemplate: "Executive portrait of {{subject}}, premium studio lighting, dark background, authoritative, confident",
    negativePrompt: "casual, blurry, low quality",
    styleConfig: '{"guidance_scale": 8.0, "strength": 0.70}',
  },
  {
    id: "6",
    name: "Tech Founder",
    description: "Modern startup founder look",
    category: "creative",
    icon: "sparkles",
    active: true,
    free: false,
    usageCount: 1250,
    promptTemplate: "Modern portrait of {{subject}}, tech startup aesthetic, clean minimal background, confident casual",
    negativePrompt: "formal, stiff, blurry",
    styleConfig: '{"guidance_scale": 7.5, "strength": 0.60}',
  },
  {
    id: "7",
    name: "Editorial",
    description: "Magazine-style editorial portrait",
    category: "editorial",
    icon: "camera",
    active: false,
    free: false,
    usageCount: 340,
    promptTemplate: "Editorial portrait of {{subject}}, magazine quality, dramatic lighting, high fashion feel",
    negativePrompt: "amateur, blurry, flat lighting",
    styleConfig: '{"guidance_scale": 8.5, "strength": 0.75}',
  },
  {
    id: "8",
    name: "Warm Studio",
    description: "Warm-toned studio portrait",
    category: "casual",
    icon: "star",
    active: true,
    free: true,
    usageCount: 2100,
    promptTemplate: "Warm studio portrait of {{subject}}, soft warm lighting, friendly expression, clean background",
    negativePrompt: "cold, harsh, blurry",
    styleConfig: '{"guidance_scale": 7.0, "strength": 0.55}',
  },
];

export default function PresetsPage() {
  const [presets, setPresets] = useState(mockPresets);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  function toggleActive(id: string) {
    setPresets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  }

  const editingPreset = editingId
    ? presets.find((p) => p.id === editingId)
    : null;

  if (showNew || editingPreset) {
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
            initialData={editingPreset || undefined}
            onSave={() => {
              setEditingId(null);
              setShowNew(false);
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
        <Button
          onClick={() => setShowNew(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
        >
          <Plus className="h-4 w-4" />
          New Preset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((preset) => {
          const Icon = iconMap[preset.icon] || Briefcase;
          return (
            <Card
              key={preset.id}
              className={cn(
                "border-border bg-card transition-colors cursor-pointer group",
                !preset.active && "opacity-50",
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
                        preset.active
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
                      checked={preset.active}
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
                      preset.free
                        ? "bg-lime-400/10 text-lime-400 border-lime-400/20"
                        : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                    )}
                  >
                    {preset.free ? "Free" : "Paid"}
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
    </div>
  );
}
