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
        <p className="font-mono text-7xl font-bold text-halo-500/30">0</p>
        <h1 className="mt-4 font-display text-2xl font-bold">
          This page scored a 0.
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Let&apos;s get you somewhere better.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg bg-violet-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Go home
          </Link>
          <Link
            href="/score"
            className="inline-flex h-10 items-center rounded-lg bg-halo-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-halo-400"
          >
            Score your photo
          </Link>
          <Link
            href="/blog"
            className="inline-flex h-10 items-center rounded-lg border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
