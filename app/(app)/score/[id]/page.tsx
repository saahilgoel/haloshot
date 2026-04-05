import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScoreDetailClient } from "./client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ScoreDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: score, error } = await supabase
    .from("halo_scores")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !score) {
    notFound();
  }

  return <ScoreDetailClient score={score} />;
}
