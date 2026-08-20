import { NextResponse } from "next/server";

import { runSeoAutomation } from "@/lib/seo-automation";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) {
    return false;
  }

  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  return token === expected;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized SEO automation request." },
      { status: 401 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as {
    manual?: boolean;
    retry?: boolean;
  };
  const result = await runSeoAutomation({
    manual: Boolean(payload.manual),
    retry: Boolean(payload.retry),
  });

  return NextResponse.json({
    ok: result.status !== "failed",
    ...result,
  });
}
