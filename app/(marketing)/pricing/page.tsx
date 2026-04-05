"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingTable } from "@/components/marketing/PricingTable";
import { CTABanner } from "@/components/marketing/CTABanner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const featureMatrix = [
  { feature: "AI headshots / month", free: "3", pro: "100", team: "Unlimited" },
  { feature: "Style presets", free: "1", pro: "All 30+", team: "All 30+ + custom" },
  { feature: "Resolution", free: "1024px", pro: "2048px", team: "2048px" },
  { feature: "Watermark-free", free: false, pro: true, team: true },
  { feature: "Background removal", free: false, pro: true, team: true },
  { feature: "Commercial license", free: false, pro: true, team: true },
  { feature: "Priority generation", free: false, pro: true, team: true },
  { feature: "Batch processing", free: false, pro: false, team: true },
  { feature: "Team admin dashboard", free: false, pro: false, team: true },
  { feature: "SSO / SAML", free: false, pro: false, team: true },
  { feature: "Custom brand styles", free: false, pro: false, team: true },
  { feature: "API access", free: false, pro: false, team: true },
  { feature: "Dedicated support", free: false, pro: false, team: true },
];

const pricingFaqs = [
  {
    q: "Can I try HaloShot before paying?",
    a: "Absolutely. The free tier gives you 3 AI headshots with no credit card required. Try it out and upgrade when you&apos;re ready.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal. Team plans can also pay via invoice.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel your subscription at any time from your dashboard. You'll keep access until the end of your current billing period.",
  },
  {
    q: "What's the refund policy?",
    a: "We offer a full refund within 7 days of your first paid subscription if you&apos;re not satisfied with the quality of your headshots.",
  },
  {
    q: "How does team pricing work?",
    a: "Team pricing is $7.99/person/month (or $5.33/person/month billed annually). Minimum 5 seats. Each team member gets unlimited headshots and all style presets.",
  },
  {
    q: "Do you offer enterprise pricing?",
    a: "Yes. For teams of 50+ or custom requirements (API access, custom model training, on-prem), contact our sales team for a custom quote.",
  },
];

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="h-4 w-4 text-lime-400" />;
  if (value === false) return <X className="h-4 w-4 text-white/20" />;
  return <span className="text-sm">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden pb-8 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Start free. Upgrade when you need more. No hidden fees.
          </motion.p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PricingTable />
      </section>

      {/* Feature comparison matrix */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center font-display text-2xl font-bold sm:text-3xl"
        >
          Detailed feature comparison
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-4 text-left text-sm font-medium text-muted-foreground">
                  Feature
                </th>
                <th className="pb-4 text-center text-sm font-medium text-muted-foreground">Free</th>
                <th className="pb-4 text-center text-sm font-semibold text-violet-400">Pro</th>
                <th className="pb-4 text-center text-sm font-medium text-muted-foreground">Team</th>
              </tr>
            </thead>
            <tbody>
              {featureMatrix.map((row, i) => (
                <tr
                  key={row.feature}
                  className={cn(
                    "border-b border-white/5",
                    i % 2 === 0 && "bg-white/[0.01]"
                  )}
                >
                  <td className="py-3.5 pr-4 text-sm">{row.feature}</td>
                  <td className="py-3.5 text-center">
                    <div className="flex justify-center">
                      <CellValue value={row.free} />
                    </div>
                  </td>
                  <td className="py-3.5 text-center bg-violet-600/5">
                    <div className="flex justify-center">
                      <CellValue value={row.pro} />
                    </div>
                  </td>
                  <td className="py-3.5 text-center">
                    <div className="flex justify-center">
                      <CellValue value={row.team} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* Enterprise */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center sm:p-12"
        >
          <h3 className="font-display text-2xl font-bold">Need a custom plan?</h3>
          <p className="mt-3 text-muted-foreground">
            For enterprises with 50+ team members, custom model training, API
            access, or on-premise deployment, we offer tailored solutions.
          </p>
          <a
            href="mailto:sales@haloshot.ai"
            className="mt-6 inline-flex h-11 items-center rounded-xl border border-white/15 bg-white/5 px-8 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            Talk to Sales
          </a>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          Pricing FAQ
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {pricingFaqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-white/[0.06]">
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <CTABanner />
    </>
  );
}
