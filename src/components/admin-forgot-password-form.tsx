"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  adminPasswordResetRequestAction,
  type AdminActionState,
} from "@/app/actions/admin";

const initialState: AdminActionState = {};

function FieldError({
  errors,
  name,
}: {
  errors: AdminActionState["errors"];
  name: string;
}) {
  const message = errors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

export function AdminForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    adminPasswordResetRequestAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-6">
      {state.message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-800">
          {state.message}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="admin-email"
          className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500"
        >
          Admin Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue="mail@patentzoom.us"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.12)]"
        />
        <FieldError errors={state.errors} name="email" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#e63c18] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Sending Reset Link..." : "Email Admin Reset Link"}
      </button>

      {state.delivery === "outbox" ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
          SMTP is not configured yet, so this reset message was written to the
          local password reset outbox instead of being emailed.
        </p>
      ) : null}

      <Link
        href="/admin/login"
        className="block text-center text-sm font-semibold text-[#1f4faa] underline underline-offset-4"
      >
        Back to admin login
      </Link>
    </form>
  );
}
