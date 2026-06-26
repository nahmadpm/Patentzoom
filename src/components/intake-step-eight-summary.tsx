"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  continueFromOrderSummaryAction,
  type IntakeActionState,
} from "@/app/actions/intake";
import { type IntakeDraft } from "@/lib/auth";
import { type ServiceIntent } from "@/lib/service-intents";

const initialState: IntakeActionState = {};

export function IntakeStepEightSummary({
  serviceIntent,
  packageKey,
  packageLabel,
  currentHref,
  previousHref,
  editStepOneHref,
  editStepTwoHref,
  editStepThreeHref,
  editStepFourHref,
  contactSummary,
  draft,
  orderLines,
  totalLabel,
}: {
  serviceIntent: ServiceIntent;
  packageKey: string | null;
  packageLabel: string | null;
  currentHref: string;
  previousHref: string;
  editStepOneHref: string;
  editStepTwoHref: string;
  editStepThreeHref: string;
  editStepFourHref: string;
  contactSummary: {
    name: string;
    email: string;
    phone: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  draft: IntakeDraft;
  orderLines: readonly {
    label: string;
    value: string;
  }[];
  totalLabel: string;
}) {
  const [state, action, pending] = useActionState(
    continueFromOrderSummaryAction,
    initialState,
  );

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-8">
        <input type="hidden" name="serviceIntent" value={serviceIntent} />
        <input type="hidden" name="packageKey" value={packageKey ?? ""} />
        <input type="hidden" name="packageLabel" value={packageLabel ?? ""} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={currentHref}
            className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91]"
          >
            Save For Later
          </Link>
          <Link
            href={previousHref}
            className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91]"
          >
            &lt; Previous
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Saving..." : "Save And Continue >"}
          </button>
        </div>

        {state.message ? (
          <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </div>
        ) : null}
      </form>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">
          <article className="rounded-[20px] border border-slate-300 bg-white p-5">
            <p className="text-lg font-medium text-slate-900">
              Contact Information{" "}
              <Link href={editStepOneHref} className="text-sm text-[#396aa2]">
                [edit]
              </Link>
            </p>
            <div className="mt-3 space-y-1 text-sm leading-7 text-slate-700">
              <p>{contactSummary.name}</p>
              <p>{contactSummary.email}</p>
              <p>{contactSummary.phone}</p>
              <p>{contactSummary.address1}</p>
              <p>
                {contactSummary.city}, {contactSummary.state} {contactSummary.zip}
              </p>
              <p>{contactSummary.country}</p>
            </div>
          </article>

          <article className="rounded-[20px] border border-slate-300 bg-white p-5">
            <p className="text-lg font-medium text-slate-900">
              Invention Title{" "}
              <Link href={editStepTwoHref} className="text-sm text-[#396aa2]">
                [edit]
              </Link>
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {draft.inventionName || "None"}
            </p>
          </article>

          <article className="rounded-[20px] border border-slate-300 bg-white p-5">
            <p className="text-lg font-medium text-slate-900">
              Inventor Info Summary{" "}
              <Link href={editStepThreeHref} className="text-sm text-[#396aa2]">
                [add/edit]
              </Link>
            </p>
            {draft.inventor ? (
              <div className="mt-3 space-y-1 text-sm leading-7 text-slate-700">
                <p>
                  {draft.inventor.firstName} {draft.inventor.middleName}{" "}
                  {draft.inventor.lastName}
                </p>
                <p>{draft.inventor.address1}</p>
                {draft.inventor.address2 ? <p>{draft.inventor.address2}</p> : null}
                <p>
                  {draft.inventor.city}, {draft.inventor.state} {draft.inventor.zip}
                </p>
                <p>{draft.inventor.country}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-7 text-slate-700">None</p>
            )}
          </article>
        </div>

        <div className="space-y-5">
          <article className="rounded-[20px] border border-slate-300 bg-white p-5">
            <p className="text-sm text-slate-500">Order Description</p>
            <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-700">
              {orderLines.map((line) => (
                <div key={line.label} className="flex items-center justify-between gap-4">
                  <span>{line.label}</span>
                  <span>{line.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{totalLabel}</span>
              </div>
            </div>
          </article>

          <article className="rounded-[20px] border border-slate-300 bg-white p-5">
            <p className="text-lg font-medium text-slate-900">
              Assignee Info{" "}
              <Link href={editStepFourHref} className="text-sm text-[#396aa2]">
                [add/edit]
              </Link>
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {draft.assignmentRequired === "yes"
                ? "Assignment / transfer needed"
                : draft.assignmentRequired === "no"
                  ? "None"
                  : "Not answered yet"}
            </p>
          </article>
        </div>
      </div>

      <form action={action} className="flex flex-wrap justify-end gap-3 border-t border-slate-300 pt-4">
        <input type="hidden" name="serviceIntent" value={serviceIntent} />
        <input type="hidden" name="packageKey" value={packageKey ?? ""} />
        <input type="hidden" name="packageLabel" value={packageLabel ?? ""} />
        <Link
          href={previousHref}
          className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91]"
        >
          &lt; Previous
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save And Continue >"}
        </button>
      </form>
    </div>
  );
}
