import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dating Profile Photos — AI Headshots That Get 3x More Matches",
  description:
    "Your dating profile photo is doing the talking. Score it for warmth and attractiveness, then get AI-optimized photos that get more swipes and first messages. Works with Hinge, Bumble, and Tinder.",
  openGraph: {
    title: "Dating Profile AI Photos — Score Your Photo, Get More Matches",
    description:
      "Score your dating photo for warmth and attractiveness. Get AI-optimized profile photos that increase matches by 3x.",
  },
  alternates: { canonical: "https://haloshot.com/for/dating" },
};

export default function DatingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
