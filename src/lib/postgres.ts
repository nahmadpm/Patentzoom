import { Pool, type PoolClient } from "pg";

const DATABASE_URL = process.env.DATABASE_URL?.trim() ?? "";
const DATABASE_SSL = process.env.DATABASE_SSL?.trim().toLowerCase() ?? "";

declare global {
  var patentzoomPgPool: Pool | undefined;
}

function shouldUseSsl() {
  if (!DATABASE_URL) {
    return false;
  }

  if (DATABASE_SSL === "disable" || DATABASE_SSL === "false") {
    return false;
  }

  if (DATABASE_SSL === "require" || DATABASE_SSL === "true") {
    return true;
  }

  return /amazonaws\.com/i.test(DATABASE_URL);
}

export function isDatabaseConfigured() {
  return Boolean(DATABASE_URL);
}

export function getDatabasePool() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.patentzoomPgPool) {
    globalThis.patentzoomPgPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: shouldUseSsl() ? { rejectUnauthorized: false } : undefined,
      max: 10,
    });
  }

  return globalThis.patentzoomPgPool;
}

export async function withDatabase<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  const pool = getDatabasePool();
  const client = await pool.connect();

  try {
    return await callback(client);
  } finally {
    client.release();
  }
}
