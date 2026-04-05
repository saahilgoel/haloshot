"use client";

import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ThumbsUp, ArrowUp } from "lucide-react";

type FeedbackType = "nps" | "bug" | "feature_request" | "general";

interface FeedbackEntry {
  id: string;
  user: string;
  type: FeedbackType;
  score: number | null;
  message: string;
  date: string;
}

const mockFeedback: FeedbackEntry[] = [
  { id: "1", user: "sarah@company.com", type: "nps", score: 9, message: "Love the quality! Best headshot tool I've used.", date: "2026-04-05" },
  { id: "2", user: "marcus@startup.io", type: "feature_request", score: null, message: "Would love batch upload support for team accounts", date: "2026-04-04" },
  { id: "3", user: "priya@design.co", type: "nps", score: 10, message: "Incredible similarity scores. Recommended to my whole team.", date: "2026-04-04" },
  { id: "4", user: "tom@agency.net", type: "bug", score: null, message: "Generation stuck on processing for 5+ minutes. Had to refresh.", date: "2026-04-03" },
  { id: "5", user: "emily@freelance.me", type: "nps", score: 7, message: "Good tool, but limited free tier is frustrating.", date: "2026-04-03" },
  { id: "6", user: "james@tech.io", type: "feature_request", score: null, message: "API access for integrating with our HR platform", date: "2026-04-02" },
  { id: "7", user: "aisha@creative.co", type: "nps", score: 10, message: "Saved us thousands on professional photography!", date: "2026-04-02" },
  { id: "8", user: "david@firm.com", type: "general", score: null, message: "How do I download in higher resolution?", date: "2026-04-01" },
  { id: "9", user: "lisa@brand.io", type: "nps", score: 8, message: "Great quality but wish there were more preset options.", date: "2026-04-01" },
  { id: "10", user: "roberto@studio.br", type: "bug", score: null, message: "Wrong background color in Creative Studio preset", date: "2026-03-31" },
  { id: "11", user: "nina@photo.ru", type: "feature_request", score: null, message: "Custom background upload would be amazing", date: "2026-03-30" },
  { id: "12", user: "chris@media.ie", type: "nps", score: 6, message: "Decent but similarity could be better for some angles", date: "2026-03-30" },
  { id: "13", user: "maya@digital.jp", type: "feature_request", score: null, message: "Support for group/team photos", date: "2026-03-29" },
  { id: "14", user: "alex@startup.uk", type: "nps", score: 9, message: "Game changer for our startup team page", date: "2026-03-28" },
  { id: "15", user: "fatima@creative.ae", type: "general", score: null, message: "Can I use these for my company website?", date: "2026-03-28" },
];

const npsDistribution = [
  { score: "0", count: 2 },
  { score: "1", count: 1 },
  { score: "2", count: 1 },
  { score: "3", count: 3 },
  { score: "4", count: 5 },
  { score: "5", count: 8 },
  { score: "6", count: 12 },
  { score: "7", count: 18 },
  { score: "8", count: 28 },
  { score: "9", count: 35 },
  { score: "10", count: 42 },
];

const featureRequests = [
  { feature: "Batch upload for teams", votes: 47 },
  { feature: "API access", votes: 38 },
  { feature: "Custom background upload", votes: 31 },
  { feature: "Group/team photos", votes: 24 },
  { feature: "Video headshots", votes: 19 },
  { feature: "White-label solution", votes: 15 },
  { feature: "Slack integration", votes: 12 },
];

const typeBadgeConfig: Record<FeedbackType, { label: string; className: string }> = {
  nps: { label: "NPS", className: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  bug: { label: "Bug", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  feature_request: { label: "Feature", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  general: { label: "General", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

function NpsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">Score {label}</p>
      <p className="text-sm font-bold text-foreground">{payload[0].value} responses</p>
    </div>
  );
}

export default function FeedbackPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (typeFilter === "all") return mockFeedback;
    return mockFeedback.filter((f) => f.type === typeFilter);
  }, [typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Feedback</h2>
        <p className="text-sm text-muted-foreground">
          User feedback, NPS scores, and feature requests
        </p>
      </div>

      {/* NPS + Feature requests row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NPS distribution */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              NPS Score Distribution
            </CardTitle>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-display font-bold text-lime-400">+64</p>
              <span className="text-xs text-muted-foreground">NPS score</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npsDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(260 12% 16%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="score"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }}
                  />
                  <Tooltip content={<NpsTooltip />} />
                  <Bar
                    dataKey="count"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                    fill="#6C3CE0"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-muted-foreground">Detractors (0-6): 32</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="text-muted-foreground">Passives (7-8): 46</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                <span className="text-muted-foreground">Promoters (9-10): 77</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature requests ranked */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Feature Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {featureRequests.map((item, i) => (
                <div
                  key={item.feature}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-xs font-mono text-muted-foreground w-5">
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{item.feature}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ArrowUp className="h-3 w-3 text-lime-400" />
                        <span className="font-mono">{item.votes}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{
                          width: `${(item.votes / featureRequests[0].votes) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              All Feedback
            </CardTitle>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36 h-8 bg-secondary border-border text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="nps">NPS</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => (
                <TableRow key={entry.id} className="border-border">
                  <TableCell className="text-sm">{entry.user}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        typeBadgeConfig[entry.type].className
                      )}
                    >
                      {typeBadgeConfig[entry.type].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {entry.score !== null ? (
                      <span
                        className={cn(
                          "font-mono text-sm font-medium",
                          entry.score >= 9
                            ? "text-lime-400"
                            : entry.score >= 7
                            ? "text-yellow-400"
                            : "text-red-400"
                        )}
                      >
                        {entry.score}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm max-w-xs truncate">
                    {entry.message}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
