import { Skeleton } from "@/components/ui/skeleton";

export default function ScoreLoading() {
  return (
    <div className="flex flex-col items-center space-y-8 py-12 animate-in fade-in duration-300">
      {/* Title */}
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-8 w-64 bg-white/[0.04]" />
        <Skeleton className="mx-auto h-4 w-96 bg-white/[0.03]" />
      </div>

      {/* Upload area */}
      <Skeleton className="h-64 w-full max-w-md rounded-2xl bg-white/[0.04]" />
    </div>
  );
}
