import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

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

async function ensureConsultationStore() {
  await mkdir(join(process.cwd(), ".codex-temp"), { recursive: true });

  try {
    await readFile(CONSULTATION_STORE_PATH, "utf8");
  } catch {
    await writeFile(CONSULTATION_STORE_PATH, JSON.stringify([], null, 2), "utf8");
  }
}

export async function readConsultationSubmissions() {
  await ensureConsultationStore();
  const raw = await readFile(CONSULTATION_STORE_PATH, "utf8");
  return JSON.parse(raw) as ConsultationSubmission[];
}

export async function saveConsultationSubmission(input: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}) {
  const submissions = await readConsultationSubmissions();
  const entry: ConsultationSubmission = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    company: input.company?.trim() ?? "",
    phone: input.phone?.trim() ?? "",
    message: input.message?.trim() ?? "",
    createdAt: new Date().toISOString(),
  };

  submissions.unshift(entry);
  await writeFile(
    CONSULTATION_STORE_PATH,
    JSON.stringify(submissions, null, 2),
    "utf8",
  );

  return entry;
}
