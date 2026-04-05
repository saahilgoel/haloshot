import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32 bg-white/[0.04]" />
          <Skeleton className="h-4 w-64 bg-white/[0.03]" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md bg-white/[0.04]" />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-8 rounded-full bg-white/[0.04]"
            style={{ width: `${60 + Math.random() * 30}px` }}
          />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[3/4] rounded-xl bg-white/[0.04]" />
            <div className="flex items-center justify-between px-1">
              <Skeleton className="h-4 w-16 rounded-full bg-white/[0.04]" />
              <Skeleton className="h-3 w-20 bg-white/[0.03]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
