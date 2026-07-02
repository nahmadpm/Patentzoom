"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  type IntakeActionState,
  saveStepFiveAction,
} from "@/app/actions/intake";
import type { UploadedIntakeFile } from "@/lib/intake-upload-types";
import { type ServiceIntent } from "@/lib/service-intents";

const initialState: IntakeActionState = {};

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}

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
  uploadedFiles,
}: {
  serviceIntent: ServiceIntent;
  packageKey: string | null;
  packageLabel: string | null;
  previousHref: string;
  inventionTitle: string;
  defaultDescription: string;
  uploadedFiles: UploadedIntakeFile[];
}) {
  const [state, action, pending] = useActionState(saveStepFiveAction, initialState);

  return (
    <form action={action} encType="multipart/form-data" className="space-y-8">
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
            Attach supporting invention materials here. You can upload up to 10
            files per save, with a 20 MB limit per file.
          </p>
          <div className="mt-4 rounded-[16px] border border-dashed border-slate-300 bg-[#f8f9fb] px-4 py-5">
            <input
              type="file"
              name="attachments"
              multiple
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#fb4522] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#e63c18]"
            />
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Recommended for sketches, diagrams, draft specs, screenshots,
              PDFs, and invention notes.
            </p>
          </div>
          {uploadedFiles.length ? (
            <div className="mt-4 rounded-[16px] border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Uploaded with this draft
              </div>
              <ul className="divide-y divide-slate-200">
                {uploadedFiles.map((file) => (
                  <li
                    key={file.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{file.originalName}</p>
                      <p className="text-xs text-slate-500">
                        {file.mimeType || "File"} · {formatFileSize(file.size)}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">
                      Saved
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 rounded-[16px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
              No files have been uploaded to this intake yet.
            </div>
          )}
          {state.message?.toLowerCase().includes("upload") ? (
            <p className="mt-3 text-sm text-red-600">{state.message}</p>
          ) : null}
          <div className="mt-4 rounded-[16px] border border-[#fb4522]/12 bg-[#fff7f4] px-4 py-4 text-sm leading-7 text-slate-600">
            Save the step after choosing files so PatentZoom can store them with
            the current invention draft.
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
