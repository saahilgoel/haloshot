import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Science of the Halo Effect — Thorndike, Willis & Todorov Research",
  description:
    "The halo effect was discovered by Edward Thorndike in 1920. Willis & Todorov proved first impressions form in 100ms. Learn the peer-reviewed psychology behind HaloShot's scoring model.",
  openGraph: {
    title: "The Science of the Halo Effect — Thorndike, Willis & Todorov Research",
    description:
      "The peer-reviewed psychology behind the Halo Score. Warmth, competence, and trustworthiness — measured in 100 milliseconds.",
  },
  alternates: { canonical: "https://haloshot.com/science" },
};

export default function ScienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
