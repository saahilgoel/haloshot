import { getStripe } from "./client";
import { APP_URL } from "../utils/constants";

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  returnUrl?: string
) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl || APP_URL}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl || APP_URL}/pricing`,
    metadata: { userId },
    subscription_data: { metadata: { userId } },
  });
  return session;
}

export async function createPortalSession(
  customerId: string,
  returnUrl?: string
) {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${APP_URL}/settings/billing`,
  });
  return session;
}

export async function getSubscription(subscriptionId: string) {
  const stripe = getStripe();
  return stripe.subscriptions.retrieve(subscriptionId);
}
