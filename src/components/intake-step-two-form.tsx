"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  type IntakeActionState,
  saveStepTwoAction,
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

export function IntakeStepTwoForm({
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
  defaultValue: string;
}) {
  const [state, action, pending] = useActionState(saveStepTwoAction, initialState);

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

      <div className="space-y-4 border-t border-slate-300 pt-8">
        <p className="text-sm leading-7 text-slate-700">
          <span className="font-semibold text-[#fb4522]">*</span> Give your invention a
          name so we can refer to it later.
        </p>
        <p className="text-sm leading-7 text-slate-600">
          You can change this later. Invention names should be generic, and not a
          unique trade name. For example, instead of writing &quot;iPhone&quot; you would
          write &quot;Cellular Phone&quot;.
        </p>

        <div>
          <label
            htmlFor="inventionName"
            className="text-sm font-medium text-slate-700"
          >
            Create New Invention <span className="text-[#fb4522]">*</span>
          </label>
          <input
            id="inventionName"
            name="inventionName"
            defaultValue={defaultValue}
            className="mt-3 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
          />
          <FieldError errors={state.errors} name="inventionName" />
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
