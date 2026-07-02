"use client";

import { useActionState } from "react";

import {
  adminLoginAction,
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

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLoginAction, initialState);

  return (
    <form action={action} className="space-y-6">
      {state.message ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.12)]"
        />
        <FieldError errors={state.errors} name="email" />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.12)]"
        />
        <FieldError errors={state.errors} name="password" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#e63c18] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Signing In..." : "Sign In To Admin"}
      </button>
    </form>
  );
}
