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
  saveStepTenAction,
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
    const height = 220;
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
      <div className="relative w-full max-w-[760px] rounded-[22px] border border-slate-300 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
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

export function IntakeStepTenPayment({
  serviceIntent,
  packageKey,
  packageLabel,
  currentHref,
  previousHref,
  caseNumber,
  profileDefaults,
  draft,
  orderLines,
  subtotalLabel,
  ccFeeLabel,
  totalLabel,
}: {
  serviceIntent: ServiceIntent;
  packageKey: string | null;
  packageLabel: string | null;
  currentHref: string;
  previousHref: string;
  caseNumber: string;
  profileDefaults: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  draft: IntakeDraft;
  orderLines: readonly {
    label: string;
    value: string;
  }[];
  subtotalLabel: string;
  ccFeeLabel: string;
  totalLabel: string;
}) {
  const [state, action, pending] = useActionState(saveStepTenAction, initialState);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [billingSameAsProfile, setBillingSameAsProfile] = useState(
    draft.paymentInformation?.billingSameAsProfile ?? true,
  );
  const [authorizationSignatureDataUrl, setAuthorizationSignatureDataUrl] = useState(
    draft.paymentInformation?.authorizationSignatureDataUrl ?? "",
  );
  const [billingFirstName, setBillingFirstName] = useState(
    draft.paymentInformation?.billingFirstName ??
      profileDefaults.firstName,
  );
  const [billingLastName, setBillingLastName] = useState(
    draft.paymentInformation?.billingLastName ??
      profileDefaults.lastName,
  );
  const [billingAddress1, setBillingAddress1] = useState(
    draft.paymentInformation?.billingAddress1 ??
      profileDefaults.address1,
  );
  const [billingAddress2, setBillingAddress2] = useState(
    draft.paymentInformation?.billingAddress2 ??
      profileDefaults.address2,
  );
  const [billingCity, setBillingCity] = useState(
    draft.paymentInformation?.billingCity ??
      profileDefaults.city,
  );
  const [billingState, setBillingState] = useState(
    draft.paymentInformation?.billingState ??
      profileDefaults.state,
  );
  const [billingZip, setBillingZip] = useState(
    draft.paymentInformation?.billingZip ??
      profileDefaults.zip,
  );
  const [billingCountry, setBillingCountry] = useState(
    draft.paymentInformation?.billingCountry ??
      profileDefaults.country,
  );

  useEffect(() => {
    if (!billingSameAsProfile) {
      return;
    }

    setBillingFirstName(profileDefaults.firstName);
    setBillingLastName(profileDefaults.lastName);
    setBillingAddress1(profileDefaults.address1);
    setBillingAddress2(profileDefaults.address2);
    setBillingCity(profileDefaults.city);
    setBillingState(profileDefaults.state);
    setBillingZip(profileDefaults.zip);
    setBillingCountry(profileDefaults.country);
  }, [billingSameAsProfile, profileDefaults]);

  const authorizationTimestamp = useMemo(
    () =>
      draft.paymentInformation?.authorizedAt
        ? new Date(draft.paymentInformation.authorizedAt).toLocaleDateString("en-US")
        : new Date().toLocaleDateString("en-US"),
    [draft.paymentInformation?.authorizedAt],
  );

  function handleAuthorizationSignature(value: string) {
    setAuthorizationSignatureDataUrl(value);
    setShowSignatureModal(false);
  }

  const paymentState = draft.paymentInformation?.stripeCheckoutStatus ?? null;
  const paymentStateLabel =
    paymentState === "paid"
      ? "Paid"
      : paymentState === "pending"
        ? "Checkout started"
        : paymentState === "expired"
          ? "Expired"
          : paymentState === "failed"
            ? "Failed"
            : "Ready for payment";

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-8">
        <input type="hidden" name="serviceIntent" value={serviceIntent} />
        <input type="hidden" name="packageKey" value={packageKey ?? ""} />
        <input type="hidden" name="packageLabel" value={packageLabel ?? ""} />
        <input
          type="hidden"
          name="billingSameAsProfile"
          value={billingSameAsProfile ? "true" : "false"}
        />
        <input
          type="hidden"
          name="authorizationSignatureDataUrl"
          value={authorizationSignatureDataUrl}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={currentHref}
            className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91]"
          >
            Save For Later
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link
              href={previousHref}
              className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91]"
            >
              &lt; Previous
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Opening Stripe..." : "Continue to Secure Checkout >"}
            </button>
          </div>
        </div>

        {state.message ? (
          <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </div>
        ) : null}

        <div className="border-t border-slate-200 pt-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Secure payment handoff
          </p>
          <div className="mt-4 flex justify-center">
            <div className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white">
              Stripe Checkout
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
          <section className="rounded-[24px] border border-slate-200 bg-[#fbfbfd] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#25306b]">
              Stripe-hosted payment
            </p>
            <h3 className="mt-4 text-[1.9rem] font-light leading-9 tracking-[-0.04em] text-[#25306b]">
              PatentZoom will send you to Stripe for the actual card payment.
            </h3>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              This intake step now keeps billing details and authorization in
              PatentZoom, but all live card entry and payment capture happen on
              Stripe&apos;s secure checkout page.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Payment status
                </p>
                <p className="mt-2 text-lg font-medium text-[#25306b]">
                  {paymentStateLabel}
                </p>
              </div>
              <div className="rounded-[18px] border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Checkout method
                </p>
                <p className="mt-2 text-lg font-medium text-[#25306b]">
                  Credit or debit card
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[18px] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-700">
                What happens next
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li>1. Save this billing and authorization step inside your intake.</li>
                <li>2. Open the live Stripe Checkout page in a secure redirect.</li>
                <li>3. Return to PatentZoom automatically after payment succeeds.</li>
              </ul>
            </div>

            <div className="mt-6 rounded-[18px] border border-dashed border-[#396aa2]/30 bg-white p-5">
              <p className="text-sm font-semibold text-slate-700">
                Payment authorization signature
              </p>
              <button
                type="button"
                onClick={() => setShowSignatureModal(true)}
                className={`mt-4 inline-flex w-full items-center justify-center rounded-[12px] border px-4 py-3 text-sm font-medium transition ${
                  authorizationSignatureDataUrl
                    ? "border-[#396aa2] bg-[#396aa2] text-white hover:bg-[#2f5d91]"
                    : "border-slate-300 bg-[#f8f9fb] text-[#396aa2] hover:border-[#396aa2]"
                }`}
              >
                {authorizationSignatureDataUrl ? "Edit authorization signature" : "Click here to sign"}
              </button>
              <div className="mt-3 rounded-[12px] border border-slate-300 bg-[#f8f9fb] px-4 py-3 text-center text-sm text-slate-600">
                {authorizationTimestamp}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                PatentZoom stores this signature with the intake before handing
                payment over to Stripe.
              </p>
              <FieldError errors={state.errors} name="authorizationSignatureDataUrl" />

              {authorizationSignatureDataUrl ? (
                <div className="mt-4 rounded-[16px] border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Authorization signature preview
                  </p>
                  <Image
                    src={authorizationSignatureDataUrl}
                    alt="Authorization signature preview"
                    width={720}
                    height={96}
                    unoptimized
                    className="mt-3 h-24 w-full rounded-[12px] object-contain"
                  />
                </div>
              ) : null}
            </div>
          </section>

          <section className="space-y-6">
            <article className="rounded-[24px] border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Case number
                  </p>
                  <p className="mt-1 text-lg font-medium text-[#25306b]">
                    {caseNumber}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <span>Order description</span>
                  <span>Cost</span>
                </div>
                {orderLines.map((line) => (
                  <div key={line.label} className="flex items-center justify-between gap-4">
                    <span>{line.label}</span>
                    <span>{line.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4">
                  <span>Promo code?</span>
                  <span>-</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Sub total</span>
                  <span>{subtotalLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>CC fee</span>
                  <span>{ccFeeLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>{totalLabel}</span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                You&apos;ll review and pay this total on Stripe before PatentZoom
                marks the intake as complete.
              </p>
            </article>

            <article className="rounded-[24px] border border-slate-200 bg-[#fbfbfd] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#25306b]">
                  Billing address
                </p>
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={billingSameAsProfile}
                    onChange={(event) => setBillingSameAsProfile(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#396aa2] focus:ring-[#396aa2]"
                  />
                  Same as personal contact info
                </label>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="billingFirstName"
                    className="text-sm font-semibold text-slate-600"
                  >
                    First name
                  </label>
                  <input
                    id="billingFirstName"
                    name="billingFirstName"
                    value={billingFirstName}
                    onChange={(event) => setBillingFirstName(event.target.value)}
                    disabled={billingSameAsProfile}
                    className={`mt-2 w-full rounded-[14px] border px-4 py-3 outline-none transition ${
                      billingSameAsProfile
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                    }`}
                  />
                  <FieldError errors={state.errors} name="billingFirstName" />
                </div>

                <div>
                  <label
                    htmlFor="billingLastName"
                    className="text-sm font-semibold text-slate-600"
                  >
                    Last name
                  </label>
                  <input
                    id="billingLastName"
                    name="billingLastName"
                    value={billingLastName}
                    onChange={(event) => setBillingLastName(event.target.value)}
                    disabled={billingSameAsProfile}
                    className={`mt-2 w-full rounded-[14px] border px-4 py-3 outline-none transition ${
                      billingSameAsProfile
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                    }`}
                  />
                  <FieldError errors={state.errors} name="billingLastName" />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="billingAddress1"
                    className="text-sm font-semibold text-slate-600"
                  >
                    Address 1
                  </label>
                  <input
                    id="billingAddress1"
                    name="billingAddress1"
                    value={billingAddress1}
                    onChange={(event) => setBillingAddress1(event.target.value)}
                    disabled={billingSameAsProfile}
                    className={`mt-2 w-full rounded-[14px] border px-4 py-3 outline-none transition ${
                      billingSameAsProfile
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                    }`}
                  />
                  <FieldError errors={state.errors} name="billingAddress1" />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="billingAddress2"
                    className="text-sm font-semibold text-slate-600"
                  >
                    Address 2
                  </label>
                  <input
                    id="billingAddress2"
                    name="billingAddress2"
                    value={billingAddress2}
                    onChange={(event) => setBillingAddress2(event.target.value)}
                    disabled={billingSameAsProfile}
                    className={`mt-2 w-full rounded-[14px] border px-4 py-3 outline-none transition ${
                      billingSameAsProfile
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="billingCity"
                    className="text-sm font-semibold text-slate-600"
                  >
                    City
                  </label>
                  <input
                    id="billingCity"
                    name="billingCity"
                    value={billingCity}
                    onChange={(event) => setBillingCity(event.target.value)}
                    disabled={billingSameAsProfile}
                    className={`mt-2 w-full rounded-[14px] border px-4 py-3 outline-none transition ${
                      billingSameAsProfile
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                    }`}
                  />
                  <FieldError errors={state.errors} name="billingCity" />
                </div>

                <div>
                  <label
                    htmlFor="billingState"
                    className="text-sm font-semibold text-slate-600"
                  >
                    State / Province
                  </label>
                  <input
                    id="billingState"
                    name="billingState"
                    value={billingState}
                    onChange={(event) => setBillingState(event.target.value)}
                    disabled={billingSameAsProfile}
                    className={`mt-2 w-full rounded-[14px] border px-4 py-3 outline-none transition ${
                      billingSameAsProfile
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                    }`}
                  />
                  <FieldError errors={state.errors} name="billingState" />
                </div>

                <div>
                  <label
                    htmlFor="billingZip"
                    className="text-sm font-semibold text-slate-600"
                  >
                    ZIP / Postal code
                  </label>
                  <input
                    id="billingZip"
                    name="billingZip"
                    value={billingZip}
                    onChange={(event) => setBillingZip(event.target.value)}
                    disabled={billingSameAsProfile}
                    className={`mt-2 w-full rounded-[14px] border px-4 py-3 outline-none transition ${
                      billingSameAsProfile
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                    }`}
                  />
                  <FieldError errors={state.errors} name="billingZip" />
                </div>

                <div>
                  <label
                    htmlFor="billingCountry"
                    className="text-sm font-semibold text-slate-600"
                  >
                    Country
                  </label>
                  <input
                    id="billingCountry"
                    name="billingCountry"
                    value={billingCountry}
                    onChange={(event) => setBillingCountry(event.target.value)}
                    disabled={billingSameAsProfile}
                    className={`mt-2 w-full rounded-[14px] border px-4 py-3 outline-none transition ${
                      billingSameAsProfile
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-300 bg-white text-slate-900 focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                    }`}
                  />
                  <FieldError errors={state.errors} name="billingCountry" />
                </div>
              </div>
            </article>
          </section>
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
            disabled={pending}
            className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Opening Stripe..." : "Continue to Secure Checkout >"}
          </button>
        </div>
      </form>

      <SignatureModal
        open={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSubmit={handleAuthorizationSignature}
      />
    </div>
  );
}
