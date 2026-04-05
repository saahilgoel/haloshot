export const STRIPE_PRICES = {
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
  pro_annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
  team: process.env.STRIPE_TEAM_PRICE_ID!,
} as const;

export type StripePriceKey = keyof typeof STRIPE_PRICES;
