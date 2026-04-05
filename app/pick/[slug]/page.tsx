import { Metadata } from "next";
import { VotePage } from "@/components/pick/VotePage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // TODO: Fetch poll data from Supabase to populate metadata
  return {
    title: "Help pick the best first impression | HaloShot",
    description:
      "Vote on which photo makes a better first impression. Takes 2 seconds. No signup needed.",
    openGraph: {
      title: "Which photo makes a better first impression?",
      description: "Vote now. It takes 2 seconds. No signup needed.",
      type: "website",
      url: `https://haloshot.com/pick/${slug}`,
      siteName: "HaloShot",
    },
    twitter: {
      card: "summary_large_image",
      title: "Which photo makes a better first impression?",
      description: "Vote now. It takes 2 seconds.",
    },
  };
}

// TODO: Replace with real Supabase fetch
async function getPollData(slug: string) {
  return {
    creatorName: "Saahil",
    photoA: {
      id: "a",
      url: "/placeholder-headshot-1.jpg",
      label: "Photo A",
    },
    photoB: {
      id: "b",
      url: "/placeholder-headshot-2.jpg",
      label: "Photo B",
    },
    votes: { a: 14, b: 9 },
  };
}

export default async function PublicVotePage({ params }: Props) {
  const { slug } = await params;
  const poll = await getPollData(slug);

  return (
    <VotePage
      creatorName={poll.creatorName}
      photoA={poll.photoA}
      photoB={poll.photoB}
      initialVotes={poll.votes}
    />
  );
}
