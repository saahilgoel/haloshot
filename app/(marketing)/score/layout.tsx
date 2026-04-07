import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Halo Score — Score Your Photo for Warmth, Competence & Trust",
  description:
    "Upload any photo and get your free Halo Score instantly. See how your face scores on warmth, competence, and trustworthiness — the three dimensions that drive first impressions. Based on peer-reviewed psychology research.",
  openGraph: {
    title: "Free Halo Score — Score Your Photo for Warmth, Competence & Trust",
    description:
      "Upload any photo and get your free Halo Score instantly. Based on the halo effect research by Thorndike (1920) and Willis & Todorov (2006).",
  },
  alternates: { canonical: "https://haloshot.com/score" },
};

export default function ScoreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
