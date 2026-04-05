"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, FlaskConical } from "lucide-react";

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  rollout: number;
  description: string;
  createdAt: string;
}

interface ABTest {
  id: string;
  name: string;
  status: "running" | "paused" | "completed";
  variant_a: string;
  variant_b: string;
  traffic_split: number;
  started: string;
  result: string | null;
}

const mockFlags: FeatureFlag[] = [
  { id: "1", name: "New Onboarding Flow", key: "new_onboarding_v2", enabled: true, rollout: 50, description: "Redesigned onboarding with photo quality tips", createdAt: "2026-03-01" },
  { id: "2", name: "Batch Upload", key: "batch_upload", enabled: true, rollout: 100, description: "Allow uploading multiple reference photos at once", createdAt: "2026-02-15" },
  { id: "3", name: "HD Downloads", key: "hd_downloads", enabled: false, rollout: 0, description: "4K resolution downloads for pro users", createdAt: "2026-03-20" },
  { id: "4", name: "AI Style Transfer", key: "ai_style_transfer", enabled: true, rollout: 25, description: "Transfer style between different preset outputs", createdAt: "2026-03-28" },
  { id: "5", name: "Team Workspaces", key: "team_workspaces", enabled: false, rollout: 0, description: "Shared workspace for enterprise teams", createdAt: "2026-04-01" },
  { id: "6", name: "Smart Crop", key: "smart_crop", enabled: true, rollout: 100, description: "AI-powered automatic cropping for various platforms", createdAt: "2026-01-10" },
  { id: "7", name: "Custom Backgrounds", key: "custom_backgrounds", enabled: true, rollout: 10, description: "User-uploaded background replacement", createdAt: "2026-04-02" },
  { id: "8", name: "Similarity Score Display", key: "similarity_display", enabled: true, rollout: 100, description: "Show similarity score on generated headshots", createdAt: "2025-12-01" },
];

const mockABTests: ABTest[] = [
  { id: "1", name: "Pricing Page Layout", status: "running", variant_a: "Current (stacked)", variant_b: "Side-by-side comparison", traffic_split: 50, started: "2026-03-20", result: null },
  { id: "2", name: "CTA Button Color", status: "running", variant_a: "Violet (#6C3CE0)", variant_b: "Lime (#C5F536)", traffic_split: 50, started: "2026-03-25", result: null },
  { id: "3", name: "Upload Step UX", status: "completed", variant_a: "Drag & drop only", variant_b: "Drag + camera capture", traffic_split: 50, started: "2026-02-15", result: "Variant B wins (+18% completion)" },
  { id: "4", name: "Free Trial Duration", status: "paused", variant_a: "3 free headshots", variant_b: "5 free headshots", traffic_split: 50, started: "2026-03-10", result: null },
];

const statusBadge: Record<string, string> = {
  running: "bg-lime-400/10 text-lime-400 border-lime-400/20",
  paused: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function FlagsPage() {
  const [flags, setFlags] = useState(mockFlags);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [formName, setFormName] = useState("");
  const [formKey, setFormKey] = useState("");
  const [formDesc, setFormDesc] = useState("");

  function toggleFlag(id: string) {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled, rollout: f.enabled ? 0 : 100 } : f
      )
    );
  }

  function updateRollout(id: string, value: number[]) {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, rollout: value[0] } : f))
    );
  }

  function openCreate() {
    setEditingFlag(null);
    setFormName("");
    setFormKey("");
    setFormDesc("");
    setDialogOpen(true);
  }

  function openEdit(flag: FeatureFlag) {
    setEditingFlag(flag);
    setFormName(flag.name);
    setFormKey(flag.key);
    setFormDesc(flag.description);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Feature Flags</h2>
          <p className="text-sm text-muted-foreground">
            Control feature rollouts and manage A/B tests
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
        >
          <Plus className="h-4 w-4" />
          New Flag
        </Button>
      </div>

      {/* Flags table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Feature Flags ({flags.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-12">On</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead className="w-48">Rollout</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags.map((flag) => (
                <TableRow key={flag.id} className="border-border">
                  <TableCell>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={() => toggleFlag(flag.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{flag.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {flag.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">
                      {flag.key}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[flag.rollout]}
                        onValueChange={(v) => updateRollout(flag.id, v)}
                        max={100}
                        step={5}
                        disabled={!flag.enabled}
                        className="flex-1"
                      />
                      <span className="text-xs font-mono w-10 text-right text-muted-foreground">
                        {flag.rollout}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(flag.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(flag)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AB Tests */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-violet-400" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              A/B Tests
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Test</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Variant A</TableHead>
                <TableHead>Variant B</TableHead>
                <TableHead className="text-center">Split</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockABTests.map((test) => (
                <TableRow key={test.id} className="border-border">
                  <TableCell className="font-medium text-sm">
                    {test.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs capitalize",
                        statusBadge[test.status]
                      )}
                    >
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">
                    {test.variant_a}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">
                    {test.variant_b}
                  </TableCell>
                  <TableCell className="text-center text-sm font-mono">
                    {test.traffic_split}/{100 - test.traffic_split}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(test.started).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </TableCell>
                  <TableCell className="text-sm">
                    {test.result ? (
                      <span className="text-lime-400 text-xs">{test.result}</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Pending</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>
              {editingFlag ? "Edit Flag" : "Create Feature Flag"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="New Feature Name"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Key</Label>
              <Input
                value={formKey}
                onChange={(e) => setFormKey(e.target.value)}
                placeholder="feature_key_name"
                className="bg-secondary border-border font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Description
              </Label>
              <Input
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="What does this flag control?"
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setDialogOpen(false)}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {editingFlag ? "Save Changes" : "Create Flag"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-border"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
