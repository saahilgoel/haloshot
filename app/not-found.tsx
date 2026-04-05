import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500 font-display text-base font-bold text-white">
          H
        </div>
        <span className="font-display text-2xl font-bold tracking-tight">
          HaloShot
        </span>
      </div>

      {/* 404 */}
      <div className="text-center">
        <p className="font-mono text-7xl font-bold text-violet-500/30">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">
          Page not found
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg bg-violet-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center rounded-lg border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
