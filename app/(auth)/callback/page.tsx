"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/Logo";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push(redirect);
        router.refresh();
      }
    });
  }, [router, redirect]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Logo size="lg" />
      <p className="mt-4 text-muted-foreground text-sm animate-pulse">
        Completing sign in...
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Logo size="lg" />
        <p className="mt-4 text-muted-foreground text-sm animate-pulse">Loading...</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
