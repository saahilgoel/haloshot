"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Camera,
  Crosshair,
  Download,
  ArrowRight,
  Briefcase,
  Heart,
  Users,
  Building2,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Hero } from "@/components/marketing/Hero";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { Testimonials } from "@/components/marketing/Testimonials";
import { PricingTable } from "@/components/marketing/PricingTable";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { CTABanner } from "@/components/marketing/CTABanner";

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */
function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8", className)}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  tag,
  title,
  description,
}: {
  tag?: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto mb-14 max-w-2xl text-center"
    >
      {tag && (
        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-halo-400">
          {tag}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  The Science Section                                                */
/* ------------------------------------------------------------------ */
const scienceStats = [
  { value: "1920", label: "Thorndike discovers the halo effect" },
  { value: "3", label: "Perception dimensions scored" },
  { value: "+38", label: "Average glow-up score improvement" },
  { value: "98%", label: "Identity accuracy preserved" },
];

function ScienceSection() {
  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-10 max-w-2xl text-center text-lg text-muted-foreground"
      >
        In 1920, Edward Thorndike proved that attractive people are assumed to be smarter,
        kinder, and more competent. Willis &amp; Todorov (2006) showed it takes just 100
        milliseconds. Your photo is being judged before anyone reads a single word you wrote.
      </motion.p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {scienceStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
          >
            <p className="font-display text-3xl font-bold text-halo-400 sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */
const steps = [
  {
    icon: Camera,
    title: "Upload a selfie. We\u2019ll be honest.",
    description:
      "Any photo works. We analyze it for warmth, competence, and trustworthiness. You get your real Halo Score. No sugarcoating.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Crosshair,
    title: "Pick your first impression.",
    description:
      "Authoritative exec? Approachable creative? Trustworthy advisor? Choose the perception you want to project.",
    gradient: "from-purple-500 to-halo-600",
  },
  {
    icon: Download,
    title: "Meet the version of you that gets the callback.",
    description:
      "Studio-quality headshot in 60 seconds. Same face, better halo. Download, share, replace that old photo immediately.",
    gradient: "from-halo-500 to-lime-400",
  },
];

function HowItWorks() {
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      {steps.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          className="relative text-center"
        >
          {i < 2 && (
            <div className="pointer-events-none absolute left-[60%] top-10 hidden h-px w-[80%] bg-gradient-to-r from-white/10 to-transparent sm:block" />
          )}

          <div
            className={cn(
              "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br",
              step.gradient
            )}
          >
            <step.icon className="h-7 w-7 text-white" />
          </div>

          <div className="mx-auto mb-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-muted-foreground">
            {i + 1}
          </div>

          <h3 className="font-display text-lg font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Use Cases                                                          */
/* ------------------------------------------------------------------ */
const useCases = [
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: Briefcase,
    headline: "Recruiters decide in 100ms. Make those milliseconds count.",
    description:
      "Profiles with professional headshots get 21x more views. Your selfie from 2019 is costing you interviews. Your Halo Score tells you exactly how much.",
    cta: "Score your LinkedIn photo",
    href: "/for/linkedin",
  },
  {
    value: "dating",
    label: "Dating",
    icon: Heart,
    headline: "The photo that makes them swipe right AND message first.",
    description:
      "Dating app algorithms surface profiles with better photos. Higher warmth scores mean more matches. Higher competence scores mean more first messages. We optimize for both.",
    cta: "Score your dating photo",
    href: "/for/dating",
  },
  {
    value: "teams",
    label: "Teams",
    icon: Users,
    headline: "Your team page looks like a hostage situation.",
    description:
      "Mismatched lighting. Different decades. One person clearly in their car. Get your entire team to a consistent Halo Score in one afternoon.",
    cta: "Fix the team page",
    href: "/for/teams",
  },
  {
    value: "realestate",
    label: "Real Estate",
    icon: Building2,
    headline: "Clients pick agents they trust on sight.",
    description:
      "In real estate, your face IS your brand. A high trustworthiness score on your headshot means more listing appointments. The math is simple.",
    cta: "Score your agent headshot",
    href: "/for/real-estate",
  },
  {
    value: "social",
    label: "Social Media",
    icon: Share2,
    headline: "Every platform. One face. Maximum impact.",
    description:
      "From Twitter/X to Instagram to your podcast cover. Get headshots scored and optimized for the first impression each platform demands.",
    cta: "Score your social photos",
    href: "/score",
  },
];

function UseCaseTabs() {
  return (
    <Tabs defaultValue="linkedin" className="w-full">
      <TabsList className="mx-auto mb-8 flex h-auto w-full max-w-2xl flex-wrap justify-center gap-1 bg-transparent p-0">
        {useCases.map((uc) => (
          <TabsTrigger
            key={uc.value}
            value={uc.value}
            className="gap-2 rounded-lg border border-transparent px-4 py-2.5 data-[state=active]:border-halo-500/50 data-[state=active]:bg-halo-600/10 data-[state=active]:text-halo-300 data-[state=active]:shadow-none"
          >
            <uc.icon className="h-4 w-4" />
            {uc.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {useCases.map((uc) => (
        <TabsContent key={uc.value} value={uc.value}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2"
          >
            <div>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">
                {uc.headline}
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {uc.description}
              </p>
              <Link
                href={uc.href}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-halo-400 transition-colors hover:text-halo-300"
              >
                {uc.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-violet-600/20 via-halo-500/10 to-transparent border border-white/[0.06] flex items-center justify-center">
              <uc.icon className="h-16 w-16 text-halo-400/40" />
            </div>
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    q: "Will it look like me?",
    a: "Yes. That\u2019s the whole point. Our model achieves 98% identity accuracy. It\u2019s you \u2014 same bone structure, same features, same face. Just with better lighting, framing, and the subtle adjustments that push your Halo Score up. If it doesn\u2019t look like you, we refund you. No questions.",
  },
  {
    q: "Is the Halo Score real science?",
    a: "The halo effect was first documented by Edward Thorndike in 1920. Willis & Todorov (2006) proved first impressions form in 100 milliseconds. Our scoring model is trained on the warmth-competence framework from Fiske et al. (2007). Every dimension we measure has decades of peer-reviewed research behind it. This isn\u2019t vibes. It\u2019s data.",
  },
  {
    q: "Can I cancel?",
    a: "Anytime. From your dashboard. Takes 10 seconds. You keep access until the end of your billing period. No guilt trips, no retention flows, no \u201Care you sure?\u201D popups. We\u2019d rather you come back later than resent us now.",
  },
  {
    q: "What about privacy?",
    a: "Your photos are encrypted with AES-256 and automatically deleted after 30 days. We never use your photos to train our models. Never share them. Never sell them. You can manually delete everything at any time. What happens in HaloShot stays in HaloShot.",
  },
  {
    q: "How is this different from other AI headshot tools?",
    a: "Three things. (1) The Halo Score: no one else tells you WHERE your photo stands before and after. (2) Speed: 60 seconds, not 2 hours. (3) Psychology: we don\u2019t just make you \u201Clook better\u201D \u2014 we optimize for the specific perception dimensions (warmth, competence, trustworthiness) that drive real-world outcomes.",
  },
  {
    q: "What if I don\u2019t like the results?",
    a: "Generate as many variations as your plan allows until you\u2019re satisfied. Pro users get 100 headshots/month. If you\u2019re still not happy, we offer a full refund within 7 days. But honestly? Most people are obsessed after the first one.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function MarketingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <Hero />

      {/* Trust Badges */}
      <Section>
        <TrustBadges />
      </Section>

      {/* The Science Section */}
      <Section id="science">
        <SectionHeader
          tag="The Science"
          title="The halo effect is real."
          description="Attractive people are assumed to be smarter, kinder, and more competent. It\u2019s not fair. But it\u2019s measurable. And now it\u2019s hackable."
        />
        <ScienceSection />
      </Section>

      {/* Glow-Up Gallery (Before / After) */}
      <Section id="examples">
        <SectionHeader
          tag="Glow-Up Gallery"
          title="Before and after, scored."
          description="Real selfies in. Halo-optimized headshots out. Hover to see the glow-up."
        />
        <BeforeAfter />
      </Section>

      {/* How It Works */}
      <Section>
        <SectionHeader
          tag="How It Works"
          title="Three steps. Sixty seconds. A better first impression."
        />
        <HowItWorks />
      </Section>

      {/* Social Proof */}
      <Section>
        <SectionHeader
          tag="Proof"
          title="The numbers speak."
          description="Thousands of photos scored. Real improvements measured."
        />
        <Testimonials />
      </Section>

      {/* Use Cases */}
      <Section>
        <SectionHeader
          tag="Use Cases"
          title="Where your Halo Score matters most"
          description="Every platform where a photo precedes a conversation."
        />
        <UseCaseTabs />
      </Section>

      {/* Comparison */}
      <Section>
        <SectionHeader
          tag="Compare"
          title="How HaloShot stacks up"
          description="Spoiler: we\u2019re the only ones who tell you your score."
        />
        <ComparisonTable />
      </Section>

      {/* Pricing */}
      <Section id="pricing">
        <SectionHeader
          tag="Pricing"
          title="Honest pricing for honest feedback"
          description="Start free with a reality check. Upgrade when you\u2019re ready for the glow-up."
        />
        <PricingTable />
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader
          tag="FAQ"
          title="Questions we actually get asked"
        />
        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
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
        </div>
      </Section>

      {/* Final CTA */}
      <CTABanner />
    </>
  );
}
