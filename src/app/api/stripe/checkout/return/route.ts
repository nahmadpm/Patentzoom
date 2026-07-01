import { NextResponse, type NextRequest } from "next/server";

import { markStripeCheckoutStatus } from "@/lib/auth";
import { getStripeClient } from "@/lib/stripe";
import { getIntakeHref, normalizeServiceIntent } from "@/lib/service-intents";

export const runtime = "nodejs";

function buildStepHref(
  serviceIntent: string | null,
  packageKey: string | null,
  step: number,
  checkoutState: "success" | "processing" | "canceled" | "error",
) {
  if (!serviceIntent) {
    return `/account?checkout=${checkoutState}`;
  }

  const baseHref = getIntakeHref(
    serviceIntent as Parameters<typeof getIntakeHref>[0],
    packageKey,
  );
  return `${baseHref}${baseHref.includes("?") ? "&" : "?"}step=${step}&checkout=${checkoutState}`;
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/account?checkout=error", request.url));
  }

  try {
    const stripe = getStripeClient();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    const serviceIntent = normalizeServiceIntent(
      checkoutSession.metadata?.serviceIntent ?? null,
    );
    const packageKey = checkoutSession.metadata?.packageKey || null;
    const userId = checkoutSession.metadata?.userId ?? null;

    if (!serviceIntent || !userId) {
      return NextResponse.redirect(new URL("/account?checkout=error", request.url));
    }

    if (checkoutSession.payment_status === "paid") {
      await markStripeCheckoutStatus({
        userId,
        serviceIntent,
        stripeCheckoutSessionId: checkoutSession.id,
        stripeCheckoutStatus: "paid",
        stripePaymentIntentId:
          typeof checkoutSession.payment_intent === "string"
            ? checkoutSession.payment_intent
            : checkoutSession.payment_intent?.id ?? null,
        stripePaymentStatus: checkoutSession.payment_status,
        stripeCustomerEmail: checkoutSession.customer_details?.email ?? null,
        stripeCurrency: checkoutSession.currency ?? null,
        stripeAmountSubtotal: checkoutSession.amount_subtotal ?? null,
        stripeAmountTotal: checkoutSession.amount_total ?? null,
        paidAt: new Date().toISOString(),
      });

      return NextResponse.redirect(
        new URL(buildStepHref(serviceIntent, packageKey, 11, "success"), request.url),
      );
    }

    return NextResponse.redirect(
      new URL(buildStepHref(serviceIntent, packageKey, 10, "processing"), request.url),
    );
  } catch {
    return NextResponse.redirect(new URL("/account?checkout=error", request.url));
  }
}
