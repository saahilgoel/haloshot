import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Greeting */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-72 bg-white/[0.04]" />
        <Skeleton className="h-4 w-96 bg-white/[0.03]" />
      </div>

      {/* Halo Score hero card */}
      <Skeleton className="h-32 w-full rounded-xl bg-white/[0.04]" />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-white/[0.04]" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24 bg-white/[0.03]" />
                <Skeleton className="h-6 w-12 bg-white/[0.04]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA card */}
      <Skeleton className="h-24 w-full rounded-xl bg-violet-600/10" />

      {/* Recent headshots */}
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
