import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Headshots — AI Photos That Get 21x More Profile Views",
  description:
    "Your LinkedIn photo scored a 34. Recruiters decide in 100ms. Get an AI headshot optimized for warmth, competence, and trustworthiness. 89% of hiring managers judge your photo first.",
  openGraph: {
    title: "LinkedIn AI Headshots — Score Your LinkedIn Photo Free",
    description:
      "Recruiters decide in 100ms. Get a LinkedIn headshot that scores high on warmth and competence. Free Halo Score analysis.",
  },
  alternates: { canonical: "https://haloshot.com/for/linkedin" },
};

export default function LinkedInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
