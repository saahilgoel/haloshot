import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Agent Headshots — AI Photos That Build Client Trust",
  description:
    "In real estate, your face IS your brand. Score your agent headshot for trustworthiness and competence, then get AI-optimized photos that win more listing appointments.",
  openGraph: {
    title: "Real Estate Agent AI Headshots — Build Trust, Win Listings",
    description:
      "Score your agent headshot for trustworthiness. Get AI-optimized photos that help win more listing appointments.",
  },
  alternates: { canonical: "https://haloshot.com/for/real-estate" },
};

export default function RealEstateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
