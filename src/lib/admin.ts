import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

import { redirect } from "next/navigation";

import { clearSession } from "@/lib/auth";
import { isDatabaseConfigured, withDatabase } from "@/lib/postgres";

const scrypt = promisify(scryptCallback);

const ADMIN_COOKIE_NAME = "patentzoom_admin_session";
const ADMIN_SECRET =
  process.env.PATENTZOOM_ADMIN_SECRET ??
  process.env.PATENTZOOM_AUTH_SECRET ??
  "patentzoom-admin-secret";
const ADMIN_STORE_PATH = join(process.cwd(), ".codex-temp", "admin-store.json");
const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_MAX_AGE_MS = 1000 * 60 * 30;

export type AdminSession = {
  email: string;
  loggedInAt: string;
};

type AdminAccount = {
  id: string;
  email: string;
  passwordHash: string;
  resetTokenHash: string | null;
  resetTokenExpiresAt: string | null;
  resetTokenSentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type AdminStore = {
  account: AdminAccount | null;
};

type AdminRow = {
  id: string;
  email: string;
  password_hash: string;
  reset_token_hash: string | null;
  reset_token_expires_at: string | Date | null;
  reset_token_sent_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
};

let adminSchemaPromise: Promise<void> | null = null;

function requireAdminEnv(name: "PATENTZOOM_ADMIN_EMAIL" | "PATENTZOOM_ADMIN_PASSWORD") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required admin environment variable: ${name}`);
  }

  return value;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeDateString(value: string | Date | null | undefined) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

async function hashSecret(secret: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(secret, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifySecret(secret: string, storedHash: string) {
  const [salt, storedValue] = storedHash.split(":");

  if (!salt || !storedValue) {
    return false;
  }

  const derivedKey = (await scrypt(secret, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(storedValue, "hex");

  return (
    storedBuffer.length === derivedKey.length &&
    timingSafeEqual(storedBuffer, derivedKey)
  );
}

function generateResetToken() {
  return randomBytes(RESET_TOKEN_BYTES).toString("base64url");
}

function getConfiguredAdminEmail() {
  return normalizeEmail(requireAdminEnv("PATENTZOOM_ADMIN_EMAIL"));
}

function getConfiguredAdminPassword() {
  return requireAdminEnv("PATENTZOOM_ADMIN_PASSWORD");
}

function mapAdminRow(row: AdminRow): AdminAccount {
  return {
    id: row.id,
    email: normalizeEmail(row.email),
    passwordHash: row.password_hash,
    resetTokenHash: row.reset_token_hash,
    resetTokenExpiresAt: normalizeDateString(row.reset_token_expires_at),
    resetTokenSentAt: normalizeDateString(row.reset_token_sent_at),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function ensureAdminFileStore() {
  await mkdir(join(process.cwd(), ".codex-temp"), { recursive: true });

  try {
    await readFile(ADMIN_STORE_PATH, "utf8");
  } catch {
    await writeFile(
      ADMIN_STORE_PATH,
      JSON.stringify({ account: null } satisfies AdminStore, null, 2),
      "utf8",
    );
  }
}

async function readAdminFileStore() {
  await ensureAdminFileStore();
  const raw = await readFile(ADMIN_STORE_PATH, "utf8");
  return JSON.parse(raw) as AdminStore;
}

async function writeAdminFileStore(store: AdminStore) {
  await ensureAdminFileStore();
  await writeFile(ADMIN_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function ensureAdminDatabase() {
  if (!isDatabaseConfigured()) {
    return;
  }

  if (!adminSchemaPromise) {
    adminSchemaPromise = withDatabase(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS patentzoom_admin_accounts (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          reset_token_hash TEXT,
          reset_token_expires_at TIMESTAMPTZ,
          reset_token_sent_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        )
      `);
    });
  }

  await adminSchemaPromise;
}

async function readPersistedAdminAccount() {
  if (!isDatabaseConfigured()) {
    const store = await readAdminFileStore();
    return store.account;
  }

  await ensureAdminDatabase();

  return withDatabase(async (client) => {
    const result = await client.query<AdminRow>(
      `
        SELECT
          id,
          email,
          password_hash,
          reset_token_hash,
          reset_token_expires_at,
          reset_token_sent_at,
          created_at,
          updated_at
        FROM patentzoom_admin_accounts
        WHERE id = 'primary'
        LIMIT 1
      `,
    );

    return result.rows[0] ? mapAdminRow(result.rows[0]) : null;
  });
}

async function writePersistedAdminAccount(account: AdminAccount) {
  if (!isDatabaseConfigured()) {
    await writeAdminFileStore({ account });
    return;
  }

  await ensureAdminDatabase();

  await withDatabase(async (client) => {
    await client.query(
      `
        INSERT INTO patentzoom_admin_accounts (
          id,
          email,
          password_hash,
          reset_token_hash,
          reset_token_expires_at,
          reset_token_sent_at,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          reset_token_hash = EXCLUDED.reset_token_hash,
          reset_token_expires_at = EXCLUDED.reset_token_expires_at,
          reset_token_sent_at = EXCLUDED.reset_token_sent_at,
          updated_at = EXCLUDED.updated_at
      `,
      [
        account.id,
        account.email,
        account.passwordHash,
        account.resetTokenHash,
        account.resetTokenExpiresAt,
        account.resetTokenSentAt,
        account.createdAt,
        account.updatedAt,
      ],
    );
  });
}

async function getAdminAccount() {
  if (!isAdminConfigured()) {
    return null;
  }

  const configuredEmail = getConfiguredAdminEmail();
  const existingAccount = await readPersistedAdminAccount();

  if (existingAccount) {
    if (existingAccount.email !== configuredEmail) {
      const updatedAccount = {
        ...existingAccount,
        email: configuredEmail,
        updatedAt: new Date().toISOString(),
      };
      await writePersistedAdminAccount(updatedAccount);
      return updatedAccount;
    }

    return existingAccount;
  }

  const now = new Date().toISOString();
  const account: AdminAccount = {
    id: "primary",
    email: configuredEmail,
    passwordHash: await hashSecret(getConfiguredAdminPassword()),
    resetTokenHash: null,
    resetTokenExpiresAt: null,
    resetTokenSentAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await writePersistedAdminAccount(account);
  return account;
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
  const account = await getAdminAccount();

  if (!account) {
    return {
      ok: false as const,
      message:
        "Admin login is not configured yet. Add PATENTZOOM_ADMIN_EMAIL and PATENTZOOM_ADMIN_PASSWORD to production env.",
    };
  }

  const email = normalizeEmail(input.email);

  if (!safeEqualText(email, account.email)) {
    return {
      ok: false as const,
      message: "Admin email or password is incorrect.",
    };
  }

  const passwordMatches = await verifySecret(input.password.trim(), account.passwordHash);

  if (!passwordMatches) {
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

export async function requestAdminPasswordReset(input: {
  email: string;
  sendEmail: (payload: {
    email: string;
    resetUrl: string;
  }) => Promise<{ delivery: "smtp" | "outbox" }>;
}) {
  const account = await getAdminAccount();

  if (!account) {
    return {
      ok: false as const,
      message:
        "Admin login is not configured yet. Add PATENTZOOM_ADMIN_EMAIL and PATENTZOOM_ADMIN_PASSWORD to production env.",
    };
  }

  const submittedEmail = normalizeEmail(input.email);

  if (!safeEqualText(submittedEmail, account.email)) {
    return {
      ok: true as const,
      delivery: "smtp" as const,
      message:
        "If that email is the admin account, a secure reset link has been sent.",
    };
  }

  const token = generateResetToken();
  const now = new Date().toISOString();
  const resetUrl = new URL(
    "/admin/reset-password",
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  );
  resetUrl.searchParams.set("token", token);

  const nextAccount: AdminAccount = {
    ...account,
    resetTokenHash: await hashSecret(token),
    resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_MAX_AGE_MS).toISOString(),
    resetTokenSentAt: now,
    updatedAt: now,
  };

  await writePersistedAdminAccount(nextAccount);

  const emailResult = await input.sendEmail({
    email: account.email,
    resetUrl: resetUrl.toString(),
  });

  return {
    ok: true as const,
    delivery: emailResult.delivery,
    message:
      "If that email is the admin account, a secure reset link has been sent.",
  };
}

export async function resetAdminPasswordWithToken(input: {
  token: string;
  newPassword: string;
}) {
  const account = await getAdminAccount();

  if (!account) {
    return {
      ok: false as const,
      message:
        "Admin login is not configured yet. Add PATENTZOOM_ADMIN_EMAIL and PATENTZOOM_ADMIN_PASSWORD to production env.",
    };
  }

  if (!account.resetTokenHash || !account.resetTokenExpiresAt) {
    return {
      ok: false as const,
      message: "Please request a new admin password reset link.",
    };
  }

  if (new Date(account.resetTokenExpiresAt).getTime() < Date.now()) {
    return {
      ok: false as const,
      message: "This admin reset link expired. Please request a new one.",
    };
  }

  const tokenMatches = await verifySecret(input.token.trim(), account.resetTokenHash);

  if (!tokenMatches) {
    return {
      ok: false as const,
      message: "This admin reset link is invalid.",
    };
  }

  const now = new Date().toISOString();
  await writePersistedAdminAccount({
    ...account,
    passwordHash: await hashSecret(input.newPassword.trim()),
    resetTokenHash: null,
    resetTokenExpiresAt: null,
    resetTokenSentAt: null,
    updatedAt: now,
  });

  await setAdminSession({
    email: account.email,
    loggedInAt: now,
  });

  return {
    ok: true as const,
    redirectTo: "/admin",
  };
}
