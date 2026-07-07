"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  adminPasswordResetAction,
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

export function AdminResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(
    adminPasswordResetAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="token" value={token} />

      {state.message ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="new-password"
          className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500"
        >
          New Admin Password
        </label>
        <input
          id="new-password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.12)]"
        />
        <FieldError errors={state.errors} name="newPassword" />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500"
        >
          Retype New Password
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.12)]"
        />
        <FieldError errors={state.errors} name="confirmPassword" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#e63c18] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Updating Password..." : "Set Admin Password"}
      </button>

      <Link
        href="/admin/forgot-password"
        className="block text-center text-sm font-semibold text-[#1f4faa] underline underline-offset-4"
      >
        Request a new reset link
      </Link>
    </form>
  );
}
