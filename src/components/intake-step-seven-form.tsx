"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  type IntakeActionState,
  saveStepSevenAction,
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

type PackageCard = {
  key: string;
  name: string;
  price: string;
  fee: string;
  bullets: readonly string[];
  featured?: boolean;
  badge?: string;
};

export function IntakeStepSevenForm({
  serviceIntent,
  previousHref,
  packages,
  defaultPackageKey,
  defaultPackageLabel,
  defaultSearchOption,
}: {
  serviceIntent: ServiceIntent;
  previousHref: string;
  packages: readonly PackageCard[];
  defaultPackageKey: string | null;
  defaultPackageLabel: string | null;
  defaultSearchOption:
    | "none"
    | "patent-search-report"
    | "review-existing-search-report";
}) {
  const [state, action, pending] = useActionState(saveStepSevenAction, initialState);
  const [selectedPackageKey, setSelectedPackageKey] = useState<string>(
    defaultPackageKey ?? packages[0]?.key ?? "",
  );
  const [selectedPackageLabel, setSelectedPackageLabel] = useState<string>(
    defaultPackageLabel ?? packages[0]?.name ?? "",
  );
  const [searchOption, setSearchOption] = useState(defaultSearchOption);

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="serviceIntent" value={serviceIntent} />
      <input type="hidden" name="selectedPackageKey" value={selectedPackageKey} />
      <input type="hidden" name="selectedPackageLabel" value={selectedPackageLabel} />
      <input type="hidden" name="searchOption" value={searchOption} />

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
        <div className="grid gap-5 lg:grid-cols-3">
          {packages.map((item) => {
            const isSelected = selectedPackageKey === item.key;

            return (
              <article
                key={item.key}
                className={`relative border px-5 py-6 text-center ${
                  item.featured
                    ? "border-[#79c8ec] bg-[#79c8ec]"
                    : "border-slate-200 bg-[#edf2fb]"
                }`}
              >
                {item.badge ? (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 bg-[#fb1a0d] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {item.badge}
                  </span>
                ) : null}
                <h3 className="mt-2 text-[1.9rem] font-medium leading-tight tracking-[-0.04em] text-slate-950">
                  {item.name}
                </h3>
                <p className="mt-4 text-[3.2rem] font-light leading-none tracking-[-0.07em] text-slate-950">
                  {item.price}
                </p>
                <p className="mt-2 text-sm text-slate-700">{item.fee}</p>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPackageKey(item.key);
                    setSelectedPackageLabel(item.name);
                  }}
                  className={`mt-5 w-full rounded-[12px] px-4 py-3 text-sm font-semibold uppercase tracking-[0.06em] ${
                    isSelected
                      ? "bg-[#243551] text-white"
                      : "bg-white text-[#25306b]"
                  }`}
                >
                  {isSelected ? "Selected" : `Select ${item.name}`}
                </button>

                <ul className="mt-5 space-y-3 border-t border-slate-300/80 pt-5 text-left">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#66c96a] text-[10px] font-semibold uppercase text-white">
                        OK
                      </span>
                      <span className="text-sm leading-6 text-slate-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <FieldError errors={state.errors} name="packageKey" />
        <FieldError errors={state.errors} name="packageLabel" />

        <div className="rounded-[18px] border border-[#25306b] bg-[#f8fbff] p-5">
          <p className="text-sm font-semibold text-[#25306b]">Select Patent Search</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            A patent search can help reduce risk and shape the right filing path
            before the application is prepared. Choose the option that best
            matches your current status.
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                checked={searchOption === "none"}
                onChange={() => setSearchOption("none")}
                className="mt-1 h-4 w-4 border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
              />
              <span>No Patent Search Report</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="radio"
                checked={searchOption === "patent-search-report"}
                onChange={() => setSearchOption("patent-search-report")}
                className="mt-1 h-4 w-4 border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
              />
              <span>Patent Search Report</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="radio"
                checked={searchOption === "review-existing-search-report"}
                onChange={() => setSearchOption("review-existing-search-report")}
                className="mt-1 h-4 w-4 border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
              />
              <span>Review Existing Search Report</span>
            </label>
          </div>
          <FieldError errors={state.errors} name="searchOption" />
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
