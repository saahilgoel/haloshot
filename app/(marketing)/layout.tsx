"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";

const useCaseLinks = [
  { label: "LinkedIn Headshots", href: "/for/linkedin" },
  { label: "Dating Photos", href: "/for/dating" },
  { label: "Founder & Team", href: "/for/founders" },
  { label: "Teams", href: "/for/teams" },
  { label: "Real Estate", href: "/for/real-estate" },
];

const navLinks = [
  { label: "Science", href: "/science" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [useCaseOpen, setUseCaseOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Marketing header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 font-display text-sm font-bold text-white">
              H
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              HaloShot
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {/* Use Cases dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setUseCaseOpen(true)}
              onMouseLeave={() => setUseCaseOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Use Cases
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", useCaseOpen && "rotate-180")} />
              </button>
              {useCaseOpen && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="w-52 rounded-xl border border-white/10 bg-background/95 p-2 shadow-xl backdrop-blur-xl">
                    {useCaseLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  pathname === link.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
            >
              Log in
            </Link>
            <Link
              href="/score"
              className="inline-flex h-9 items-center rounded-lg bg-halo-500 px-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-halo-400"
            >
              Score Free
            </Link>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="border-t border-white/[0.06] bg-background px-4 pb-6 pt-4 md:hidden">
            <div className="space-y-1">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Use Cases</p>
              {useCaseLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 border-t border-white/[0.06]" />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
