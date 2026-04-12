"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  generations: number;
  haloScore: number | null;
  joined: string;
  lastActive: string;
}

const planBadgeVariant: Record<string, string> = {
  free: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  pro: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  team: "bg-lime-400/10 text-lime-400 border-lime-400/20",
};

type SortKey = "name" | "generations" | "joined" | "lastActive";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() => {
    let result = users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesPlan = planFilter === "all" || u.plan === planFilter;
      return matchesSearch && matchesPlan;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "generations") cmp = a.generations - b.generations;
      else if (sortKey === "joined") cmp = a.joined.localeCompare(b.joined);
      else if (sortKey === "lastActive") cmp = a.lastActive.localeCompare(b.lastActive);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [users, search, planFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <ChevronUp className="inline h-3 w-3 ml-0.5" /> : <ChevronDown className="inline h-3 w-3 ml-0.5" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-secondary border-border" />
        </div>
        <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setPage(1); }}>
          <SelectTrigger className="w-36 bg-secondary border-border">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="team">Team</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-1.5">
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} users</span>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                Name <SortIcon col="name" />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="cursor-pointer select-none text-right" onClick={() => toggleSort("generations")}>
                Generations <SortIcon col="generations" />
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("joined")}>
                Joined <SortIcon col="joined" />
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("lastActive")}>
                Last Active <SortIcon col="lastActive" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 && !loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No users found</TableCell></TableRow>
            ) : paginated.map((user) => (
              <TableRow key={user.id} className="cursor-pointer border-border hover:bg-violet-500/5">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs capitalize", planBadgeVariant[user.plan] || planBadgeVariant.free)}>
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">{user.generations}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.joined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.lastActive).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="h-8 w-8 p-0 border-border">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="h-8 w-8 p-0 border-border">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
