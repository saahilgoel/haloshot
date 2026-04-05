"use client";

import {
  Crown,
  ArrowUpRight,
  CreditCard,
  Zap,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// TODO: replace with real data from Stripe/Supabase
const mockBilling = {
  plan: "pro" as "free" | "pro" | "team",
  generationsUsed: 18,
  generationsLimit: 50,
  renewalDate: "May 5, 2026",
  monthlyPrice: "$19",
};

const mockInvoices = [
  { id: "INV-001", date: "Apr 5, 2026", amount: "$19.00", status: "Paid" },
  { id: "INV-002", date: "Mar 5, 2026", amount: "$19.00", status: "Paid" },
  { id: "INV-003", date: "Feb 5, 2026", amount: "$19.00", status: "Paid" },
];

const planFeatures: Record<string, string[]> = {
  free: ["5 headshots/month", "3 presets", "Standard quality"],
  pro: [
    "50 headshots/month",
    "All presets",
    "HD quality",
    "Priority processing",
    "Download originals",
  ],
  team: [
    "Unlimited headshots",
    "All presets",
    "4K quality",
    "Priority processing",
    "Team management",
    "Brand kit",
    "API access",
  ],
};

export default function BillingPage() {
  const isFree = mockBilling.plan === "free";
  const usagePercent =
    (mockBilling.generationsUsed / mockBilling.generationsLimit) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current plan */}
      <Card
        className={
          isFree
            ? ""
            : "border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-transparent"
        }
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Crown className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <CardTitle className="capitalize">
                  {mockBilling.plan} Plan
                </CardTitle>
                <CardDescription>
                  {mockBilling.monthlyPrice}/month &middot; Renews{" "}
                  {mockBilling.renewalDate}
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <CreditCard className="h-4 w-4" />
              Manage Subscription
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {planFeatures[mockBilling.plan]?.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 shrink-0 text-lime-400" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage This Month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Generations</span>
            <span className="font-medium">
              {mockBilling.generationsUsed} / {mockBilling.generationsLimit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          {usagePercent > 80 && (
            <p className="text-xs text-amber-400">
              You&apos;ve used {Math.round(usagePercent)}% of your monthly
              quota.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upgrade CTA (only for free) */}
      {isFree && (
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-white">
                <Zap className="h-5 w-5 text-lime-400" />
                Upgrade to Pro
              </h3>
              <p className="text-sm text-violet-200">
                Get 50 headshots/month, all presets, HD quality, and more.
              </p>
            </div>
            <Button className="shrink-0 bg-lime-400 font-semibold text-black hover:bg-lime-300">
              Upgrade Now
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {mockInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Invoice</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="py-3 pr-4 font-medium">{invoice.id}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {invoice.date}
                      </td>
                      <td className="py-3 pr-4">{invoice.amount}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No invoices yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
