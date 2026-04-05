"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CTABanner } from "@/components/marketing/CTABanner";

interface BlogPost {
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string[];
}

const posts: Record<string, BlogPost> = {
  "best-linkedin-headshot-tips-2026": {
    title: "The Complete Guide to LinkedIn Headshots in 2026",
    category: "LinkedIn",
    date: "Mar 28, 2026",
    readTime: "8 min read",
    author: "HaloShot Team",
    content: [
      "Your LinkedIn headshot is often the first impression you make on recruiters, clients, and colleagues. In 2026, with remote work more common than ever, your digital presence matters more than your physical one.",
      "Research shows that LinkedIn profiles with professional headshots receive 14x more profile views and 36% more messages than those without. Yet most professionals are still using cropped group photos, outdated pictures, or no photo at all.",
      "The ideal LinkedIn headshot follows a few key principles: your face should take up about 60% of the frame, the background should be simple and undistracting, lighting should be soft and even, and your expression should be approachable yet professional.",
      "With AI headshot tools like HaloShot, you can now get a studio-quality LinkedIn headshot in 60 seconds, without ever leaving your desk. Upload a few selfies, choose the 'LinkedIn' or 'Corporate' style preset, and download your new headshot immediately.",
      "The best part? You can generate multiple variations and pick the one that feels most like you. No more settling for whatever the photographer captured in a 15-minute session.",
    ],
  },
  "ai-headshots-vs-photographer": {
    title: "AI Headshots vs. Professional Photographer: An Honest Comparison",
    category: "Comparison",
    date: "Mar 21, 2026",
    readTime: "6 min read",
    author: "HaloShot Team",
    content: [
      "The question isn't whether AI headshots are 'as good as' a photographer anymore. It's whether the difference matters for your specific use case.",
      "A professional photographer still has the edge in certain scenarios: magazine covers, high-end executive portraits for Fortune 500 annual reports, or situations where you need full-body shots with specific wardrobe and locations.",
      "But for the 95% of professionals who need a clean, professional headshot for LinkedIn, their company website, or business cards, AI headshots have crossed the quality threshold. And they offer advantages a photographer can't match: speed (60 seconds vs. 1-2 weeks), cost (free to $9.99/mo vs. $200-500), and convenience (your couch vs. a studio).",
      "The biggest advancement in 2026 is identity accuracy. Early AI headshot tools produced images that looked professional but didn't quite look like you. The latest models, including HaloShot's, achieve 98% identity accuracy, meaning the headshot is unmistakably you.",
      "Our recommendation: use AI headshots for LinkedIn, social media, team pages, and everyday professional branding. Save the photographer for your book cover or that Wall Street Journal feature.",
    ],
  },
};

const defaultPost: BlogPost = {
  title: "Blog Post",
  category: "General",
  date: "2026",
  readTime: "5 min read",
  author: "HaloShot Team",
  content: [
    "This blog post is coming soon. Check back later for the full article.",
    "In the meantime, explore our other posts or try HaloShot to get your professional headshot in 60 seconds.",
  ],
};

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = posts[slug] || { ...defaultPost, title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>

          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 space-y-6"
        >
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Inline CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl border border-violet-500/20 bg-violet-600/5 p-8 text-center"
        >
          <h3 className="font-display text-xl font-bold">
            Ready to get your headshot?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try HaloShot free. 3 headshots, no credit card required.
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-flex h-10 items-center rounded-xl bg-lime-400 px-6 text-sm font-semibold text-gray-900 transition-all hover:bg-lime-300"
          >
            Get Started Free
          </Link>
        </motion.div>
      </article>

      <CTABanner />
    </>
  );
}
