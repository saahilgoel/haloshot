import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicScoreClient } from "./client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: score } = await supabase
    .from("halo_scores")
    .select("overall_score, roast_line")
    .eq("public_slug", slug)
    .single();

  if (!score) {
    return { title: "Halo Score | HaloShot" };
  }

  return {
    title: `Halo Score: ${score.overall_score} | HaloShot`,
    description: score.roast_line,
    openGraph: {
      title: `Halo Score: ${score.overall_score}/100`,
      description: `"${score.roast_line}" — Get your own Halo Score free at haloshot.com`,
      siteName: "HaloShot",
    },
    twitter: {
      card: "summary_large_image",
      title: `Halo Score: ${score.overall_score}/100`,
      description: `"${score.roast_line}"`,
    },
  };
}

export default async function PublicScorePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: score, error } = await supabase
    .from("halo_scores")
    .select(
      "id, overall_score, warmth_score, competence_score, trustworthiness_score, approachability_score, dominance_score, roast_line, expression_type, professional_readiness, analysis_text"
    )
    .eq("public_slug", slug)
    .single();

  if (error || !score) {
    notFound();
  }

  return <PublicScoreClient score={score} />;
}
