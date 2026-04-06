"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/app/Sidebar";
import { MobileNav } from "@/components/shared/MobileNav";
import { Header } from "@/components/shared/Header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden">
          <Header />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </div>
  );
}
