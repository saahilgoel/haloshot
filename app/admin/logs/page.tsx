"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

interface EventLog {
  id: string;
  user_id: string;
  event_name: string;
  event_properties: Record<string, unknown>;
  page_url: string;
  created_at: string;
}

interface GenerationLog {
  id: string;
  user_id: string;
  preset_id: string;
  model_version: string;
  status: string;
  num_images: number;
  cost_usd: string;
  created_at: string;
}

export default function LogsPage() {
  const [tab, setTab] = useState<"events" | "generations">("events");
  const [events, setEvents] = useState<EventLog[]>([]);
  const [generations, setGenerations] = useState<GenerationLog[]>([]);
  const [eventsTotal, setEventsTotal] = useState(0);
  const [gensTotal, setGensTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 50;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();
      setEvents(data.events?.data || []);
      setEventsTotal(data.events?.total || 0);
      setGenerations(data.generations?.data || []);
      setGensTotal(data.generations?.total || 0);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [page, search]);

  const statusColor = (s: string) => {
    if (s === "completed") return "bg-lime-400/10 text-lime-400 border-lime-400/20";
    if (s === "processing") return "bg-blue-400/10 text-blue-400 border-blue-400/20";
    if (s === "failed") return "bg-red-400/10 text-red-400 border-red-400/20";
    return "bg-zinc-400/10 text-zinc-400 border-zinc-400/20";
  };

  const total = tab === "events" ? eventsTotal : gensTotal;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Logs</h2>
          <p className="text-sm text-muted-foreground">
            All events and generation activity
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-2">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Tabs + search */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          <button
            onClick={() => { setTab("events"); setPage(1); }}
            className={cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === "events" ? "bg-violet-500/10 text-violet-400" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Events ({eventsTotal})
          </button>
          <button
            onClick={() => { setTab("generations"); setPage(1); }}
            className={cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === "generations" ? "bg-violet-500/10 text-violet-400" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Generations ({gensTotal})
          </button>
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-8 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {tab === "events" ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Time</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Event</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">User</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Page</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Properties</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 && !loading ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No events found</td></tr>
                  ) : events.map((e) => (
                    <tr key={e.id} className="border-b border-border/50 hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {new Date(e.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant="secondary" className="font-mono text-[11px]">{e.event_name}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {e.user_id?.slice(0, 8)}...
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-2.5 text-xs text-muted-foreground">
                        {e.page_url}
                      </td>
                      <td className="max-w-[300px] truncate px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
                        {e.event_properties ? JSON.stringify(e.event_properties) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Time</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Model</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Preset</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Images</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Cost</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">User</th>
                  </tr>
                </thead>
                <tbody>
                  {generations.length === 0 && !loading ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No generations found</td></tr>
                  ) : generations.map((g) => (
                    <tr key={g.id} className="border-b border-border/50 hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {new Date(g.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant="outline" className={cn("text-[11px]", statusColor(g.status))}>
                          {g.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs">{g.model_version || "—"}</td>
                      <td className="px-4 py-2.5 text-xs">{g.preset_id?.replace(/_/g, " ") || "—"}</td>
                      <td className="px-4 py-2.5 text-center text-xs">{g.num_images}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-halo-400">
                        {g.cost_usd ? `$${parseFloat(g.cost_usd).toFixed(4)}` : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {g.user_id?.slice(0, 8)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} total</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span>Page {page} of {totalPages || 1}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
