import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function requireEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required Stripe environment variable: ${name}`);
  }

  return value;
}

export function getAppUrl() {
  const value = requireEnv("NEXT_PUBLIC_APP_URL");
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getStripeCurrency() {
  return (process.env.STRIPE_CURRENCY?.trim().toLowerCase() || "usd") as
    | "usd"
    | Lowercase<string>;
}

export function getStripeWebhookSecret() {
  return requireEnv("STRIPE_WEBHOOK_SECRET");
}

export function getStripeClient() {
  if (!stripeClient) {
    stripeClient = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  }

  return stripeClient;
}
