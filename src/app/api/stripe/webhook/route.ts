import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { markStripeCheckoutStatus } from "@/lib/auth";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";
import { normalizeServiceIntent } from "@/lib/service-intents";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature.", { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripeClient();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getStripeWebhookSecret(),
    );
  } catch (error) {
    return new Response(
      `Webhook error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const serviceIntent = normalizeServiceIntent(session.metadata?.serviceIntent ?? null);
      const userId = session.metadata?.userId ?? null;

      if (serviceIntent && userId) {
        await markStripeCheckoutStatus({
          userId,
          serviceIntent,
          stripeCheckoutSessionId: session.id,
          stripeCheckoutStatus: session.payment_status === "paid" ? "paid" : "pending",
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          stripePaymentStatus: session.payment_status,
          stripeCustomerEmail: session.customer_details?.email ?? null,
          stripeCurrency: session.currency ?? null,
          stripeAmountSubtotal: session.amount_subtotal ?? null,
          stripeAmountTotal: session.amount_total ?? null,
          paidAt: session.payment_status === "paid" ? new Date().toISOString() : null,
        });
      }
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const serviceIntent = normalizeServiceIntent(session.metadata?.serviceIntent ?? null);
      const userId = session.metadata?.userId ?? null;

      if (serviceIntent && userId) {
        await markStripeCheckoutStatus({
          userId,
          serviceIntent,
          stripeCheckoutSessionId: session.id,
          stripeCheckoutStatus: "expired",
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          stripePaymentStatus: session.payment_status,
          stripeCustomerEmail: session.customer_details?.email ?? null,
          stripeCurrency: session.currency ?? null,
          stripeAmountSubtotal: session.amount_subtotal ?? null,
          stripeAmountTotal: session.amount_total ?? null,
          paidAt: null,
        });
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const serviceIntent = normalizeServiceIntent(
        paymentIntent.metadata?.serviceIntent ?? null,
      );
      const userId = paymentIntent.metadata?.userId ?? null;

      if (serviceIntent && userId) {
        await markStripeCheckoutStatus({
          userId,
          serviceIntent,
          stripeCheckoutSessionId: null,
          stripeCheckoutStatus: "failed",
          stripePaymentIntentId: paymentIntent.id,
          stripePaymentStatus: paymentIntent.status,
          stripeCustomerEmail:
            typeof paymentIntent.receipt_email === "string"
              ? paymentIntent.receipt_email
              : null,
          stripeCurrency: paymentIntent.currency ?? null,
          stripeAmountSubtotal: paymentIntent.amount ?? null,
          stripeAmountTotal: paymentIntent.amount ?? null,
          paidAt: null,
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
