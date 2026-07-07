"use client";

import { useActionState } from "react";

import { savePricingAction, type ContentActionState } from "@/app/actions/content";
import type { PricingRecord } from "@/lib/admin-content";

const initialState: ContentActionState = {};

function FieldError({
  errors,
  name,
}: {
  errors?: Record<string, string[]>;
  name: string;
}) {
  const message = errors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-1 text-[11px] text-red-600">{message}</p>;
}

export function AdminPricingForm({ record }: { record: PricingRecord }) {
  const [state, action, pending] = useActionState(savePricingAction, initialState);

  return (
    <form action={action} className="rounded-[14px] border border-[#e7d9cb] bg-white p-4">
      <input type="hidden" name="serviceKey" value={record.serviceKey} />
      <input type="hidden" name="packageKey" value={record.packageKey} />

      <div className="grid gap-3 md:grid-cols-[1.1fr_0.55fr_0.85fr_0.9fr_auto_auto_auto] md:items-start">
        <label className="block">
          <span className="text-[10px] font-bold uppercase text-[#6f6258]">
            Package
          </span>
          <input
            name="packageName"
            defaultValue={record.packageName}
            className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[13px] outline-none focus:border-[#fb4522]"
          />
          <FieldError errors={state.errors} name="packageName" />
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase text-[#6f6258]">
            Price
          </span>
          <input
            name="price"
            defaultValue={record.price}
            className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[13px] outline-none focus:border-[#fb4522]"
          />
          <FieldError errors={state.errors} name="price" />
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase text-[#6f6258]">
            Fee label
          </span>
          <input
            name="fee"
            defaultValue={record.fee}
            className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[13px] outline-none focus:border-[#fb4522]"
          />
          <FieldError errors={state.errors} name="fee" />
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase text-[#6f6258]">
            CTA
          </span>
          <input
            name="ctaLabel"
            defaultValue={record.ctaLabel}
            className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[13px] outline-none focus:border-[#fb4522]"
          />
          <FieldError errors={state.errors} name="ctaLabel" />
        </label>

        <label className="flex items-center gap-2 pt-6 text-[12px] font-bold text-[#241c17]">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={record.featured}
          />
          Featured
        </label>

        <label className="flex items-center gap-2 pt-6 text-[12px] font-bold text-[#241c17]">
          <input
            type="checkbox"
            name="active"
            value="true"
            defaultChecked={record.active}
          />
          Active
        </label>

        <button
          type="submit"
          disabled={pending}
          className="mt-5 rounded-[10px] bg-[#fb4522] px-4 py-2 text-[12px] font-bold text-white disabled:opacity-60 md:mt-5"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </div>

      {state.message ? (
        <p className="mt-3 rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-800">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
