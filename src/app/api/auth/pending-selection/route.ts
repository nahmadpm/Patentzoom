import { NextResponse } from "next/server";

import { updatePendingSelection } from "@/lib/auth";
import { normalizeServiceIntent } from "@/lib/service-intents";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    serviceIntent?: string;
    packageKey?: string;
    packageLabel?: string;
  };

  const serviceIntent = normalizeServiceIntent(body.serviceIntent);

  if (!serviceIntent) {
    return NextResponse.json(
      {
        message: "A valid service selection is required.",
      },
      { status: 400 },
    );
  }

  const result = await updatePendingSelection({
    serviceIntent,
    pendingPackageKey: body.packageKey?.trim() || null,
    pendingPackageLabel: body.packageLabel?.trim() || null,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        message: result.message,
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    redirectTo: result.redirectTo,
  });
}
