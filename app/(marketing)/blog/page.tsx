"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const posts = [
  {
    slug: "what-your-linkedin-photo-is-really-saying",
    title: "What Your LinkedIn Photo Is Really Saying About You: We Scored 100 Profiles",
    excerpt: "We scored 100 real LinkedIn headshots. The average Halo Score was 43. Here\u2019s what separates the top scorers from everyone else \u2014 and the century-old psychology behind it.",
    category: "LinkedIn",
    date: "Apr 8, 2026",
    readTime: "7 min read",
    gradient: "from-halo-500/30 to-amber-600/20",
  },
  {
    slug: "best-linkedin-headshot-tips-2026",
    title: "The Complete Guide to LinkedIn Headshots in 2026",
    excerpt: "Everything you need to know about getting a professional LinkedIn photo that actually gets results.",
    category: "LinkedIn",
    date: "Mar 28, 2026",
    readTime: "8 min read",
    gradient: "from-blue-600/30 to-cyan-600/20",
  },
  {
    slug: "ai-headshots-vs-photographer",
    title: "AI Headshots vs. Professional Photographer: An Honest Comparison",
    excerpt: "We put AI-generated headshots side by side with studio shots. Here's what we found.",
    category: "Comparison",
    date: "Mar 21, 2026",
    readTime: "6 min read",
    gradient: "from-violet-600/30 to-purple-600/20",
  },
  {
    slug: "team-headshots-remote-company",
    title: "How to Get Consistent Team Headshots for a Remote Company",
    excerpt: "Your team is spread across 5 time zones. Here's how to get matching headshots without flying everyone to one location.",
    category: "Teams",
    date: "Mar 14, 2026",
    readTime: "5 min read",
    gradient: "from-emerald-600/30 to-teal-600/20",
  },
  {
    slug: "dating-profile-photo-guide",
    title: "The Science of Dating Profile Photos: What Actually Gets Matches",
    excerpt: "Research-backed tips for choosing the right photo for Hinge, Bumble, and Tinder.",
    category: "Dating",
    date: "Mar 7, 2026",
    readTime: "7 min read",
    gradient: "from-rose-600/30 to-pink-600/20",
  },
  {
    slug: "real-estate-headshot-roi",
    title: "Why Your Real Estate Headshot Is Costing You Listings",
    excerpt: "The data behind agent headshots and how upgrading yours can directly impact your bottom line.",
    category: "Real Estate",
    date: "Feb 28, 2026",
    readTime: "5 min read",
    gradient: "from-amber-600/30 to-orange-600/20",
  },
  {
    slug: "how-ai-headshots-work",
    title: "How AI Headshots Actually Work (Without the Hype)",
    excerpt: "A plain-English explanation of the technology behind AI headshot generation and why quality varies so much.",
    category: "Technology",
    date: "Feb 21, 2026",
    readTime: "10 min read",
    gradient: "from-cyan-600/30 to-blue-600/20",
  },
];

export default function BlogPage() {
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
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Tips, guides, and insights on professional headshots and personal branding.
          </motion.p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/10 hover:bg-white/[0.04]"
              >
                {/* Cover image placeholder */}
                <div
                  className={cn(
                    "aspect-[16/9] bg-gradient-to-br",
                    post.gradient
                  )}
                />

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="secondary" className="text-[11px]">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-semibold leading-snug group-hover:text-violet-400 transition-colors">
                    {post.title}
                  </h2>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <p className="mt-4 text-xs text-muted-foreground">
                    {post.date}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
