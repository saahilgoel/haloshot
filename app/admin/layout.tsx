"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Image,
  Palette,
  BarChart3,
  MessageSquare,
  Flag,
  CreditCard,
  FileText,
  Shield,
  ChevronLeft,
  ScrollText,
  FlaskConical,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/generations", label: "Generations", icon: Image },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
  { href: "/admin/playground", label: "Playground", icon: FlaskConical },
  { href: "/admin/presets", label: "Presets", icon: Palette },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/admin/flags", label: "Feature Flags", icon: Flag },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
  { href: "/admin/content", label: "Content", icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="dark flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-card">
        {/* Logo area */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Shield className="h-5 w-5 text-violet-500" />
          <span className="font-display text-sm font-bold tracking-tight">
            HaloShot Admin
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-violet-500/10 text-violet-400 font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to app */}
        <div className="border-t border-border p-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="font-display text-lg font-semibold">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Environment:{" "}
              <span className="rounded bg-lime-400/10 px-1.5 py-0.5 font-mono text-lime-400">
                production
              </span>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
