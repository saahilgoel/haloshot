"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTABanner } from "@/components/marketing/CTABanner";
import { notFound } from "next/navigation";

interface CompetitorData {
  name: string;
  slug: string;
  tagline: string;
  haloshotAdvantages: string[];
  comparison: { feature: string; haloshot: string | boolean; competitor: string | boolean }[];
  differentiators: { title: string; description: string }[];
}

const competitors: Record<string, CompetitorData> = {
  headshotpro: {
    name: "HeadshotPro",
    slug: "headshotpro",
    tagline: "HeadshotPro makes headshots. HaloShot tells you why yours isn\u2019t working \u2014 then fixes it in 60 seconds.",
    haloshotAdvantages: [
      "Your Halo Score: know exactly where your photo stands (HeadshotPro can\u2019t tell you)",
      "60 seconds vs. 2 hours. Respect your own time.",
      "Free tier available. HeadshotPro charges $29 before you see anything.",
      "98% identity accuracy vs. 85%. It\u2019s you, not your approximate cousin.",
      "Psychology-backed scoring on warmth, competence, and trustworthiness.",
    ],
    comparison: [
      { feature: "Halo Score", haloshot: true, competitor: false },
      { feature: "Starting Price", haloshot: "Free", competitor: "$29" },
      { feature: "Generation Time", haloshot: "60 seconds", competitor: "2 hours" },
      { feature: "Identity Accuracy", haloshot: "98%", competitor: "85%" },
      { feature: "Psychology-backed analysis", haloshot: true, competitor: false },
      { feature: "Unlimited Refreshes", haloshot: true, competitor: false },
      { feature: "Mobile App", haloshot: true, competitor: false },
      { feature: "Money-back Guarantee", haloshot: true, competitor: true },
      { feature: "Team Plans", haloshot: true, competitor: true },
      { feature: "API Access", haloshot: true, competitor: false },
    ],
    differentiators: [
      { title: "They make headshots. We make first impressions.", description: "HeadshotPro gives you a photo and hopes you like it. HaloShot scores your current photo, shows you what\u2019s wrong, and generates one that\u2019s measurably better. That\u2019s not a feature gap. That\u2019s a category gap." },
      { title: "2 hours is a long time to wonder.", description: "HeadshotPro takes up to 2 hours. That\u2019s long enough to forget you ordered it. HaloShot delivers in 60 seconds. Because your time has a Halo Score too." },
      { title: "Free honesty. Paid glow-up.", description: "Score your photo for free. See where you actually stand. Then decide if you want the fix. HeadshotPro charges $29 before you see a single result." },
    ],
  },
  aragon: {
    name: "Aragon AI",
    slug: "aragon",
    tagline: "Aragon AI takes 90 minutes and $39. HaloShot takes 60 seconds and $0 to show you the truth.",
    haloshotAdvantages: [
      "Your Halo Score: the feedback Aragon can\u2019t give you",
      "60 seconds vs. 90 minutes. Your lunch break thanks you.",
      "Free tier vs. $39 starting price. Try before you buy.",
      "98% identity accuracy vs. 82%. You should look like you.",
      "Warmth + Competence breakdown on every photo.",
    ],
    comparison: [
      { feature: "Halo Score", haloshot: true, competitor: false },
      { feature: "Starting Price", haloshot: "Free", competitor: "$39" },
      { feature: "Generation Time", haloshot: "60 seconds", competitor: "90 minutes" },
      { feature: "Identity Accuracy", haloshot: "98%", competitor: "82%" },
      { feature: "Psychology-backed analysis", haloshot: true, competitor: false },
      { feature: "Unlimited Refreshes", haloshot: true, competitor: false },
      { feature: "Mobile App", haloshot: true, competitor: false },
      { feature: "Money-back Guarantee", haloshot: true, competitor: false },
      { feature: "Team Plans", haloshot: true, competitor: true },
      { feature: "Commercial License", haloshot: true, competitor: true },
    ],
    differentiators: [
      { title: "82% accuracy means it looks like your sibling.", description: "Aragon\u2019s identity accuracy is the kind of number that sounds fine until you see the result. HaloShot\u2019s 98% means it looks like the you that showed up today." },
      { title: "90 minutes of hope isn\u2019t a product.", description: "You submit your photos, you wait, you wonder. With HaloShot, you know in 60 seconds. No anxiety. No refreshing your inbox." },
      { title: "$39 for a gamble. $0 for certainty.", description: "Aragon charges $39 for a fixed pack. HaloShot scores your photo for free and lets you decide. We earn your money. They require it upfront." },
    ],
  },
  betterpic: {
    name: "BetterPic",
    slug: "betterpic",
    tagline: "BetterPic is a fine name for a tool that doesn\u2019t tell you how much better your pic actually got.",
    haloshotAdvantages: [
      "Your Halo Score: measurable improvement, not guesswork",
      "60 seconds vs. 1 hour. Do the math.",
      "Free tier vs. $25 starting price",
      "98% identity accuracy vs. 80%. The gap is visible.",
      "Psychology-backed warmth and competence analysis",
    ],
    comparison: [
      { feature: "Halo Score", haloshot: true, competitor: false },
      { feature: "Starting Price", haloshot: "Free", competitor: "$25" },
      { feature: "Generation Time", haloshot: "60 seconds", competitor: "1 hour" },
      { feature: "Identity Accuracy", haloshot: "98%", competitor: "80%" },
      { feature: "Psychology-backed analysis", haloshot: true, competitor: false },
      { feature: "Unlimited Refreshes", haloshot: true, competitor: false },
      { feature: "Mobile App", haloshot: true, competitor: false },
      { feature: "Money-back Guarantee", haloshot: true, competitor: true },
      { feature: "Team Plans", haloshot: true, competitor: false },
      { feature: "HD Resolution (2048px)", haloshot: true, competitor: false },
    ],
    differentiators: [
      { title: "80% accuracy is 20% someone else.", description: "BetterPic has the lowest identity accuracy in the category. One in five details is wrong. HaloShot\u2019s 98% means two things are off, not twenty." },
      { title: "Better than what?", description: "BetterPic doesn\u2019t score your before or after. You have no way to know how much better your pic actually got. HaloShot shows you the delta. Numbers don\u2019t lie." },
      { title: "Teams need this too.", description: "BetterPic is individuals only. HaloShot offers team plans with admin dashboards, consistent styling, and the ability to score your entire team page at once." },
    ],
  },
};

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="h-5 w-5 text-lime-400" />;
  if (value === false) return <X className="h-5 w-5 text-white/20" />;
  return <span className="text-sm">{value}</span>;
}

export default function CompetitorPage({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor: slug } = use(params);
  const data = competitors[slug];

  if (!data) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden pb-12 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
          >
            HaloShot vs{" "}
            <span className="text-muted-foreground">{data.name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            {data.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Link
              href="/score"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-halo-500 px-8 text-base font-semibold text-gray-900 transition-all hover:bg-halo-400"
            >
              Score your photo free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Key advantages */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-display text-2xl font-bold">
          Why people switch to HaloShot
        </h2>
        <ul className="space-y-3">
          {data.haloshotAdvantages.map((adv) => (
            <li key={adv} className="flex items-start gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-lime-400" />
              <span className="text-muted-foreground">{adv}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Comparison table */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          Feature-by-feature. No spin.
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[400px] border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-4 text-left text-sm font-medium text-muted-foreground">Feature</th>
                <th className="pb-4 text-center text-sm font-semibold text-halo-400">HaloShot</th>
                <th className="pb-4 text-center text-sm font-medium text-muted-foreground">{data.name}</th>
              </tr>
            </thead>
            <tbody>
              {data.comparison.map((row, i) => (
                <tr
                  key={row.feature}
                  className={cn("border-b border-white/5", i % 2 === 0 && "bg-white/[0.01]")}
                >
                  <td className="py-3.5 pr-4 text-sm font-medium">{row.feature}</td>
                  <td className="py-3.5 text-center bg-violet-600/5">
                    <div className="flex justify-center">
                      <CellValue value={row.haloshot} />
                    </div>
                  </td>
                  <td className="py-3.5 text-center">
                    <div className="flex justify-center">
                      <CellValue value={row.competitor} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* Differentiators */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {data.differentiators.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
            >
              <h3 className="font-display text-lg font-semibold">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {d.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
