"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  type IntakeActionState,
  saveStepFourAction,
} from "@/app/actions/intake";
import { type ServiceIntent } from "@/lib/service-intents";

const initialState: IntakeActionState = {};

function FieldError({
  errors,
  name,
}: {
  errors: IntakeActionState["errors"];
  name: string;
}) {
  const message = errors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

export function IntakeStepFourForm({
  serviceIntent,
  packageKey,
  packageLabel,
  previousHref,
  defaultValue,
}: {
  serviceIntent: ServiceIntent;
  packageKey: string | null;
  packageLabel: string | null;
  previousHref: string;
  defaultValue: "yes" | "no" | null;
}) {
  const [state, action, pending] = useActionState(saveStepFourAction, initialState);

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="serviceIntent" value={serviceIntent} />
      <input type="hidden" name="packageKey" value={packageKey ?? ""} />
      <input type="hidden" name="packageLabel" value={packageLabel ?? ""} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          name="intent"
          value="save"
          disabled={pending}
          className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91] disabled:cursor-not-allowed disabled:opacity-70"
        >
          Save For Later
        </button>

        <div className="flex flex-wrap gap-3">
          <Link
            href={previousHref}
            className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91]"
          >
            &lt; Previous
          </Link>
          <button
            type="submit"
            name="intent"
            value="continue"
            disabled={pending}
            className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Saving..." : "Save and Continue >"}
          </button>
        </div>
      </div>

      {state.message ? (
        <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}

      <div className="space-y-5 border-t border-slate-300 pt-6 text-sm leading-8 text-slate-700">
        <p>
          Do you need to assign / transfer ownership of the patent to another
          person(s) or business? Please select yes if any of the circumstances
          below are true, otherwise select no.
        </p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            You want to transfer all or partial ownership of the patent to
            someone who is not an inventor.
          </li>
          <li>
            You want to transfer all or partial ownership of the patent to your
            business entity, such as your LLC or corporation.
          </li>
          <li>
            You need to transfer all or partial ownership of the patent to an
            employer.
          </li>
        </ol>

        <div className="pt-2">
          <div className="flex flex-wrap gap-5">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="assignmentRequired"
                value="no"
                defaultChecked={defaultValue === "no"}
                className="h-4 w-4 border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
              />
              No
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="assignmentRequired"
                value="yes"
                defaultChecked={defaultValue === "yes"}
                className="h-4 w-4 border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
              />
              Yes
            </label>
          </div>
          <FieldError errors={state.errors} name="assignmentRequired" />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-300 pt-4">
        <Link
          href={previousHref}
          className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91]"
        >
          &lt; Previous
        </Link>
        <button
          type="submit"
          name="intent"
          value="continue"
          disabled={pending}
          className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save and Continue >"}
        </button>
      </div>
    </form>
  );
}
