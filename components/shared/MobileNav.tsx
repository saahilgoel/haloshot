"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Images,
  Gift,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "Generate", href: "/generate", icon: Sparkles, primary: true },
  { label: "Refer", href: "/refer", icon: Gift },
  { label: "Profile", href: "/settings", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;

          if (tab.primary) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative -mt-4 flex flex-col items-center"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95",
                    isActive
                      ? "bg-lime-400 text-black shadow-lime-400/25"
                      : "bg-lime-400/90 text-black"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <span
                  className={cn(
                    "mt-1 text-[10px] font-medium",
                    isActive ? "text-lime-400" : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 px-3 py-2"
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-violet-400" : "text-muted-foreground"
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-violet-400" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-violet-400" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
