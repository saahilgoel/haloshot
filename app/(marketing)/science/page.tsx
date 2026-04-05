"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { CTABanner } from "@/components/marketing/CTABanner";

const researchCards = [
  {
    year: "1920",
    author: "Edward Thorndike",
    title: "The halo effect",
    description:
      "Thorndike asked military officers to rate soldiers on intelligence, leadership, and character. Officers who rated a soldier as physically attractive also rated them higher on every other trait. He called it the \u201Chalo effect\u201D \u2014 one positive trait casting a glow over everything else.",
    insight: "Good-looking people are assumed to be good at everything.",
  },
  {
    year: "2006",
    author: "Willis & Todorov",
    title: "100 milliseconds",
    description:
      "Princeton researchers showed participants photos of faces for just 100 milliseconds \u2014 one-tenth of a second. The judgments made in that flash were nearly identical to judgments made with unlimited viewing time. First impressions aren\u2019t just fast. They\u2019re final.",
    insight: "You have 100ms. Not 10 seconds. Not 5. One hundred milliseconds.",
  },
  {
    year: "2002",
    author: "Fiske, Cuddy, Glick & Xu",
    title: "Warmth vs. Competence",
    description:
      "The Stereotype Content Model proved that all social perception falls on two axes: warmth (Do I trust you?) and competence (Do I respect you?). Every face you see gets plotted on this grid instantly. Your photo position on this grid determines whether people want to work with you, date you, or hire you.",
    insight: "Two dimensions drive all first impressions: warmth and competence.",
  },
  {
    year: "2005",
    author: "Todorov, Mandisodza, Goren & Hall",
    title: "Elections and faces",
    description:
      "Researchers showed participants pairs of faces for one second and asked which looked more competent. The face rated more competent won the real election 70% of the time. Voters didn\u2019t know they were looking at actual candidates. Their gut reaction to a face predicted elections better than polls.",
    insight: "Faces predict election outcomes. Imagine what yours predicts on LinkedIn.",
  },
  {
    year: "2014",
    author: "Olivola, Funk & Todorov",
    title: "The financial halo",
    description:
      "CEOs who were rated as more competent-looking earned an average of $80,000 more per year. The effect held even after controlling for actual company performance. Looking competent was literally more profitable than being competent.",
    insight: "Looking the part pays. Literally.",
  },
];

const dimensions = [
  {
    name: "Warmth",
    description: "Approachability, friendliness, trustworthiness. Are you someone people want to be around?",
    factors: ["Eye contact quality", "Smile authenticity", "Facial openness", "Approachable body language"],
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    name: "Competence",
    description: "Intelligence, capability, professionalism. Are you someone people want to follow?",
    factors: ["Jawline definition", "Eye sharpness", "Lighting quality", "Professional framing"],
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    name: "Trustworthiness",
    description: "Honesty, reliability, integrity. Are you someone people want to confide in?",
    factors: ["Facial symmetry", "Expression consistency", "Warmth-competence balance", "Background clarity"],
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

export default function SciencePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-halo-500/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-halo-400/30 bg-halo-400/10 px-4 py-1.5 text-sm font-medium text-halo-300"
          >
            <BookOpen className="h-4 w-4" />
            Peer-reviewed. Not vibes.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            The science of{" "}
            <span className="bg-gradient-to-r from-halo-400 to-halo-300 bg-clip-text text-transparent">
              first impressions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            HaloShot isn&apos;t based on trends or taste. It&apos;s based on 100+ years of
            psychology research into how humans judge faces. Here&apos;s the science we built on.
          </motion.p>
        </div>
      </section>

      {/* The Halo Effect */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-halo-500/20 bg-halo-500/5 p-8 sm:p-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">The halo effect is real.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            When someone finds you attractive, they also assume you&apos;re smarter, more
            trustworthy, more competent, and more likeable. It&apos;s not rational. It&apos;s not fair.
            But it&apos;s been proven in hundreds of studies across cultures, contexts, and decades.
            Your photo triggers it. Or it doesn&apos;t.
          </p>
        </motion.div>
      </section>

      {/* Research Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center font-display text-2xl font-bold sm:text-3xl"
        >
          A century of evidence
        </motion.h2>

        <div className="space-y-8">
          {researchCards.map((card, i) => (
            <motion.div
              key={card.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-full bg-halo-500/15 px-3 py-1 text-sm font-bold text-halo-400 font-mono">
                  {card.year}
                </span>
                <span className="text-sm text-muted-foreground">{card.author}</span>
              </div>
              <h3 className="font-display text-xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              <div className="mt-4 rounded-lg bg-halo-500/5 border border-halo-500/10 px-4 py-3">
                <p className="text-sm font-medium text-halo-400">{card.insight}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Warmth vs Competence */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-center font-display text-2xl font-bold sm:text-3xl"
        >
          How HaloShot scores your photo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground"
        >
          Your Halo Score is a composite of three perception dimensions, each grounded in
          decades of social psychology research. We don&apos;t guess. We measure.
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-3">
          {dimensions.map((dim, i) => (
            <motion.div
              key={dim.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border ${dim.border} ${dim.bg} p-6`}
            >
              <h3 className={`font-display text-xl font-bold ${dim.color}`}>{dim.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{dim.description}</p>
              <ul className="mt-4 space-y-2">
                {dim.factors.map((factor) => (
                  <li key={factor} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={`h-1 w-1 rounded-full ${dim.color.replace("text-", "bg-")}`} />
                    {factor}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How HaloShot uses this */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            From research to your headshot
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            HaloShot&apos;s AI was trained to understand these perception dimensions the way humans do
            \u2014 instinctively, in milliseconds. When we generate your headshot, we&apos;re not just
            making you &ldquo;look good.&rdquo; We&apos;re optimizing the specific visual signals
            that drive warmth, competence, and trustworthiness ratings. Your Halo Score is the
            proof it worked.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-10 text-center"
        >
          <Link
            href="/score"
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-halo-500 px-8 text-base font-semibold text-gray-900 transition-all hover:bg-halo-400 hover:shadow-lg hover:shadow-halo-500/25"
          >
            Score your photo to see the science in action
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </section>

      {/* Sources */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sources
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>Thorndike, E. L. (1920). A constant error in psychological ratings. <em>Journal of Applied Psychology</em>, 4(1), 25-29.</p>
          <p>Willis, J., & Todorov, A. (2006). First impressions: Making up your mind after a 100-ms exposure to a face. <em>Psychological Science</em>, 17(7), 592-598.</p>
          <p>Fiske, S. T., Cuddy, A. J. C., Glick, P., & Xu, J. (2002). A model of (often mixed) stereotype content. <em>Journal of Personality and Social Psychology</em>, 82(6), 878-902.</p>
          <p>Todorov, A., Mandisodza, A. N., Goren, A., & Hall, C. C. (2005). Inferences of competence from faces predict election outcomes. <em>Science</em>, 308(5728), 1623-1626.</p>
          <p>Olivola, C. Y., Funk, F., & Todorov, A. (2014). Social attributions from faces bias human choices. <em>Trends in Cognitive Sciences</em>, 18(11), 566-570.</p>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
