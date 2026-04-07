import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free Halo Score, $14.99 One-Time, or $9.99/mo Subscription",
  description:
    "Score your photo free. Get 50 AI headshots for $14.99 one-time, or unlimited glow-ups for $9.99/mo. Team plans from $7.99/person. No hidden fees.",
  openGraph: {
    title: "HaloShot Pricing — Free Halo Score, One-Time & Subscription Plans",
    description:
      "Free Halo Score. 50 AI headshots for $14.99 one-time. Unlimited for $9.99/mo. Team plans available.",
  },
  alternates: { canonical: "https://haloshot.com/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
