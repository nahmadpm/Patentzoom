import { createHmac, timingSafeEqual } from "node:crypto";

import { redirect } from "next/navigation";

import { clearSession } from "@/lib/auth";

const ADMIN_COOKIE_NAME = "patentzoom_admin_session";
const ADMIN_SECRET =
  process.env.PATENTZOOM_ADMIN_SECRET ??
  process.env.PATENTZOOM_AUTH_SECRET ??
  "patentzoom-admin-secret";

export type AdminSession = {
  email: string;
  loggedInAt: string;
};

function requireAdminEnv(name: "PATENTZOOM_ADMIN_EMAIL" | "PATENTZOOM_ADMIN_PASSWORD") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required admin environment variable: ${name}`);
  }

  return value;
}

function encodeAdminSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

function decodeAdminSession(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;
  } catch {
    return null;
  }
}

function safeEqualText(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  return (
    aBuffer.length === bBuffer.length &&
    timingSafeEqual(aBuffer, bBuffer)
  );
}

export function isAdminConfigured() {
  return Boolean(
    process.env.PATENTZOOM_ADMIN_EMAIL?.trim() &&
      process.env.PATENTZOOM_ADMIN_PASSWORD?.trim(),
  );
}

export async function setAdminSession(session: AdminSession) {
  const cookieStore = await import("next/headers").then((mod) => mod.cookies());

  cookieStore.set(ADMIN_COOKIE_NAME, encodeAdminSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await import("next/headers").then((mod) => mod.cookies());
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await import("next/headers").then((mod) => mod.cookies());
  return decodeAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function loginAdmin(input: { email: string; password: string }) {
  if (!isAdminConfigured()) {
    return {
      ok: false as const,
      message:
        "Admin login is not configured yet. Add PATENTZOOM_ADMIN_EMAIL and PATENTZOOM_ADMIN_PASSWORD to production env.",
    };
  }

  const expectedEmail = requireAdminEnv("PATENTZOOM_ADMIN_EMAIL").toLowerCase();
  const expectedPassword = requireAdminEnv("PATENTZOOM_ADMIN_PASSWORD");
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();

  if (!safeEqualText(email, expectedEmail) || !safeEqualText(password, expectedPassword)) {
    return {
      ok: false as const,
      message: "Admin email or password is incorrect.",
    };
  }

  await clearSession();
  await setAdminSession({
    email,
    loggedInAt: new Date().toISOString(),
  });

  return {
    ok: true as const,
    redirectTo: "/admin",
  };
}
