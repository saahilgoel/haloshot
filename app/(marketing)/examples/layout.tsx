import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Headshot Examples — Before & After Glow-Up Gallery with Halo Scores",
  description:
    "See real before-and-after AI headshot transformations with Halo Score overlays. Corporate, LinkedIn, Creative, Executive, Dating, and Founder styles. Average glow-up: +38 points.",
  openGraph: {
    title: "AI Headshot Examples — Before & After Glow-Up Gallery",
    description:
      "See real AI headshot transformations with Halo Score improvements across Corporate, LinkedIn, Creative, and more styles.",
  },
  alternates: { canonical: "https://haloshot.com/examples" },
};

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
