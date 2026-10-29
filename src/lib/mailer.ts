import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import nodemailer from "nodemailer";

const OUTBOX_PATH = join(process.cwd(), ".codex-temp", "password-reset-outbox.json");

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

type OutboxMessage = {
  to: string;
  subject: string;
  html: string;
  createdAt: string;
};

async function writeOutboxMessage(message: OutboxMessage) {
  await mkdir(join(process.cwd(), ".codex-temp"), { recursive: true });

  let entries: OutboxMessage[] = [];

  try {
    const raw = await readFile(OUTBOX_PATH, "utf8");
    entries = JSON.parse(raw) as OutboxMessage[];
  } catch {
    entries = [];
  }

  entries.unshift(message);
  await writeFile(OUTBOX_PATH, JSON.stringify(entries, null, 2), "utf8");
}

function buildResetEmail({
  displayName,
  temporaryPassword,
}: {
  displayName: string;
  temporaryPassword: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 16px; color: #25306b;">PatentZoom Temporary Password</h2>
      <p>Hello ${escapeHtml(displayName || "there")},</p>
      <p>We received a request to help you regain access to your PatentZoom account.</p>
      <p>
        Your temporary password is:
        <strong style="display:inline-block; margin-left: 8px; letter-spacing: 0.08em;">${temporaryPassword}</strong>
      </p>
      <p>Return to the PatentZoom password reset page, enter this temporary password, then choose your new password.</p>
      <p>This temporary password expires in 30 minutes.</p>
      <p style="margin-top: 24px;">PatentZoom</p>
    </div>
  `;
}

function buildAdminResetEmail({ resetUrl }: { resetUrl: string }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 16px; color: #25306b;">PatentZoom Admin Password Reset</h2>
      <p>We received a request to reset the PatentZoom admin password.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block; border-radius:12px; background:#fb4522; color:#ffffff; padding:12px 18px; text-decoration:none; font-weight:700;">
          Reset admin password
        </a>
      </p>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetUrl}</p>
      <p>This link expires in 30 minutes and can only be used once.</p>
      <p style="margin-top: 24px;">PatentZoom</p>
    </div>
  `;
}

export async function sendTemporaryPasswordEmail(payload: {
  email: string;
  temporaryPassword: string;
  displayName: string;
}) {
  const subject = "Your PatentZoom temporary password";
  const html = buildResetEmail(payload);
  return sendAccountEmail(payload.email, subject, html);
}

export async function sendRegistrationVerificationEmail(payload: {
  email: string;
  temporaryPassword: string;
  displayName: string;
}) {
  return sendAccountEmail(payload.email, "Verify your PatentZoom email", `
    <h2>Verify your PatentZoom email</h2>
    <p>Hello ${escapeHtml(payload.displayName || "there")},</p>
    <p>Your verification code is <strong>${escapeHtml(payload.temporaryPassword)}</strong>.</p>
    <p>Enter this code on PatentZoom and choose your password. The code expires in 30 minutes.</p>
    <p>If you did not request this, you can ignore this email.</p>
  `);
}

async function sendAccountEmail(email: string, subject: string, html: string) {
  const from =
    process.env.PATENTZOOM_SMTP_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    "PatentZoom <no-reply@patentzoom.us>";

  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      connectionTimeout: 10_000,
      socketTimeout: 20_000,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject,
      html,
    });

    return {
      delivery: "smtp" as const,
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Email delivery is not configured.");
  }
  await writeOutboxMessage({
    to: email,
    subject,
    html,
    createdAt: new Date().toISOString(),
  });

  return {
    delivery: "outbox" as const,
  };
}

export async function sendAdminPasswordResetEmail(payload: {
  email: string;
  resetUrl: string;
}) {
  const subject = "Reset your PatentZoom admin password";
  const html = buildAdminResetEmail(payload);
  return sendAccountEmail(payload.email, subject, html);
}
