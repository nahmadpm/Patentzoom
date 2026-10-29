import { createHash } from "node:crypto";
import { isDatabaseConfigured, withDatabase } from "@/lib/postgres";

const buckets = new Map<string, { count: number; expires: number }>();
let schema: Promise<void> | undefined;

export async function allowAttempt(scope: string, identifier: string, limit = 10, windowMs = 15 * 60 * 1000) {
  const key = createHash("sha256").update(`${scope}:${identifier.trim().toLowerCase()}`).digest("hex");
  if (!isDatabaseConfigured()) {
    const now = Date.now();
    for (const [id, bucket] of buckets) if (bucket.expires <= now) buckets.delete(id);
    const bucket = buckets.get(key) ?? { count: 0, expires: now + windowMs };
    bucket.count += 1;
    buckets.set(key, bucket);
    return bucket.count <= limit;
  }
  schema ??= withDatabase(async (client) => {
    await client.query(`CREATE TABLE IF NOT EXISTS patentzoom_rate_limits (
      key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at TIMESTAMPTZ NOT NULL
    )`);
  }).catch((error) => { schema = undefined; throw error; });
  await schema;
  return withDatabase(async (client) => {
    const result = await client.query<{ attempts: number }>(`
      INSERT INTO patentzoom_rate_limits (key, attempts, expires_at)
      VALUES ($1, 1, NOW() + $2 * INTERVAL '1 millisecond')
      ON CONFLICT (key) DO UPDATE SET
        attempts = CASE WHEN patentzoom_rate_limits.expires_at <= NOW() THEN 1 ELSE patentzoom_rate_limits.attempts + 1 END,
        expires_at = CASE WHEN patentzoom_rate_limits.expires_at <= NOW() THEN EXCLUDED.expires_at ELSE patentzoom_rate_limits.expires_at END
      RETURNING attempts
    `, [key, windowMs]);
    return result.rows[0].attempts <= limit;
  });
}
