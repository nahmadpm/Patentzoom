"use client";

import { FormEvent, useState } from "react";

const initialState = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactPageForm() {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    const composedMessage = formData.subject.trim()
      ? `Subject: ${formData.subject.trim()}\n\n${formData.message.trim()}`
      : formData.message.trim();

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: composedMessage,
        }),
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <input
          required
          value={formData.name}
          onChange={(event) =>
            setFormData((current) => ({ ...current, name: event.target.value }))
          }
          className="h-14 w-full border border-slate-300 bg-white px-4 text-[16px] text-slate-800 outline-none transition focus:border-[#25306b]"
          placeholder="Name *"
          autoComplete="name"
        />
        <input
          value={formData.phone}
          onChange={(event) =>
            setFormData((current) => ({ ...current, phone: event.target.value }))
          }
          className="h-14 w-full border border-slate-300 bg-white px-4 text-[16px] text-slate-800 outline-none transition focus:border-[#25306b]"
          placeholder="Phone Number"
          autoComplete="tel"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <input
          required
          type="email"
          value={formData.email}
          onChange={(event) =>
            setFormData((current) => ({ ...current, email: event.target.value }))
          }
          className="h-14 w-full border border-slate-300 bg-white px-4 text-[16px] text-slate-800 outline-none transition focus:border-[#25306b]"
          placeholder="Email Address *"
          autoComplete="email"
        />
        <input
          value={formData.subject}
          onChange={(event) =>
            setFormData((current) => ({ ...current, subject: event.target.value }))
          }
          className="h-14 w-full border border-slate-300 bg-white px-4 text-[16px] text-slate-800 outline-none transition focus:border-[#25306b]"
          placeholder="Subject"
        />
      </div>

      <textarea
        required
        value={formData.message}
        onChange={(event) =>
          setFormData((current) => ({ ...current, message: event.target.value }))
        }
        className="min-h-[170px] w-full border border-slate-300 bg-white px-4 py-4 text-[16px] text-slate-800 outline-none transition focus:border-[#25306b]"
        placeholder="Message *"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex min-w-[220px] items-center justify-center bg-[#3f6fa6] px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#355f8f] disabled:cursor-not-allowed disabled:bg-[#3f6fa6]/60"
        >
          {status === "loading" ? "Submitting..." : "Submit"}
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
