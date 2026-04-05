import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-gradient-to-r from-muted via-muted-foreground/5 to-muted bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="flex h-dvh">
      {/* Sidebar placeholder */}
      <div className="hidden w-[240px] border-r border-border bg-card p-4 lg:block">
        <Shimmer className="mb-8 h-8 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-9 w-full" />
          ))}
        </div>
      </div>
      {/* Content placeholder */}
      <div className="flex-1 p-6">
        <Shimmer className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="h-24 w-full" />
          ))}
        </div>
        <Shimmer className="mt-6 h-48 w-full" />
      </div>
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6",
        className
      )}
    >
      <Shimmer className="mb-4 h-4 w-3/4" />
      <Shimmer className="mb-2 h-3 w-full" />
      <Shimmer className="h-3 w-1/2" />
    </div>
  );
}

export function GridSkeleton({
  count = 8,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}: {
  count?: number;
  columns?: string;
}) {
  return (
    <div className={cn("grid gap-4", columns)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className
      )}
    >
      <Shimmer className="aspect-[3/4] w-full" />
      <div className="p-3">
        <Shimmer className="mb-2 h-3 w-2/3" />
        <Shimmer className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card p-4"
        >
          <Shimmer className="mb-2 h-3 w-20" />
          <Shimmer className="h-7 w-16" />
        </div>
      ))}
    </div>
  );
}
