import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header shimmer */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-white/[0.04]" />
        <Skeleton className="h-4 w-96 bg-white/[0.03]" />
      </div>

      {/* Hero card shimmer */}
      <Skeleton className="h-32 w-full rounded-xl bg-white/[0.04]" />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-20 rounded-xl bg-white/[0.04]" />
        <Skeleton className="h-20 rounded-xl bg-white/[0.04]" />
        <Skeleton className="h-20 rounded-xl bg-white/[0.04]" />
      </div>

      {/* CTA shimmer */}
      <Skeleton className="h-24 w-full rounded-xl bg-white/[0.04]" />

      {/* Grid shimmer */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 bg-white/[0.04]" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  );
}
