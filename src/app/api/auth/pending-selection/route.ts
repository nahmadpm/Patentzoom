import { NextResponse } from "next/server";
import { z } from "zod";

import { updatePendingSelection } from "@/lib/auth";
import { normalizeServiceIntent } from "@/lib/service-intents";

export async function POST(request: Request) {
  const parsed = z.object({
    serviceIntent: z.string(), packageKey: z.string().max(200).optional(), packageLabel: z.string().max(300).optional(),
  }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Invalid service selection." }, { status: 400 });
  const body = parsed.data;

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
