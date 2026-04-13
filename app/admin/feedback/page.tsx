"use client";

import { useState, useEffect, useMemo } from "react";
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
import { RefreshCw, Loader2, MessageSquare, ArrowUp } from "lucide-react";

type FeedbackType = "nps" | "bug" | "feature_request" | "general";

interface FeedbackEntry {
  id: string;
  user_id: string;
  type: string;
  score: number | null;
  message: string;
  created_at: string;
}

const typeBadgeConfig: Record<string, { label: string; className: string }> = {
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
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      setFeedback(json.feedback || []);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchData();
  }

  const filtered = useMemo(() => {
    if (typeFilter === "all") return feedback;
    return feedback.filter((f) => f.type === typeFilter);
  }, [typeFilter, feedback]);

  // Compute NPS distribution from real feedback
  const npsFeedback = feedback.filter(f => f.type === "nps" && f.score !== null);
  const npsDistribution = Array.from({ length: 11 }, (_, i) => ({
    score: String(i),
    count: npsFeedback.filter(f => f.score === i).length,
  }));
  const detractors = npsFeedback.filter(f => (f.score || 0) <= 6).length;
  const passives = npsFeedback.filter(f => (f.score || 0) >= 7 && (f.score || 0) <= 8).length;
  const promoters = npsFeedback.filter(f => (f.score || 0) >= 9).length;
  const totalNps = npsFeedback.length;
  const npsScore = totalNps > 0
    ? Math.round(((promoters - detractors) / totalNps) * 100)
    : null;

  // Feature requests (count messages by grouping)
  const featureRequests = feedback
    .filter(f => f.type === "feature_request")
    .map(f => f.message);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Feedback</h2>
          <p className="text-sm text-muted-foreground">
            User feedback, NPS scores, and feature requests
          </p>
        </div>
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
      </div>

      {feedback.length === 0 ? (
        <Card className="border-border bg-card border-dashed">
          <CardContent className="py-16 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">No feedback yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Feedback will appear here when users submit NPS scores, bug reports, or feature requests
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* NPS + Feature requests row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NPS distribution */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  NPS Score Distribution
                </CardTitle>
                <div className="flex items-baseline gap-2">
                  {npsScore !== null ? (
                    <>
                      <p className={cn(
                        "text-2xl font-display font-bold",
                        npsScore >= 0 ? "text-lime-400" : "text-red-400"
                      )}>
                        {npsScore > 0 ? "+" : ""}{npsScore}
                      </p>
                      <span className="text-xs text-muted-foreground">NPS score ({totalNps} responses)</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">No NPS responses yet</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {totalNps > 0 ? (
                  <>
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
                            allowDecimals={false}
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
                        <span className="text-muted-foreground">Detractors (0-6): {detractors}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        <span className="text-muted-foreground">Passives (7-8): {passives}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-lime-400" />
                        <span className="text-muted-foreground">Promoters (9-10): {promoters}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                    No NPS scores submitted yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feature requests */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Feature Requests ({featureRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {featureRequests.length > 0 ? (
                  <div className="space-y-3">
                    {featureRequests.slice(0, 7).map((msg, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                      >
                        <span className="text-xs font-mono text-muted-foreground w-5 mt-0.5">
                          #{i + 1}
                        </span>
                        <p className="text-sm text-foreground line-clamp-2">{msg}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                    No feature requests yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feedback table */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  All Feedback ({filtered.length})
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
                    <TableHead>User ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((entry) => {
                    const badge = typeBadgeConfig[entry.type] || typeBadgeConfig.general;
                    return (
                      <TableRow key={entry.id} className="border-border">
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {entry.user_id?.slice(0, 8) || "--"}...
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", badge.className)}
                          >
                            {badge.label}
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
                          {new Date(entry.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
