"use client";

import { useActionState } from "react";

import {
  type AuthActionState,
  updateAccountAction,
} from "@/app/actions/auth";
import { getServiceIntentLabel, type ServiceIntent } from "@/lib/service-intents";

const initialState: AuthActionState = {};

function FieldError({
  errors,
  name,
}: {
  errors: AuthActionState["errors"];
  name: string;
}) {
  const message = errors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

export function AccountProfileForm({
  user,
  pendingService,
  serviceIntentOverride = null,
  packageKey = null,
  packageLabel = null,
  showPendingBanner = true,
  submitLabel = "Save Profile & Continue",
  footerNote = "This is the first real scaffold of PatentZoom's account flow. The database-backed production auth system comes next.",
}: {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    bestTime: string;
    passwordMissing: boolean;
  };
  pendingService: ServiceIntent | null;
  serviceIntentOverride?: ServiceIntent | null;
  packageKey?: string | null;
  packageLabel?: string | null;
  showPendingBanner?: boolean;
  submitLabel?: string;
  footerNote?: string;
}) {
  const [state, action, pending] = useActionState(updateAccountAction, initialState);

  return (
    <form action={action} className="space-y-8">
      <input
        type="hidden"
        name="passwordRequired"
        value={user.passwordMissing ? "true" : "false"}
      />
      <input
        type="hidden"
        name="serviceIntent"
        value={serviceIntentOverride ?? ""}
      />
      <input type="hidden" name="packageKey" value={packageKey ?? ""} />
      <input type="hidden" name="packageLabel" value={packageLabel ?? ""} />

      {pendingService && showPendingBanner ? (
        <div className="rounded-[20px] border border-[#fb4522]/20 bg-[#fff7f4] px-5 py-4 text-sm leading-7 text-slate-700">
          <span className="font-semibold text-[#fb4522]">
            Next up:
          </span>{" "}
          once your profile is complete, we&apos;ll continue into the{" "}
          {getServiceIntentLabel(pendingService)} intake flow.
        </div>
      ) : null}

      {state.message ? (
        <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            defaultValue={user.firstName}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="firstName" />
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            defaultValue={user.lastName}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="lastName" />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="email" />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={user.phone}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="phone" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="address1" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Address 1
          </label>
          <input
            id="address1"
            name="address1"
            defaultValue={user.address1}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="address1" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="address2" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Address 2
          </label>
          <input
            id="address2"
            name="address2"
            defaultValue={user.address2}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="address2" />
        </div>
        <div>
          <label htmlFor="city" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            City
          </label>
          <input
            id="city"
            name="city"
            defaultValue={user.city}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="city" />
        </div>
        <div>
          <label htmlFor="state" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            State / Province
          </label>
          <input
            id="state"
            name="state"
            defaultValue={user.state}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="state" />
        </div>
        <div>
          <label htmlFor="zip" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            ZIP / Postal Code
          </label>
          <input
            id="zip"
            name="zip"
            defaultValue={user.zip}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="zip" />
        </div>
        <div>
          <label htmlFor="country" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Country
          </label>
          <input
            id="country"
            name="country"
            defaultValue={user.country}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          />
          <FieldError errors={state.errors} name="country" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr_1.2fr]">
        <div>
          <label htmlFor="bestTime" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Best Time To Contact
          </label>
          <select
            id="bestTime"
            name="bestTime"
            defaultValue={user.bestTime}
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
          >
            <option value="">Select best time</option>
            <option value="Morning">Morning</option>
            <option value="Early Afternoon">Early Afternoon</option>
            <option value="Late Afternoon">Late Afternoon</option>
            <option value="Early Evening">Early Evening</option>
          </select>
          <FieldError errors={state.errors} name="bestTime" />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            {user.passwordMissing ? "Create Password" : "Update Password"}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
            placeholder={user.passwordMissing ? "Create a password" : "Leave blank to keep current password"}
          />
          <FieldError errors={state.errors} name="password" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="mt-2 w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
            placeholder="Repeat password"
          />
          <FieldError errors={state.errors} name="confirmPassword" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-full bg-[#fb4522] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#ef3c18] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        <p className="text-sm leading-7 text-slate-500">
          {footerNote}
        </p>
      </div>
    </form>
  );
}
