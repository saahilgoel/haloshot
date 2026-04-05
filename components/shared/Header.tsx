"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Generate", href: "/generate" },
  { label: "Gallery", href: "/gallery" },
  { label: "Refer & Earn", href: "/refer" },
  { label: "Settings", href: "/settings" },
  { label: "Billing", href: "/settings/billing" },
];

// Map pathname to page title
function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/generate")) return "Generate";
  if (pathname.startsWith("/gallery")) return "Gallery";
  if (pathname.startsWith("/refer")) return "Refer & Earn";
  if (pathname.startsWith("/settings/billing")) return "Billing";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/team")) return "Team";
  return "HaloShot";
}

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const title = getPageTitle(pathname);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <h1 className="font-display text-lg font-semibold">{title}</h1>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <span className="h-4 w-4" />
            )}
          </button>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
          </button>
        </div>
      </header>

      {/* Hamburger menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 text-xs font-bold text-white">
                H
              </div>
              <span className="font-display text-lg font-bold">HaloShot</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-1 p-4">
            {menuLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "bg-violet-500/15 text-white"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
