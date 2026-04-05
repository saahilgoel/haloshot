"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type CellValue = "yes" | "no" | "partial" | string;

interface ComparisonRow {
  feature: string;
  haloshot: CellValue;
  headshotpro: CellValue;
  aragon: CellValue;
  photographer: CellValue;
}

const rows: ComparisonRow[] = [
  {
    feature: "Your Halo Score",
    haloshot: "yes",
    headshotpro: "no",
    aragon: "no",
    photographer: "no",
  },
  {
    feature: "Price",
    haloshot: "Free / $9.99",
    headshotpro: "$29",
    aragon: "$39",
    photographer: "$200-500",
  },
  {
    feature: "Speed",
    haloshot: "60 seconds",
    headshotpro: "2 hours",
    aragon: "90 min",
    photographer: "1-2 weeks",
  },
  {
    feature: "Psychology-backed scoring",
    haloshot: "yes",
    headshotpro: "no",
    aragon: "no",
    photographer: "no",
  },
  {
    feature: "Unlimited do-overs",
    haloshot: "yes",
    headshotpro: "no",
    aragon: "no",
    photographer: "no",
  },
  {
    feature: "Identity accuracy",
    haloshot: "98%",
    headshotpro: "85%",
    aragon: "82%",
    photographer: "100%",
  },
  {
    feature: "Money-back guarantee",
    haloshot: "yes",
    headshotpro: "yes",
    aragon: "partial",
    photographer: "no",
  },
  {
    feature: "Mobile app",
    haloshot: "yes",
    headshotpro: "no",
    aragon: "no",
    photographer: "no",
  },
];

const competitors = [
  { key: "haloshot" as const, label: "HaloShot", subtitle: "The glow-up", highlighted: true },
  { key: "headshotpro" as const, label: "HeadshotPro", subtitle: "The wait", highlighted: false },
  { key: "aragon" as const, label: "Aragon", subtitle: "The gamble", highlighted: false },
  { key: "photographer" as const, label: "Photographer", subtitle: "The hassle", highlighted: false },
];

function CellContent({ value }: { value: CellValue }) {
  if (value === "yes") return <Check className="h-5 w-5 text-lime-400" />;
  if (value === "no") return <X className="h-5 w-5 text-white/20" />;
  if (value === "partial") return <Minus className="h-5 w-5 text-amber-400" />;
  return <span className="text-sm">{value}</span>;
}

export function ComparisonTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto"
    >
      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr>
            <th className="pb-4 pr-4 text-left text-sm font-medium text-muted-foreground">
              Feature
            </th>
            {competitors.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "pb-4 text-center text-sm",
                  c.highlighted ? "text-halo-400" : "text-muted-foreground"
                )}
              >
                {c.highlighted && (
                  <div className="mb-2 mx-auto w-fit rounded-full bg-halo-500/15 px-3 py-0.5 text-xs font-medium text-halo-300">
                    You&apos;re here for this
                  </div>
                )}
                <span className="font-semibold">{c.label}</span>
                <div className="text-xs font-normal text-muted-foreground mt-0.5">{c.subtitle}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.feature}
              className={cn(
                "border-t border-white/5",
                i % 2 === 0 && "bg-white/[0.01]",
                i === 0 && "bg-halo-500/[0.03]"
              )}
            >
              <td className={cn(
                "py-4 pr-4 text-sm font-medium",
                i === 0 && "text-halo-400"
              )}>
                {row.feature}
              </td>
              {competitors.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "py-4 text-center",
                    c.highlighted && "bg-violet-600/5"
                  )}
                >
                  <div className="flex items-center justify-center">
                    <CellContent value={row[c.key]} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
