"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import {
  LayoutDashboard,
  Sparkles,
  Images,
  Users,
  Settings,
  Gift,
  LogOut,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  accent?: boolean;
  teamOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Generate", href: "/generate", icon: Sparkles, accent: true },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "Team", href: "/team", icon: Users, teamOnly: true },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Refer & Earn", href: "/refer", icon: Gift },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, profile } = useUser();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const plan = profile?.subscription_tier || "free";
  const isTeamPlan = plan === "team";

  const tierLabel: Record<string, string> = {
    free: "The Reality Check",
    pro: "The Glow-Up",
    team: "Team",
  };

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r border-border transition-all duration-200",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
      style={{ backgroundColor: "#1A1A24" }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 font-display text-sm font-bold text-black halo-glow-sm">
          H
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-bold tracking-tight">
            HaloShot
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Plan badge */}
      {!collapsed && (
        <div className="mx-4 mb-4">
          <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-400">
            <Crown className="h-3.5 w-3.5" />
            {tierLabel[plan]}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          if (item.teamOnly && !isTeamPlan) return null;

          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-500/15 text-white"
                  : "text-muted-foreground hover:bg-violet-500/5 hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  item.accent && !isActive && "text-amber-400",
                  isActive && "text-violet-400"
                )}
              />
              {!collapsed && (
                <span>
                  {item.label}
                  {item.accent && (
                    <span className="ml-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="relative border-t border-border p-2">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary",
            collapsed && "justify-center px-2"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
            {displayName.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {displayEmail}
              </p>
            </div>
          )}
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute bottom-full left-2 right-2 mb-1 rounded-lg border border-border bg-popover p-1 shadow-lg">
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              onClick={() => setDropdownOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/settings/billing"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              onClick={() => setDropdownOpen(false)}
            >
              <CreditCard className="h-4 w-4" />
              Billing
            </Link>
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              onClick={() => {
                setDropdownOpen(false);
                // TODO: implement logout
              }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
