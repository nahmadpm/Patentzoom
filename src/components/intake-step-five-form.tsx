"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  type IntakeActionState,
  saveStepFiveAction,
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

export function IntakeStepFiveForm({
  serviceIntent,
  packageKey,
  packageLabel,
  previousHref,
  inventionTitle,
  defaultDescription,
}: {
  serviceIntent: ServiceIntent;
  packageKey: string | null;
  packageLabel: string | null;
  previousHref: string;
  inventionTitle: string;
  defaultDescription: string;
}) {
  const [state, action, pending] = useActionState(saveStepFiveAction, initialState);

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

      <div className="space-y-6 border-t border-slate-300 pt-6">
        <div>
          <label className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-800">
            Invention Title
          </label>
          <div className="mt-2 border border-slate-300 bg-[#f0f2f6] px-4 py-3 text-sm text-slate-700">
            {inventionTitle || "New Invention"}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">Invention Details</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Fully describe your invention and include as much information and detail
            as possible. Information that you leave out will not be protected.
            Recommended prompts:
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-6 text-sm leading-7 text-slate-700">
            <li>What does the invention do?</li>
            <li>How does the invention work?</li>
            <li>
              What are the components of the invention or the steps used by the
              method/software?
            </li>
            <li>How are the components assembled or the process carried out?</li>
          </ol>
          <textarea
            name="description"
            defaultValue={defaultDescription}
            rows={8}
            className="mt-4 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
          />
          <FieldError errors={state.errors} name="description" />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-800">
            Upload Files
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Upload support for invention files is planned for the next phase.
            For now, include the important file details inside the description
            box above and keep your source material ready for the live
            engagement.
          </p>
          <div className="mt-4 rounded-[16px] border border-dashed border-slate-300 bg-[#f8f9fb] px-4 py-6 text-sm text-slate-500">
            File upload table placeholder. We will wire real uploads in the next
            implementation phase.
          </div>
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
