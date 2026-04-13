"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag, FlaskConical, Terminal } from "lucide-react";

const envFlags = [
  { key: "NEXT_PUBLIC_ENABLE_HALO_SCORE", description: "Show Halo Score on generated headshots" },
  { key: "NEXT_PUBLIC_FREE_GENERATIONS", description: "Number of free generations for new users" },
  { key: "NEXT_PUBLIC_ENABLE_PRESETS", description: "Enable preset selection in generation flow" },
  { key: "REPLICATE_MODEL_VERSION", description: "Controls which model version is used for generation" },
];

export default function FlagsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Feature Flags</h2>
        <p className="text-sm text-muted-foreground">
          Control feature rollouts and manage A/B tests
        </p>
      </div>

      {/* Feature Flags empty state */}
      <Card className="border-border bg-card border-dashed">
        <CardContent className="py-16 text-center">
          <Flag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium">Feature flags will be available after launch</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            For now, use environment variables for feature gating. A database-backed feature flag system
            will be added when we need dynamic rollouts.
          </p>
        </CardContent>
      </Card>

      {/* Current env-based flags */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-violet-400" />
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Environment Variable Flags
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {envFlags.map((flag) => (
              <div
                key={flag.key}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">
                    {flag.key}
                  </code>
                  <p className="text-xs text-muted-foreground mt-1">
                    {flag.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                >
                  env var
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-4">
            These flags are set in .env.local and require a redeploy to change.
            Update them in the Vercel dashboard for production.
          </p>
        </CardContent>
      </Card>

      {/* A/B Tests empty state */}
      <Card className="border-border bg-card border-dashed">
        <CardContent className="py-12 text-center">
          <FlaskConical className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium">A/B tests coming soon</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            A/B testing infrastructure will be added post-launch. For now, use analytics events
            to measure the impact of changes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
