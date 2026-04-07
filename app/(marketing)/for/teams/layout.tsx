import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Headshots — Consistent AI Photos for Your Entire Company",
  description:
    "Your team page looks like a hostage situation. Get consistent, high-scoring AI headshots for your entire team in one afternoon. Admin dashboard, batch processing, custom brand styles.",
  openGraph: {
    title: "Team AI Headshots — Consistent Photos for Your Entire Company",
    description:
      "Get consistent, high-scoring AI headshots for your whole team. Batch processing, brand styles, admin dashboard.",
  },
  alternates: { canonical: "https://haloshot.com/for/teams" },
};

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
