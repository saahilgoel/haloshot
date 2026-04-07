import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — AI Headshot Tips, Halo Effect Research & Professional Photo Guides",
  description:
    "Tips, guides, and research on AI headshots, the halo effect, and professional personal branding. Learn what your photo is really saying about you.",
  openGraph: {
    title: "HaloShot Blog — AI Headshot Tips & Halo Effect Research",
    description:
      "Tips, guides, and insights on AI headshots, the halo effect, and professional personal branding.",
  },
  alternates: { canonical: "https://haloshot.com/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
