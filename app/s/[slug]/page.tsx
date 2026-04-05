import { Metadata } from "next";
import { SharedHeadshotPage } from "./SharedHeadshotClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // TODO: Fetch headshot data from Supabase
  return {
    title: "AI Headshot by HaloShot",
    description:
      "This headshot was created with HaloShot. Get yours free in 60 seconds.",
    openGraph: {
      title: "Check out this AI headshot",
      description: "Created with HaloShot. Get yours free in 60 seconds.",
      type: "website",
      url: `https://haloshot.com/s/${slug}`,
      siteName: "HaloShot",
    },
    twitter: {
      card: "summary_large_image",
      title: "Check out this AI headshot",
      description: "Created with HaloShot. Get yours free in 60 seconds.",
    },
  };
}

// TODO: Replace with real Supabase fetch
async function getHeadshotData(slug: string) {
  return {
    imageUrl: "/placeholder-headshot-1.jpg",
    haloScore: 87,
    presetName: "Corporate",
    creatorName: "Saahil",
  };
}

export default async function SharedPage({ params }: Props) {
  const { slug } = await params;
  const data = await getHeadshotData(slug);

  return (
    <SharedHeadshotPage
      imageUrl={data.imageUrl}
      haloScore={data.haloScore}
      presetName={data.presetName}
      creatorName={data.creatorName}
    />
  );
}
