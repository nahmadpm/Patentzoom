"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  type IntakeActionState,
  saveStepThreeAction,
} from "@/app/actions/intake";
import { type IntakeDraft } from "@/lib/auth";
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

type InventorFormValues = NonNullable<IntakeDraft["inventor"]>;

export function IntakeStepThreeForm({
  serviceIntent,
  packageKey,
  packageLabel,
  previousHref,
  profileDefaults,
  defaultValues,
}: {
  serviceIntent: ServiceIntent;
  packageKey: string | null;
  packageLabel: string | null;
  previousHref: string;
  profileDefaults: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
  };
  defaultValues: InventorFormValues;
}) {
  const [state, action, pending] = useActionState(saveStepThreeAction, initialState);
  const [formValues, setFormValues] = useState<InventorFormValues>(defaultValues);
  const [useProfileInfo, setUseProfileInfo] = useState(false);

  function updateField<K extends keyof InventorFormValues>(
    field: K,
    value: InventorFormValues[K],
  ) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleAutofillChange(checked: boolean) {
    setUseProfileInfo(checked);

    if (!checked) {
      return;
    }

    setFormValues((current) => ({
      ...current,
      firstName: profileDefaults.firstName || current.firstName,
      lastName: profileDefaults.lastName || current.lastName,
      address1: profileDefaults.address1 || current.address1,
      address2: profileDefaults.address2 || current.address2,
      city: profileDefaults.city || current.city,
      state: profileDefaults.state || current.state,
      zip: profileDefaults.zip || current.zip,
      country: profileDefaults.country || current.country,
      email: profileDefaults.email || current.email,
    }));
  }

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
          <p className="text-sm leading-7 text-slate-700">
            <span className="font-semibold text-[#25306b]">Inventor 1</span> - Enter
            legal name for all inventors. An inventor is someone who has contributed
            to the invention.
          </p>
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={useProfileInfo}
              onChange={(event) => handleAutofillChange(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
            />
            Auto fill my information
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
              First Name <span className="text-[#fb4522]">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              value={formValues.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
            />
            <FieldError errors={state.errors} name="firstName" />
          </div>
          <div>
            <label htmlFor="middleName" className="text-sm font-medium text-slate-700">
              Middle Name
            </label>
            <input
              id="middleName"
              name="middleName"
              value={formValues.middleName}
              onChange={(event) => updateField("middleName", event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
            />
            <FieldError errors={state.errors} name="middleName" />
          </div>
          <div>
            <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
              Last Name <span className="text-[#fb4522]">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              value={formValues.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
            />
            <FieldError errors={state.errors} name="lastName" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label htmlFor="address1" className="text-sm font-medium text-slate-700">
              Address 1 of residence <span className="text-[#fb4522]">*</span>
            </label>
            <input
              id="address1"
              name="address1"
              value={formValues.address1}
              onChange={(event) => updateField("address1", event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
            />
            <FieldError errors={state.errors} name="address1" />
          </div>
          <div>
            <label htmlFor="address2" className="text-sm font-medium text-slate-700">
              Address 2 of residence
            </label>
            <input
              id="address2"
              name="address2"
              value={formValues.address2}
              onChange={(event) => updateField("address2", event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
            />
            <FieldError errors={state.errors} name="address2" />
          </div>
          <div>
            <label htmlFor="city" className="text-sm font-medium text-slate-700">
              City of residence <span className="text-[#fb4522]">*</span>
            </label>
            <input
              id="city"
              name="city"
              value={formValues.city}
              onChange={(event) => updateField("city", event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
            />
            <FieldError errors={state.errors} name="city" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label htmlFor="state" className="text-sm font-medium text-slate-700">
              State / Province of residence <span className="text-[#fb4522]">*</span>
            </label>
            <input
              id="state"
              name="state"
              value={formValues.state}
              onChange={(event) => updateField("state", event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
            />
            <FieldError errors={state.errors} name="state" />
          </div>
          <div>
            <label htmlFor="zip" className="text-sm font-medium text-slate-700">
              Zip / Postal Code of residence <span className="text-[#fb4522]">*</span>
            </label>
            <input
              id="zip"
              name="zip"
              value={formValues.zip}
              onChange={(event) => updateField("zip", event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
            />
            <FieldError errors={state.errors} name="zip" />
          </div>
          <div>
            <label htmlFor="country" className="text-sm font-medium text-slate-700">
              Country of residence <span className="text-[#fb4522]">*</span>
            </label>
            <input
              id="country"
              name="country"
              value={formValues.country}
              onChange={(event) => updateField("country", event.target.value)}
              className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
            />
            <FieldError errors={state.errors} name="country" />
          </div>
        </div>

        <div className="max-w-[20rem]">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4db8f5] focus:shadow-[0_0_0_4px_rgba(77,184,245,0.14)]"
          />
          <FieldError errors={state.errors} name="email" />
        </div>

        <div>
          <p className="text-sm leading-7 text-slate-700">
            <span className="font-semibold text-[#fb4522]">*</span> Has the inventor
            previously applied for more than 4 full patent applications in the US?
          </p>
          <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-700">
            {[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "not-sure", label: "Not sure right now, ask me later" },
            ].map((option) => (
              <label key={option.value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="filedMoreThanFour"
                  value={option.value}
                  checked={formValues.filedMoreThanFour === option.value}
                  onChange={(event) =>
                    updateField(
                      "filedMoreThanFour",
                      event.target.value as InventorFormValues["filedMoreThanFour"],
                    )
                  }
                  className="h-4 w-4 border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
                />
                {option.label}
              </label>
            ))}
          </div>
          <FieldError errors={state.errors} name="filedMoreThanFour" />
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
