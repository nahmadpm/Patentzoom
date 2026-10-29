import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUserContext, markStripeCheckoutStatus } from "@/lib/auth";
import { getAppUrl, getStripeClient } from "@/lib/stripe";
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

function buildRedirectUrl(request: NextRequest, href: string) {
  try {
    return new URL(href, `${getAppUrl()}/`);
  } catch {
    return new URL(href, request.url);
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(
      buildRedirectUrl(request, "/account?checkout=error"),
    );
  }

  try {
    const context = await getCurrentUserContext();
    if (!context) return NextResponse.redirect(buildRedirectUrl(request, "/login"));
    const stripe = getStripeClient();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    const serviceIntent = normalizeServiceIntent(
      checkoutSession.metadata?.serviceIntent ?? null,
    );
    const packageKey = checkoutSession.metadata?.packageKey || null;
    const userId = checkoutSession.metadata?.userId ?? null;

    if (!serviceIntent || !userId || userId !== context.user.id) {
      return NextResponse.redirect(
        buildRedirectUrl(request, "/account?checkout=error"),
      );
    }

    const storedPayment = context.user.intakeDrafts?.[serviceIntent]?.paymentInformation;
    if (storedPayment?.stripeCheckoutSessionId !== checkoutSession.id) {
      return NextResponse.redirect(buildRedirectUrl(request, "/account?checkout=error"));
    }

    if (checkoutSession.payment_status === "paid") {
      const result = await markStripeCheckoutStatus({
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
      if (!result.ok) return NextResponse.redirect(buildRedirectUrl(request, "/account?checkout=error"));

      return NextResponse.redirect(
        buildRedirectUrl(
          request,
          buildStepHref(serviceIntent, packageKey, 11, "success"),
        ),
      );
    }

    return NextResponse.redirect(
      buildRedirectUrl(
        request,
        buildStepHref(serviceIntent, packageKey, 10, "processing"),
      ),
    );
  } catch {
    return NextResponse.redirect(
      buildRedirectUrl(request, "/account?checkout=error"),
    );
  }
}
