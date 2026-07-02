import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

import type { UploadedIntakeFile } from "@/lib/intake-upload-types";
import type { ServiceIntent } from "@/lib/service-intents";

const UPLOAD_ROOT = join(process.cwd(), ".codex-temp", "intake-uploads");
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_FILES_PER_SUBMISSION = 5;
const MAX_TOTAL_UPLOAD_BYTES = 50 * 1024 * 1024;

function sanitizeFilename(name: string) {
  const extension = extname(name).toLowerCase();
  const basename = name
    .replace(extension, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  return `${basename || "attachment"}${extension}`;
}

export function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}

export async function saveIntakeUploads(input: {
  userId: string;
  serviceIntent: ServiceIntent;
  files: File[];
}) {
  const files = input.files.filter((file) => file.size > 0);

  if (files.length === 0) {
    return {
      ok: true as const,
      uploads: [] as UploadedIntakeFile[],
    };
  }

  if (files.length > MAX_FILES_PER_SUBMISSION) {
    return {
      ok: false as const,
      message: `Please upload no more than ${MAX_FILES_PER_SUBMISSION} files at a time.`,
    };
  }

  const totalUploadSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalUploadSize > MAX_TOTAL_UPLOAD_BYTES) {
    return {
      ok: false as const,
      message: "Please keep the total upload size under 50 MB per save.",
    };
  }

  const targetDirectory = join(
    UPLOAD_ROOT,
    input.userId,
    input.serviceIntent,
  );
  await mkdir(targetDirectory, { recursive: true });

  const uploads: UploadedIntakeFile[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        ok: false as const,
        message: `${file.name} is larger than the 20 MB per-file limit.`,
      };
    }

    const id = randomUUID();
    const storedName = `${id}-${sanitizeFilename(file.name)}`;
    const destination = join(targetDirectory, storedName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(destination, buffer);

    uploads.push({
      id,
      originalName: file.name,
      storedName,
      relativePath: join(
        "intake-uploads",
        input.userId,
        input.serviceIntent,
        storedName,
      ),
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: new Date().toISOString(),
    });
  }

  return {
    ok: true as const,
    uploads,
  };
}
