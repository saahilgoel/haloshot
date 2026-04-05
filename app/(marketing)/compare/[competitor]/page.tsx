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
    tagline: "HeadshotPro is good. HaloShot is faster, cheaper, and more accurate.",
    haloshotAdvantages: [
      "60 seconds vs. 2 hours wait time",
      "Free tier available (HeadshotPro starts at $29)",
      "98% identity accuracy vs. 85%",
      "Unlimited monthly refreshes on Pro",
      "Mobile app for on-the-go generation",
    ],
    comparison: [
      { feature: "Starting Price", haloshot: "Free", competitor: "$29" },
      { feature: "Generation Time", haloshot: "60 seconds", competitor: "2 hours" },
      { feature: "Identity Accuracy", haloshot: "98%", competitor: "85%" },
      { feature: "Style Presets", haloshot: "30+", competitor: "15" },
      { feature: "Mobile App", haloshot: true, competitor: false },
      { feature: "Unlimited Refreshes", haloshot: true, competitor: false },
      { feature: "Background Removal", haloshot: true, competitor: true },
      { feature: "Money-back Guarantee", haloshot: true, competitor: true },
      { feature: "Team Plans", haloshot: true, competitor: true },
      { feature: "API Access", haloshot: true, competitor: false },
    ],
    differentiators: [
      { title: "Speed that respects your time", description: "HeadshotPro takes up to 2 hours. HaloShot delivers in 60 seconds. Because waiting for a photo shouldn&apos;t feel like waiting at the DMV." },
      { title: "A face that&apos;s actually yours", description: "Our latest model preserves 98% of your unique facial features. HeadshotPro&apos;s results often look like a similar but different person." },
      { title: "Free to start", description: "Try 3 headshots completely free. HeadshotPro charges $29 before you see a single result." },
    ],
  },
  aragon: {
    name: "Aragon AI",
    slug: "aragon",
    tagline: "Aragon AI takes 90 minutes and $39. HaloShot takes 60 seconds and $0 to start.",
    haloshotAdvantages: [
      "60 seconds vs. 90 minutes generation",
      "Free tier vs. $39 starting price",
      "98% identity accuracy vs. 82%",
      "30+ style presets vs. 10",
      "Mobile-native experience",
    ],
    comparison: [
      { feature: "Starting Price", haloshot: "Free", competitor: "$39" },
      { feature: "Generation Time", haloshot: "60 seconds", competitor: "90 minutes" },
      { feature: "Identity Accuracy", haloshot: "98%", competitor: "82%" },
      { feature: "Style Presets", haloshot: "30+", competitor: "10" },
      { feature: "Mobile App", haloshot: true, competitor: false },
      { feature: "Unlimited Refreshes", haloshot: true, competitor: false },
      { feature: "Background Removal", haloshot: true, competitor: true },
      { feature: "Money-back Guarantee", haloshot: true, competitor: false },
      { feature: "Team Plans", haloshot: true, competitor: true },
      { feature: "Commercial License", haloshot: true, competitor: true },
    ],
    differentiators: [
      { title: "Price that makes sense", description: "Aragon charges $39 for a fixed pack of headshots. HaloShot lets you start free and only pay $9.99/mo for 100 headshots." },
      { title: "Real likeness, not a lookalike", description: "Aragon's 82% accuracy means your headshot might look like your cousin. HaloShot's 98% means it looks like you." },
      { title: "No wait, no frustration", description: "90 minutes is a long time to wonder if your money was well spent. With HaloShot, you know in 60 seconds." },
    ],
  },
  betterpic: {
    name: "BetterPic",
    slug: "betterpic",
    tagline: "BetterPic is decent for the price. HaloShot is better in every way that matters.",
    haloshotAdvantages: [
      "60 seconds vs. 1 hour generation",
      "Free tier vs. $25 starting price",
      "98% identity accuracy vs. 80%",
      "Unlimited monthly refreshes on Pro",
      "Mobile-first experience",
    ],
    comparison: [
      { feature: "Starting Price", haloshot: "Free", competitor: "$25" },
      { feature: "Generation Time", haloshot: "60 seconds", competitor: "1 hour" },
      { feature: "Identity Accuracy", haloshot: "98%", competitor: "80%" },
      { feature: "Style Presets", haloshot: "30+", competitor: "12" },
      { feature: "Mobile App", haloshot: true, competitor: false },
      { feature: "Unlimited Refreshes", haloshot: true, competitor: false },
      { feature: "Background Removal", haloshot: true, competitor: true },
      { feature: "Money-back Guarantee", haloshot: true, competitor: true },
      { feature: "Team Plans", haloshot: true, competitor: false },
      { feature: "HD Resolution (2048px)", haloshot: true, competitor: false },
    ],
    differentiators: [
      { title: "Quality gap is real", description: "BetterPic's 80% accuracy is the lowest among AI headshot tools. HaloShot's 98% is the highest. The difference is immediately visible." },
      { title: "Speed matters", description: "An hour is too long to wait for headshots. HaloShot generates yours in 60 seconds." },
      { title: "Built for teams too", description: "BetterPic is individual-only. HaloShot offers team plans with admin dashboards, consistent styling, and volume pricing." },
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
              href="/signup"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-lime-400 px-8 text-base font-semibold text-gray-900 transition-all hover:bg-lime-300"
            >
              Try HaloShot Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Key advantages */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-display text-2xl font-bold">
          Why professionals switch to HaloShot
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
          Feature-by-feature comparison
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
                <th className="pb-4 text-center text-sm font-semibold text-lime-400">HaloShot</th>
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
