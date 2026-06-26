"use client";

import { FormEvent, useState } from "react";

const initialState = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export function LeadForm({
  compact = false,
  id,
}: {
  compact?: boolean;
  id?: string;
}) {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus("success");
      setFeedback(data.message || "Thanks. We will reach out shortly.");
      setFormData(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "We could not submit the form right now.",
      );
    }
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={`rounded-[2rem] border border-white/10 bg-white p-6 text-slate-950 shadow-[0_24px_80px_rgba(8,15,37,0.16)] ${
        compact ? "space-y-4" : "space-y-5"
      }`}
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
          Free consultation
        </p>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
          Tell us what you are building
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          Share the invention, stage, or deadline you are facing. This starter
          form is ready for CRM and email routing in the next integration step.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Full name
          <input
            required
            value={formData.name}
            onChange={(event) =>
              setFormData((current) => ({ ...current, name: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white"
            name="name"
            autoComplete="name"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Work email
          <input
            required
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((current) => ({ ...current, email: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white"
            name="email"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Company or startup
        <input
          value={formData.company}
          onChange={(event) =>
            setFormData((current) => ({ ...current, company: event.target.value }))
          }
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white"
          name="company"
          autoComplete="organization"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        What do you need help protecting?
        <textarea
          required
          value={formData.message}
          onChange={(event) =>
            setFormData((current) => ({ ...current, message: event.target.value }))
          }
          className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white"
          name="message"
        />
      </label>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {status === "loading" ? "Sending..." : "Request consultation"}
        </button>
        <p
          className={`min-h-6 text-sm ${
            status === "error" ? "text-red-600" : "text-slate-600"
          }`}
        >
          {feedback}
        </p>
      </div>
    </form>
  );
}
