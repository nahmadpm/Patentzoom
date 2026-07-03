import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { isDatabaseConfigured, withDatabase } from "@/lib/postgres";

export type ConsultationSubmission = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  createdAt: string;
};

const CONSULTATION_STORE_PATH = join(
  process.cwd(),
  ".codex-temp",
  "consultation-submissions.json",
);

type ConsultationRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  created_at: string | Date;
};

let consultationSchemaPromise: Promise<void> | null = null;

async function ensureConsultationFileStore() {
  await mkdir(join(process.cwd(), ".codex-temp"), { recursive: true });

  try {
    await readFile(CONSULTATION_STORE_PATH, "utf8");
  } catch {
    await writeFile(CONSULTATION_STORE_PATH, JSON.stringify([], null, 2), "utf8");
  }
}

async function readConsultationFileStore() {
  await ensureConsultationFileStore();
  const raw = await readFile(CONSULTATION_STORE_PATH, "utf8");
  return JSON.parse(raw) as ConsultationSubmission[];
}

function mapConsultationRow(row: ConsultationRow): ConsultationSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    phone: row.phone,
    message: row.message,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

async function ensureConsultationDatabase() {
  if (!isDatabaseConfigured()) {
    return;
  }

  if (!consultationSchemaPromise) {
    consultationSchemaPromise = withDatabase(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS patentzoom_consultation_submissions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT NOT NULL DEFAULT '',
          phone TEXT NOT NULL DEFAULT '',
          message TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL
        )
      `);

      const countResult = await client.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM patentzoom_consultation_submissions`,
      );
      const count = Number(countResult.rows[0]?.count ?? "0");

      if (count > 0) {
        return;
      }

      try {
        const legacyEntries = await readConsultationFileStore();

        for (const entry of legacyEntries) {
          await client.query(
            `
              INSERT INTO patentzoom_consultation_submissions (
                id,
                name,
                email,
                company,
                phone,
                message,
                created_at
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT (id) DO NOTHING
            `,
            [
              entry.id,
              entry.name,
              entry.email,
              entry.company,
              entry.phone,
              entry.message,
              entry.createdAt,
            ],
          );
        }
      } catch {
        // Skip import when no legacy file exists on disk yet.
      }
    });
  }

  await consultationSchemaPromise;
}

export async function readConsultationSubmissions() {
  if (!isDatabaseConfigured()) {
    return readConsultationFileStore();
  }

  await ensureConsultationDatabase();

  return withDatabase(async (client) => {
    const result = await client.query<ConsultationRow>(
      `
        SELECT id, name, email, company, phone, message, created_at
        FROM patentzoom_consultation_submissions
        ORDER BY created_at DESC
      `,
    );

    return result.rows.map(mapConsultationRow);
  });
}

export async function saveConsultationSubmission(input: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}) {
  const entry: ConsultationSubmission = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    company: input.company?.trim() ?? "",
    phone: input.phone?.trim() ?? "",
    message: input.message?.trim() ?? "",
    createdAt: new Date().toISOString(),
  };

  if (!isDatabaseConfigured()) {
    const submissions = await readConsultationFileStore();
    submissions.unshift(entry);
    await writeFile(
      CONSULTATION_STORE_PATH,
      JSON.stringify(submissions, null, 2),
      "utf8",
    );
    return entry;
  }

  await ensureConsultationDatabase();

  await withDatabase(async (client) => {
    await client.query(
      `
        INSERT INTO patentzoom_consultation_submissions (
          id,
          name,
          email,
          company,
          phone,
          message,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        entry.id,
        entry.name,
        entry.email,
        entry.company,
        entry.phone,
        entry.message,
        entry.createdAt,
      ],
    );
  });

  return entry;
}
