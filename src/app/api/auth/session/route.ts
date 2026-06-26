import { NextResponse } from "next/server";

import { getCurrentUserContext } from "@/lib/auth";
import { getIntakeHref, getServiceIntentLabel } from "@/lib/service-intents";

export async function GET() {
  const context = await getCurrentUserContext();

  if (!context) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  const { session } = context;

  return NextResponse.json({
    authenticated: true,
    user: {
      displayName: session.displayName,
      email: session.email,
      profileComplete: session.profileComplete,
      pendingService: session.pendingService,
      pendingServiceLabel: session.pendingService
        ? getServiceIntentLabel(session.pendingService)
        : null,
      pendingPackageKey: session.pendingPackageKey,
      pendingPackageLabel: session.pendingPackageLabel,
      nextHref: session.pendingService
        ? getIntakeHref(session.pendingService, session.pendingPackageKey)
        : "/account",
    },
  });
}
