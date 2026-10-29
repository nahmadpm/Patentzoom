/* eslint-disable @typescript-eslint/no-require-imports */
// Read-only production checks. Never log environment values or raw provider errors.
const { readFileSync } = require("node:fs");
const { loadEnvConfig } = require("@next/env");
const nodemailer = require("nodemailer");
const { Client } = require("pg");

function report(check, details) {
  console.log(JSON.stringify({ check, ...details }));
}

function safeError(error) {
  const allowed = new Set([
    "EAUTH", "ECONNECTION", "ETIMEDOUT", "ECONNREFUSED", "ECONNRESET",
    "EDNS", "ENOTFOUND", "ESOCKET", "ETLS", "EPROTOCOL", "EENVELOPE",
    "28P01", "42501", "42P01", "42703", "42883", "42P18", "08P01",
  ]);
  return {
    code: allowed.has(error?.code) ? error.code : "OTHER",
    responseCode: Number.isInteger(error?.responseCode) ? error.responseCode : null,
  };
}

async function main() {
  loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
  const keys = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "PATENTZOOM_SMTP_FROM"];
  const counts = Object.fromEntries(keys.map((key) => [key, 0]));
  for (const line of readFileSync(".env.production", "utf8").split(/\r?\n/)) {
    const key = line.match(/^\s*(?:export\s+)?([A-Z_]+)\s*=/)?.[1];
    if (Object.hasOwn(counts, key)) counts[key] += 1;
  }
  report("environment", {
    configured: Object.fromEntries(keys.map((key) => [key, Boolean(process.env[key]?.trim())])),
    duplicateKeys: keys.filter((key) => counts[key] > 1),
    databaseConfigured: Boolean(process.env.DATABASE_URL?.trim()),
  });

  if (process.env.DATABASE_URL?.trim()) {
    const setting = process.env.DATABASE_SSL?.trim().toLowerCase();
    const ssl = ["disable", "false"].includes(setting) ? false
      : ["require", "true"].includes(setting) || /amazonaws\.com/i.test(process.env.DATABASE_URL);
    const client = new Client({
      connectionString: process.env.DATABASE_URL.trim(),
      ssl: ssl ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 10000,
      query_timeout: 10000,
    });
    try {
      await client.connect();
      const result = await client.query(`SELECT
        to_regclass('public.patentzoom_users') IS NOT NULL AS users_exist,
        to_regclass('public.patentzoom_rate_limits') IS NOT NULL AS rate_limits_exist`);
      report("database", { ok: true, ...result.rows[0] });
      if (result.rows[0].rate_limits_exist) {
        // EXPLAIN validates the production statement without executing its INSERT.
        await client.query(`EXPLAIN INSERT INTO patentzoom_rate_limits (key, attempts, expires_at)
          VALUES ($1, 1, NOW() + $2 * INTERVAL '1 millisecond')
          ON CONFLICT (key) DO UPDATE SET
            attempts = CASE WHEN patentzoom_rate_limits.expires_at <= NOW() THEN 1 ELSE patentzoom_rate_limits.attempts + 1 END,
            expires_at = CASE WHEN patentzoom_rate_limits.expires_at <= NOW() THEN EXCLUDED.expires_at ELSE patentzoom_rate_limits.expires_at END
          RETURNING attempts`, ["read-only-email-diagnostic", 900000]);
        report("rate_limit_statement", { ok: true });
      }
    } catch (error) {
      report("database", { ok: false, ...safeError(error) });
      process.exitCode = 1;
    } finally {
      await client.end().catch(() => {});
    }
  }

  const port = Number(process.env.SMTP_PORT);
  if (!keys.slice(0, 4).every((key) => process.env[key]?.trim()) || !Number.isInteger(port) || port < 1 || port > 65535) {
    report("smtp", { ok: false, code: "CONFIGURATION_MISSING_OR_INVALID" });
    process.exitCode = 1;
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    logger: false,
    debug: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  try {
    await transporter.verify();
    report("smtp", { ok: true, authenticated: true, emailSent: false });
  } catch (error) {
    report("smtp", { ok: false, ...safeError(error) });
    process.exitCode = 1;
  } finally {
    transporter.close();
  }
}

main().catch(() => {
  report("diagnostic", { ok: false, code: "CHECK_COULD_NOT_COMPLETE" });
  process.exitCode = 1;
});
