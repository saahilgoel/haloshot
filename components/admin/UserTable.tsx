"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  generations: number;
  joined: string;
  lastActive: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@company.com", plan: "pro", generations: 87, joined: "2026-01-15", lastActive: "2026-04-05" },
  { id: "2", name: "Marcus Johnson", email: "marcus@startup.io", plan: "starter", generations: 23, joined: "2026-02-20", lastActive: "2026-04-04" },
  { id: "3", name: "Priya Patel", email: "priya@design.co", plan: "pro", generations: 142, joined: "2025-11-10", lastActive: "2026-04-05" },
  { id: "4", name: "Tom Williams", email: "tom@agency.net", plan: "enterprise", generations: 420, joined: "2025-09-05", lastActive: "2026-04-05" },
  { id: "5", name: "Emily Rodriguez", email: "emily@freelance.me", plan: "free", generations: 3, joined: "2026-03-28", lastActive: "2026-03-29" },
  { id: "6", name: "James Lee", email: "james@tech.io", plan: "starter", generations: 15, joined: "2026-03-01", lastActive: "2026-04-03" },
  { id: "7", name: "Aisha Khan", email: "aisha@creative.co", plan: "pro", generations: 98, joined: "2025-12-05", lastActive: "2026-04-05" },
  { id: "8", name: "David Kim", email: "david@firm.com", plan: "free", generations: 1, joined: "2026-04-01", lastActive: "2026-04-01" },
  { id: "9", name: "Lisa Wang", email: "lisa@brand.io", plan: "enterprise", generations: 310, joined: "2025-10-15", lastActive: "2026-04-04" },
  { id: "10", name: "Roberto Silva", email: "roberto@studio.br", plan: "starter", generations: 45, joined: "2026-01-22", lastActive: "2026-04-02" },
  { id: "11", name: "Nina Volkov", email: "nina@photo.ru", plan: "pro", generations: 67, joined: "2026-02-14", lastActive: "2026-04-05" },
  { id: "12", name: "Chris O'Brien", email: "chris@media.ie", plan: "free", generations: 2, joined: "2026-03-30", lastActive: "2026-03-30" },
  { id: "13", name: "Maya Tanaka", email: "maya@digital.jp", plan: "pro", generations: 156, joined: "2025-08-20", lastActive: "2026-04-05" },
  { id: "14", name: "Alex Turner", email: "alex@startup.uk", plan: "starter", generations: 31, joined: "2026-02-05", lastActive: "2026-04-01" },
  { id: "15", name: "Fatima Al-Rashid", email: "fatima@creative.ae", plan: "enterprise", generations: 275, joined: "2025-11-01", lastActive: "2026-04-05" },
];

const planBadgeVariant: Record<string, string> = {
  free: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  starter: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  pro: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  enterprise: "bg-lime-400/10 text-lime-400 border-lime-400/20",
};

type SortKey = "name" | "generations" | "joined" | "lastActive";

export function UserTable() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    let result = mockUsers.filter((u) => {
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
  }, [search, planFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="inline h-3 w-3 ml-0.5" />
    ) : (
      <ChevronDown className="inline h-3 w-3 ml-0.5" />
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-secondary border-border"
          />
        </div>
        <Select
          value={planFilter}
          onValueChange={(v) => {
            setPlanFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36 bg-secondary border-border">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} users
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("name")}
              >
                Name <SortIcon col="name" />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => toggleSort("generations")}
              >
                Generations <SortIcon col="generations" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("joined")}
              >
                Joined <SortIcon col="joined" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("lastActive")}
              >
                Last Active <SortIcon col="lastActive" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer border-border hover:bg-violet-500/5"
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs capitalize", planBadgeVariant[user.plan])}
                  >
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {user.generations}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.joined).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.lastActive).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-8 w-8 p-0 border-border"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="h-8 w-8 p-0 border-border"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
