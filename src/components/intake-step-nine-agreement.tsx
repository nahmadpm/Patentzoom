"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  saveStepNineAction,
  type IntakeActionState,
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

function SignatureModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const drawingRef = useRef(false);
  const [hasStroke, setHasStroke] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = wrapper.clientWidth;
    const height = 240;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.scale(ratio, ratio);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#25306b";
    context.lineWidth = 2.5;
    setHasStroke(false);
  }, [open]);

  if (!open) {
    return null;
  }

  function getPosition(event: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function startDrawing(event: ReactPointerEvent<HTMLCanvasElement>) {
    const context = canvasRef.current?.getContext("2d");

    if (!context) {
      return;
    }

    const position = getPosition(event);
    drawingRef.current = true;
    context.beginPath();
    context.moveTo(position.x, position.y);
    setHasStroke(true);
  }

  function draw(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) {
      return;
    }

    const context = canvasRef.current?.getContext("2d");

    if (!context) {
      return;
    }

    const position = getPosition(event);
    context.lineTo(position.x, position.y);
    context.stroke();
  }

  function stopDrawing() {
    drawingRef.current = false;
  }

  function resetCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;
    context.scale(ratio, ratio);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#25306b";
    context.lineWidth = 2.5;
    setHasStroke(false);
  }

  function submitSignature() {
    if (!hasStroke || !canvasRef.current) {
      return;
    }

    onSubmit(canvasRef.current.toDataURL("image/png"));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4">
      <div className="relative w-full max-w-[780px] rounded-[22px] border border-slate-300 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900"
          aria-label="Close signature modal"
        >
          ×
        </button>
        <div className="border-b border-slate-200 px-8 py-6">
          <p className="max-w-2xl text-base leading-7 text-[#25306b]">
            Hold down your mouse key and draw your signature. On touch devices,
            use your finger to sign.
          </p>
        </div>
        <div ref={wrapperRef} className="px-8 py-6">
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            className="w-full cursor-crosshair rounded-[18px] border border-slate-300 bg-white"
          />
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-8 py-4">
          <button
            type="button"
            onClick={resetCanvas}
            className="inline-flex rounded-[10px] border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={submitSignature}
            disabled={!hasStroke}
            className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Submit Signature
          </button>
        </div>
      </div>
    </div>
  );
}

export function IntakeStepNineAgreement({
  serviceIntent,
  serviceLabel,
  packageKey,
  packageLabel,
  currentHref,
  previousHref,
  signerName,
  signerEmail,
  signerPhone,
  signerAddress,
  draft,
  orderLines,
  totalLabel,
}: {
  serviceIntent: ServiceIntent;
  serviceLabel: string;
  packageKey: string | null;
  packageLabel: string | null;
  currentHref: string;
  previousHref: string;
  signerName: string;
  signerEmail: string;
  signerPhone: string;
  signerAddress: string;
  draft: IntakeDraft;
  orderLines: readonly {
    label: string;
    value: string;
  }[];
  totalLabel: string;
}) {
  const [state, action, pending] = useActionState(saveStepNineAction, initialState);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(
    draft.engagementAgreement?.signatureDataUrl ?? "",
  );
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const signed = Boolean(signatureDataUrl);
  const signedTimestamp = useMemo(
    () =>
      draft.engagementAgreement?.signedAt
        ? new Date(draft.engagementAgreement.signedAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : null,
    [draft.engagementAgreement?.signedAt],
  );

  function handleSignatureSubmit(value: string) {
    setSignatureDataUrl(value);
    setShowSignatureModal(false);
  }

  useEffect(() => {
    if (signed) {
      titleInputRef.current?.focus();
    }
  }, [signed]);

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-8">
        <input type="hidden" name="serviceIntent" value={serviceIntent} />
        <input type="hidden" name="packageKey" value={packageKey ?? ""} />
        <input type="hidden" name="packageLabel" value={packageLabel ?? ""} />
        <input type="hidden" name="signerName" value={signerName} />
        <input type="hidden" name="signatureDataUrl" value={signatureDataUrl} />
        <input type="hidden" name="agreementAccepted" value={signed ? "true" : "false"} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={currentHref}
            className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91]"
          >
            Save For Later
          </Link>
          <div className="rounded-full border border-[#25306b]/10 bg-[#f5f8ff] px-4 py-2 text-sm text-[#25306b]">
            {signed ? "Agreement signed" : "1 area remaining to sign"}
          </div>
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
              {pending ? "Saving..." : "Save And Continue >"}
            </button>
          </div>
        </div>

        {state.message ? (
          <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </div>
        ) : null}

        <div className="rounded-[22px] border border-slate-200 bg-[#fbfcff] px-5 py-4 text-sm leading-7 text-slate-700">
          Please review the engagement terms below and sign as the client before moving into payment details.
        </div>

        <div className="space-y-6">
          <article className="rounded-[28px] border border-slate-300 bg-white px-8 py-10 shadow-[0_18px_60px_rgba(15,23,42,0.07)]">
            <div className="flex flex-wrap items-start justify-between gap-8 border-b border-slate-200 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                  PatentZoom
                </p>
                <h2 className="mt-3 text-[1.8rem] font-light tracking-[-0.04em] text-[#25306b]">
                  {serviceLabel} engagement agreement
                </h2>
              </div>
              <div className="text-right text-sm leading-7 text-slate-600">
                <p>{signerAddress}</p>
                <p>{signerPhone}</p>
                <p>{signerEmail}</p>
              </div>
            </div>

            <div className="mt-8 space-y-8 text-[15px] leading-8 text-slate-700">
              <section>
                <p className="font-semibold uppercase tracking-[0.14em] text-[#25306b]">
                  1. Overview
                </p>
                <p className="mt-3">
                  This agreement confirms that PatentZoom will begin the selected
                  {packageLabel ? ` ${packageLabel}` : ""} {serviceLabel.toLowerCase()} matter
                  for the client identified below, subject to the package, scope,
                  and intake information already saved in this wizard.
                </p>
              </section>

              <section>
                <p className="font-semibold uppercase tracking-[0.14em] text-[#25306b]">
                  2. Fixed fee and scope
                </p>
                <div className="mt-4 overflow-hidden rounded-[18px] border border-slate-200">
                  <div className="grid grid-cols-[1.5fr_0.7fr] bg-[#f8f9fb] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <span>Order description</span>
                    <span className="text-right">Cost</span>
                  </div>
                  {orderLines.map((line) => (
                    <div
                      key={line.label}
                      className="grid grid-cols-[1.5fr_0.7fr] border-t border-slate-200 px-4 py-3 text-sm text-slate-700"
                    >
                      <span>{line.label}</span>
                      <span className="text-right">{line.value}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-[1.5fr_0.7fr] border-t border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">
                    <span>Total</span>
                    <span className="text-right">{totalLabel}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Work outside the selected package or later prosecution stages can be scoped separately if needed.
                </p>
              </section>

              <section>
                <p className="font-semibold uppercase tracking-[0.14em] text-[#25306b]">
                  3. Client responsibilities
                </p>
                <p className="mt-3">
                  You agree to provide accurate invention details, ownership information,
                  disclosure history, and supporting materials so PatentZoom can prepare
                  the filing or search work using the best available facts.
                </p>
              </section>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-300 bg-white px-8 py-10 shadow-[0_18px_60px_rgba(15,23,42,0.07)]">
            <div className="space-y-8 text-[15px] leading-8 text-slate-700">
              <section>
                <p className="font-semibold uppercase tracking-[0.14em] text-[#25306b]">
                  4. Search and filing limitations
                </p>
                <p className="mt-3">
                  Patent searches, drafting support, and filing strategy improve decision-making,
                  but they do not guarantee allowance, enforceability, or freedom to operate.
                  Patent offices and third-party rights can still affect the final outcome.
                </p>
              </section>

              <section>
                <p className="font-semibold uppercase tracking-[0.14em] text-[#25306b]">
                  5. Additional work
                </p>
                <p className="mt-3">
                  If the matter expands beyond the agreed package, PatentZoom may recommend
                  additional drafting, response, filing, or advisory work. Any expanded scope
                  will be discussed before that work begins.
                </p>
              </section>

              <section>
                <p className="font-semibold uppercase tracking-[0.14em] text-[#25306b]">
                  6. Communication and confidentiality
                </p>
                <p className="mt-3">
                  PatentZoom will treat intake information as confidential within the ordinary
                  course of legal-service handling and will communicate using the contact
                  details saved in your account unless you ask for updated routing.
                </p>
              </section>

              <section>
                <p className="font-semibold uppercase tracking-[0.14em] text-[#25306b]">
                  7. Billing and cancellation
                </p>
                <p className="mt-3">
                  Government fees, optional search work, or future prosecution work may be billed
                  separately where applicable. If the matter is paused or cancelled, completed work
                  already performed remains billable to the extent permitted by the agreed scope.
                </p>
              </section>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-300 bg-white px-8 py-10 shadow-[0_18px_60px_rgba(15,23,42,0.07)]">
            <div className="space-y-8 text-[15px] leading-8 text-slate-700">
              <section>
                <p className="font-semibold uppercase tracking-[0.14em] text-[#25306b]">
                  8. Acknowledgement
                </p>
                <p className="mt-3">
                  By signing below, you confirm that you reviewed these engagement terms,
                  understand the saved order summary, and authorize PatentZoom to proceed
                  with the selected service path.
                </p>
              </section>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[22px] border border-slate-200 bg-[#fcfcfd] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                    Client signature
                  </p>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Client name
                      </label>
                      <div className="mt-2 rounded-[16px] border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900">
                        {signerName}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="signerTitle"
                        className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500"
                      >
                        Title
                      </label>
                      <input
                        id="signerTitle"
                        name="signerTitle"
                        ref={titleInputRef}
                        defaultValue={draft.engagementAgreement?.signerTitle ?? ""}
                        disabled={!signed}
                        className={`mt-2 w-full rounded-[16px] border px-4 py-3 outline-none transition ${
                          signed
                            ? "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                            : "border-slate-200 bg-slate-100 text-slate-400"
                        }`}
                      />
                      <FieldError errors={state.errors} name="signerTitle" />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500"
                      >
                        Company
                      </label>
                      <input
                        id="company"
                        name="company"
                        defaultValue={draft.engagementAgreement?.company ?? ""}
                        disabled={!signed}
                        className={`mt-2 w-full rounded-[16px] border px-4 py-3 outline-none transition ${
                          signed
                            ? "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                            : "border-slate-200 bg-slate-100 text-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-6 rounded-[18px] border border-dashed border-[#fb4522]/35 bg-[#fff7f4] p-5">
                    <button
                      type="button"
                      onClick={() => setShowSignatureModal(true)}
                      className={`inline-flex rounded-[14px] px-5 py-3 text-sm font-semibold transition ${
                        signed
                          ? "bg-[#25306b] text-white hover:bg-[#1d254f]"
                          : "bg-[#ffd24a] text-[#9a260e] hover:bg-[#ffcb2a]"
                      }`}
                    >
                      {signed ? "Edit Signature" : "Click Here To Sign"}
                    </button>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {signed
                        ? `Signature captured for ${signerName}${signedTimestamp ? ` on ${signedTimestamp}` : ""}.`
                        : "Open the signature box, draw the client signature, and submit it here before continuing."}
                    </p>
                    {!signed ? (
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        Title and company fields unlock after the signature is submitted.
                      </p>
                    ) : null}
                    <FieldError errors={state.errors} name="agreementAccepted" />
                    <FieldError errors={state.errors} name="signatureDataUrl" />

                    {signatureDataUrl ? (
                      <div className="mt-5 rounded-[16px] border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Saved signature preview
                        </p>
                        <Image
                          src={signatureDataUrl}
                          alt="Client signature preview"
                          width={720}
                          height={96}
                          unoptimized
                          className="mt-3 h-24 w-full rounded-[12px] object-contain"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-[#f8f9fb] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                    Saved intake summary
                  </p>
                  <div className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                    <p>
                      <span className="font-semibold text-[#25306b]">Service:</span>{" "}
                      {serviceLabel}
                    </p>
                    <p>
                      <span className="font-semibold text-[#25306b]">Package:</span>{" "}
                      {draft.packageLabel ?? packageLabel ?? "Not selected"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#25306b]">Invention:</span>{" "}
                      {draft.inventionName || "Not named yet"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#25306b]">Signer email:</span>{" "}
                      {signerEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
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
            {pending ? "Saving..." : "Save And Continue >"}
          </button>
        </div>
      </form>

      <SignatureModal
        open={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSubmit={handleSignatureSubmit}
      />
    </div>
  );
}
