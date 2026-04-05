"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Camera,
  Palette,
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
        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-violet-400">
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
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */
const steps = [
  {
    icon: Camera,
    title: "Upload 1-3 selfies",
    description:
      "Any recent photos work. Front-facing, good lighting, different angles for best results.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Palette,
    title: "Choose your style",
    description:
      "Pick from 30+ professional presets: Corporate, Creative, LinkedIn, Casual, and more.",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Download,
    title: "Download in 60 seconds",
    description:
      "Get studio-quality headshots in HD. Download, share, or use directly on LinkedIn.",
    gradient: "from-pink-500 to-lime-400",
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
          {/* Connector line (hidden on mobile, first two only) */}
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

          {/* Step number */}
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
    headline: "Stand out in every recruiter's inbox",
    description:
      "Profiles with professional headshots get 14x more views. Get a polished, corporate-friendly photo that makes you look approachable and competent.",
    cta: "Get Your LinkedIn Headshot",
    href: "/for/linkedin",
  },
  {
    value: "dating",
    label: "Dating",
    icon: Heart,
    headline: "First impressions that get more matches",
    description:
      "Dating profiles with high-quality photos get 3x more matches. Get natural, flattering headshots that show the real you without the awkward selfie vibes.",
    cta: "Upgrade Your Dating Profile",
    href: "/for/dating",
  },
  {
    value: "teams",
    label: "Teams",
    icon: Users,
    headline: "Consistent team photos in minutes, not months",
    description:
      "Get your entire team looking cohesive with matching style headshots. No more scheduling headaches. Onboard new hires with a headshot on day one.",
    cta: "Get Team Headshots",
    href: "/for/teams",
  },
  {
    value: "realestate",
    label: "Real Estate",
    icon: Building2,
    headline: "The agent headshot that wins listings",
    description:
      "In real estate, your face IS your brand. Get a trustworthy, professional headshot for your business cards, signs, and MLS listings.",
    cta: "Get Your Agent Headshot",
    href: "/for/real-estate",
  },
  {
    value: "social",
    label: "Social Media",
    icon: Share2,
    headline: "Content-ready headshots for every platform",
    description:
      "From Twitter/X to Instagram to your podcast cover. Get headshots optimized for social media that make your brand memorable.",
    cta: "Create Social Headshots",
    href: "/signup",
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
            className="gap-2 rounded-lg border border-transparent px-4 py-2.5 data-[state=active]:border-violet-500/50 data-[state=active]:bg-violet-600/10 data-[state=active]:text-violet-300 data-[state=active]:shadow-none"
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
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-lime-400 transition-colors hover:text-lime-300"
              >
                {uc.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Visual placeholder */}
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-violet-600/20 via-purple-500/10 to-transparent border border-white/[0.06] flex items-center justify-center">
              <uc.icon className="h-16 w-16 text-violet-400/40" />
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
    q: "How does HaloShot work?",
    a: "Upload 1-3 selfies, choose a professional style preset, and our AI model generates studio-quality headshots in about 60 seconds. The AI is specifically trained to preserve your unique facial features and identity.",
  },
  {
    q: "Will the headshot actually look like me?",
    a: "Yes, that&apos;s our core differentiator. Our latest model achieves 98% identity accuracy. Unlike other tools that produce generic-looking results, HaloShot is obsessive about likeness. If you&apos;re not happy, we offer a full refund.",
  },
  {
    q: "What happens to my photos after generation?",
    a: "Your uploaded selfies and generated headshots are encrypted (AES-256) and automatically deleted after 30 days. We never use your photos to train our models. You can also manually delete them at any time from your dashboard.",
  },
  {
    q: "Can I use these headshots commercially?",
    a: "Pro and Team plans include a full commercial license. Use your headshots on LinkedIn, company websites, business cards, real estate listings, or anywhere else you need a professional photo.",
  },
  {
    q: "How is this different from other AI headshot tools?",
    a: "Three key differences: (1) Speed: 60 seconds vs. 1-2 hours, (2) Likeness: 98% identity accuracy vs. industry average of ~82%, (3) Price: free tier available and Pro at $9.99/mo vs. $25-39 one-time for limited results.",
  },
  {
    q: "What if I don&apos;t like the results?",
    a: "Generate as many variations as your plan allows until you&apos;re happy. Pro users get 100 headshots/month and unlimited style presets. If you&apos;re still not satisfied, we offer a full money-back guarantee within 7 days.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function MarketingPage() {
  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Trust Badges */}
      <Section>
        <TrustBadges />
      </Section>

      {/* Before / After */}
      <Section id="examples">
        <SectionHeader
          tag="Results"
          title="See the transformation"
          description="Real selfies in, professional headshots out. Hover to see the magic."
        />
        <BeforeAfter />
      </Section>

      {/* How It Works */}
      <Section>
        <SectionHeader
          tag="Simple"
          title="How it works"
          description="Three steps. Sixty seconds. Studio-quality headshots."
        />
        <HowItWorks />
      </Section>

      {/* Social Proof */}
      <Section>
        <SectionHeader
          tag="Testimonials"
          title="Loved by professionals everywhere"
          description="Don't take our word for it. Here's what our users say."
        />
        <Testimonials />
      </Section>

      {/* Use Cases */}
      <Section>
        <SectionHeader
          tag="Use Cases"
          title="Perfect headshots for every occasion"
          description="Whether it&apos;s a job search, a dating profile, or a team page, HaloShot has you covered."
        />
        <UseCaseTabs />
      </Section>

      {/* Comparison */}
      <Section>
        <SectionHeader
          tag="Compare"
          title="How HaloShot stacks up"
          description="We built HaloShot to be faster, cheaper, and more accurate than every alternative."
        />
        <ComparisonTable />
      </Section>

      {/* Pricing */}
      <Section id="pricing">
        <SectionHeader
          tag="Pricing"
          title="Simple, transparent pricing"
          description="Start free. Upgrade when you need more. Cancel anytime."
        />
        <PricingTable />
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader
          tag="FAQ"
          title="Frequently asked questions"
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
