"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  type IntakeActionState,
  saveStepSixAction,
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

export function IntakeStepSixForm({
  serviceIntent,
  packageKey,
  packageLabel,
  previousHref,
  defaultValues,
}: {
  serviceIntent: ServiceIntent;
  packageKey: string | null;
  packageLabel: string | null;
  previousHref: string;
  defaultValues: {
    publicDisclosure: string;
    priorApplications: string;
    competitors: string;
    governmentContract: "yes" | "no";
  };
}) {
  const [state, action, pending] = useActionState(saveStepSixAction, initialState);

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

      <div className="space-y-5 border-t border-slate-300 pt-6">
        <div>
          <label className="text-sm font-medium text-slate-700">
            1) List the date and location you first showed your invention to the
            public or made it available for sale <span className="text-[#fb4522]">*</span>
          </label>
          <textarea
            name="publicDisclosure"
            defaultValue={defaultValues.publicDisclosure}
            rows={4}
            className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
          />
          <FieldError errors={state.errors} name="publicDisclosure" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            2) List any patent applications you filed, but not through us, for
            the invention or a similar invention <span className="text-[#fb4522]">*</span>
          </label>
          <textarea
            name="priorApplications"
            defaultValue={defaultValues.priorApplications}
            rows={4}
            className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
          />
          <FieldError errors={state.errors} name="priorApplications" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            3) List any companies or individuals you are aware of who are your
            competitors <span className="text-[#fb4522]">*</span>
          </label>
          <textarea
            name="competitors"
            defaultValue={defaultValues.competitors}
            rows={4}
            className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
          />
          <FieldError errors={state.errors} name="competitors" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">
            4) Was the invention made by an agency of the United States
            Government or under a contract with an agency of the United States
            Government? <span className="text-[#fb4522]">*</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-700">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="governmentContract"
                value="no"
                defaultChecked={defaultValues.governmentContract === "no"}
                className="h-4 w-4 border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
              />
              No
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="governmentContract"
                value="yes"
                defaultChecked={defaultValues.governmentContract === "yes"}
                className="h-4 w-4 border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
              />
              Yes
            </label>
          </div>
          <FieldError errors={state.errors} name="governmentContract" />
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
