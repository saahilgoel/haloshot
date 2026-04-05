"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X } from "lucide-react";

interface PresetData {
  name: string;
  description: string;
  category: string;
  icon: string;
  promptTemplate: string;
  negativePrompt: string;
  styleConfig: string;
  active: boolean;
  free: boolean;
}

const defaultPreset: PresetData = {
  name: "",
  description: "",
  category: "professional",
  icon: "briefcase",
  promptTemplate: "",
  negativePrompt: "blurry, low quality, distorted, unrealistic, cartoon, anime, painting",
  styleConfig: '{\n  "guidance_scale": 7.5,\n  "num_inference_steps": 30,\n  "strength": 0.65\n}',
  active: true,
  free: false,
};

const categories = [
  "professional",
  "creative",
  "editorial",
  "casual",
  "executive",
  "artistic",
];

const icons = [
  "briefcase",
  "camera",
  "palette",
  "star",
  "zap",
  "crown",
  "sparkles",
  "sun",
];

function HighlightedTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  // Highlight {{variables}} in the prompt template
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
      />
      {value && (
        <div className="absolute top-2 right-2 flex gap-1 flex-wrap">
          {(value.match(/\{\{(\w+)\}\}/g) || []).map((v, i) => (
            <span
              key={i}
              className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-mono text-violet-400"
            >
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function PresetEditor({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: Partial<PresetData>;
  onSave?: (data: PresetData) => void;
  onCancel?: () => void;
}) {
  const [data, setData] = useState<PresetData>({
    ...defaultPreset,
    ...initialData,
  });

  function update<K extends keyof PresetData>(key: K, value: PresetData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">
          {initialData?.name ? "Edit Preset" : "New Preset"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Name & Category row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Corporate Classic"
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Select
              value={data.category}
              onValueChange={(v) => update("category", v)}
            >
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Input
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Clean, professional headshot with neutral background"
            className="bg-secondary border-border"
          />
        </div>

        {/* Icon */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Icon</Label>
          <Select value={data.icon} onValueChange={(v) => update("icon", v)}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {icons.map((ic) => (
                <SelectItem key={ic} value={ic} className="capitalize">
                  {ic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Prompt Template */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Prompt Template
          </Label>
          <HighlightedTextarea
            value={data.promptTemplate}
            onChange={(v) => update("promptTemplate", v)}
            placeholder="Professional headshot of {{subject}}, studio lighting, {{background}} background, sharp focus, 8k quality"
            rows={4}
          />
          <p className="text-[11px] text-muted-foreground">
            Use {"{{variable}}"} syntax for dynamic values. Available: {"{{subject}}"}, {"{{background}}"}, {"{{style}}"}
          </p>
        </div>

        {/* Negative Prompt */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Negative Prompt
          </Label>
          <HighlightedTextarea
            value={data.negativePrompt}
            onChange={(v) => update("negativePrompt", v)}
            rows={2}
          />
        </div>

        {/* Style Config JSON */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Style Config (JSON)
          </Label>
          <textarea
            value={data.styleConfig}
            onChange={(e) => update("styleConfig", e.target.value)}
            rows={4}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Switch
              checked={data.active}
              onCheckedChange={(v) => update("active", v)}
            />
            <Label className="text-sm">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={data.free}
              onCheckedChange={(v) => update("free", v)}
            />
            <Label className="text-sm">Free Tier</Label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            onClick={() => onSave?.(data)}
            className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
          >
            <Save className="h-4 w-4" />
            Save Preset
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-border gap-1.5"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
