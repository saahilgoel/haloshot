import { Skeleton } from "@/components/ui/skeleton";

export default function GenerateLoading() {
  return (
    <div className="min-h-screen pb-24 md:pb-8 animate-in fade-in duration-300">
      {/* Step indicator */}
      <div className="border-b border-white/5 px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-1 items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full bg-white/[0.04]" />
              <Skeleton className="hidden h-4 w-14 bg-white/[0.03] md:block" />
              {i < 3 && <div className="h-px flex-1 bg-white/5" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-4 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-72 bg-white/[0.04]" />
          <Skeleton className="h-4 w-96 bg-white/[0.03]" />
        </div>

        {/* Upload zone placeholder */}
        <Skeleton className="h-48 w-full rounded-2xl bg-white/[0.04]" />
      </div>
    </div>
  );
}
