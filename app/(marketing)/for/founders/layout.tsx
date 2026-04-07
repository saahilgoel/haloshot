import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder & Startup Team Headshots — AI Photos for Pitch Decks",
  description:
    "Your headshot is in your pitch deck. Investors notice. Score your team's photos for competence and trustworthiness, then get consistent AI headshots in one afternoon.",
  openGraph: {
    title: "Founder Headshots — AI Photos for Pitch Decks & Team Pages",
    description:
      "Get your founding team consistent, high-scoring headshots for pitch decks, team pages, and investor materials.",
  },
  alternates: { canonical: "https://haloshot.com/for/founders" },
};

export default function FoundersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
