import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32 bg-white/[0.04]" />
        <Skeleton className="h-4 w-64 bg-white/[0.03]" />
      </div>

      {/* Tabs */}
      <Skeleton className="h-10 w-80 rounded-lg bg-white/[0.04]" />

      {/* Card 1 - Photo */}
      <div className="rounded-xl border border-white/5 p-6 space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-28 bg-white/[0.04]" />
          <Skeleton className="h-4 w-80 bg-white/[0.03]" />
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-full bg-white/[0.04]" />
          <Skeleton className="h-9 w-28 rounded-md bg-white/[0.04]" />
        </div>
      </div>

      {/* Card 2 - Form */}
      <div className="rounded-xl border border-white/5 p-6 space-y-4">
        <Skeleton className="h-5 w-40 bg-white/[0.04]" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-white/[0.03]" />
            <Skeleton className="h-10 w-full rounded-md bg-white/[0.04]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-white/[0.03]" />
            <Skeleton className="h-10 w-full rounded-md bg-white/[0.04]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-14 bg-white/[0.03]" />
          <Skeleton className="h-10 w-full rounded-md bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}
