import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AccountProfileForm } from "@/components/account-profile-form";
import { IntakeStepEightSummary } from "@/components/intake-step-eight-summary";
import { IntakeStepFiveForm } from "@/components/intake-step-five-form";
import { IntakeStepFourForm } from "@/components/intake-step-four-form";
import { IntakeStepNineAgreement } from "@/components/intake-step-nine-agreement";
import { IntakeStepTenPayment } from "@/components/intake-step-ten-payment";
import { IntakeStepTwoForm } from "@/components/intake-step-two-form";
import { IntakeStepThreeForm } from "@/components/intake-step-three-form";
import { IntakeStepSevenForm } from "@/components/intake-step-seven-form";
import { IntakeStepSixForm } from "@/components/intake-step-six-form";
import { getCurrentUserContext, getIntakeDraft } from "@/lib/auth";
import { buildIntakeOrderSummary } from "@/lib/intake-pricing";
import { contactDetails, referenceServicePages } from "@/lib/site-data";
import {
  getIntakeHref,
  getServiceIntentLabel,
  normalizeServiceIntent,
  serviceIntentMap,
} from "@/lib/service-intents";

const intakeSteps = [
  "Contact Info",
  "Choose Invention",
  "Inventors Info",
  "Assignee Info",
  "Invention Details",
  "Supporting Info",
  "Package Details",
  "Order Summary",
  "Engagement Agreement",
  "Payment Details",
  "Complete",
] as const;

function toPackageKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function IntakeStepRail({ currentStep }: { currentStep: number }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[980px]">
        <div className="grid grid-cols-11 gap-2">
          {intakeSteps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isComplete = stepNumber < currentStep;

            return (
              <div key={step} className="text-center">
                <p
                  className={`text-xs uppercase tracking-[0.16em] ${
                    isActive || isComplete ? "text-[#4db8f5]" : "text-slate-400"
                  }`}
                >
                  Step {stepNumber}
                </p>
                <p
                  className={`mt-1 text-[11px] leading-4 ${
                    isActive ? "text-[#25306b]" : "text-slate-400"
                  }`}
                >
                  {step}
                </p>
                <div className="mt-3 flex items-center">
                  <span
                    className={`mx-auto block h-5 w-5 rounded-full border-2 ${
                      isActive
                        ? "border-[#4db8f5] bg-[#4db8f5]"
                        : isComplete
                          ? "border-[#4db8f5] bg-white"
                          : "border-slate-200 bg-white"
                    }`}
                  />
                  {stepNumber < intakeSteps.length ? (
                    <span className="ml-2 hidden h-px flex-1 bg-slate-200 xl:block" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default async function IntakePage({
  params,
  searchParams,
}: {
  params: Promise<{ service: string }>;
  searchParams: Promise<{ package?: string; step?: string; checkout?: string }>;
}) {
  const { service } = await params;
  const {
    package: packageParam,
    step: requestedStep,
    checkout: checkoutStatus,
  } = await searchParams;
  const normalizedService = normalizeServiceIntent(service);
  const context = await getCurrentUserContext();

  if (!normalizedService) {
    notFound();
  }

  if (!context) {
    redirect("/login");
  }

  const { session, user } = context;
  const serviceLabel = getServiceIntentLabel(normalizedService);
  const draft = getIntakeDraft(user, normalizedService);
  const selectedPackageLabel =
    session.pendingService === normalizedService
      ? session.pendingPackageLabel
      : null;
  const selectedPackageKey =
    session.pendingService === normalizedService
      ? session.pendingPackageKey
      : packageParam ?? null;
  const requestedStepNumber =
    typeof requestedStep === "string" ? Number.parseInt(requestedStep, 10) : null;
  const maxAvailableStep = session.profileComplete ? draft?.currentStep ?? 2 : 1;
  const currentStep =
    requestedStepNumber &&
    requestedStepNumber >= 1 &&
    requestedStepNumber <= maxAvailableStep
      ? requestedStepNumber
      : maxAvailableStep;
  const pageData =
    normalizedService in referenceServicePages
      ? referenceServicePages[
          normalizedService as keyof typeof referenceServicePages
        ]
      : null;
  const packageCards = pageData
    ? pageData.offers.cards.map((card) => ({
        key: toPackageKey(card.name),
        name: card.name,
        price: card.price,
        fee: card.fee,
        bullets: card.bullets,
        featured: card.featured,
        badge: card.badge,
      }))
    : [
        {
          key: selectedPackageKey ?? "standard-service",
          name: selectedPackageLabel ?? "Standard Service",
          price: "Custom",
          fee: "Final pricing to be confirmed",
          bullets: ["PatentZoom service flow attached to the current intake."],
        },
      ];

  const stepOneHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=1`;
  const stepTwoHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=2`;
  const stepThreeHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=3`;
  const stepFourHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=4`;
  const stepFiveHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=5`;
  const stepSixHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=6`;
  const stepSevenHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=7`;
  const stepEightHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=8`;
  const stepNineHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=9`;
  const stepTenHref = `${getIntakeHref(
    normalizedService,
    selectedPackageKey,
  )}${selectedPackageKey ? "&" : "?"}step=10`;
  const searchOptionLabel =
    draft?.searchOption === "patent-search-report"
      ? "Patent Search Report"
      : draft?.searchOption === "review-existing-search-report"
        ? "Review Existing Search Report"
        : "No Patent Search Report";
  const selectedPackageCard = packageCards.find(
    (item) => item.key === (draft?.packageKey ?? selectedPackageKey),
  );
  const checkoutSummary = buildIntakeOrderSummary({
    serviceIntent: normalizedService,
    packageKey: draft?.packageKey ?? selectedPackageKey,
    packageLabel:
      draft?.packageLabel ??
      selectedPackageCard?.name ??
      selectedPackageLabel,
    searchOption: draft?.searchOption ?? null,
  });
  const orderLines = checkoutSummary.ok
    ? checkoutSummary.orderLines
    : ([
        {
          label:
            selectedPackageCard?.name ??
            selectedPackageLabel ??
            "Selected package",
          value: selectedPackageCard?.price ?? "$0",
        },
      ] as const);
  const subtotalLabel = checkoutSummary.ok
    ? checkoutSummary.subtotalLabel
    : selectedPackageCard?.price ?? "$0";
  const ccFeeLabel = checkoutSummary.ok ? checkoutSummary.ccFeeLabel : "$0.00";
  const totalLabel = checkoutSummary.ok
    ? checkoutSummary.totalLabel
    : subtotalLabel;
  const caseNumber = `PZ${session.userId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

  return (
    <main className="bg-[#f8f9fb] py-10 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          {checkoutStatus === "canceled" && currentStep === 10 ? (
            <div className="mb-6 rounded-[18px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-800">
              Stripe checkout was canceled before payment was completed. Your
              intake details are still saved here, so you can restart checkout
              whenever you&apos;re ready.
            </div>
          ) : null}
          {checkoutStatus === "processing" && currentStep === 10 ? (
            <div className="mb-6 rounded-[18px] border border-sky-200 bg-sky-50 px-5 py-4 text-sm leading-7 text-sky-800">
              Stripe returned the checkout session, and PatentZoom is still
              confirming the payment result. Refresh in a moment if this state
              lingers.
            </div>
          ) : null}
          {checkoutStatus === "success" && currentStep === 11 ? (
            <div className="mb-6 rounded-[18px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-800">
              Payment was received successfully in Stripe, and the intake has
              moved into completion.
            </div>
          ) : null}
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                  {serviceIntentMap[normalizedService].intakeTitle}
                </p>
                <h1 className="mt-4 text-[2.6rem] font-light leading-none tracking-[-0.05em] text-[#25306b] sm:text-[3.2rem]">
                  {currentStep === 1
                    ? "Contact Information"
                    : currentStep === 2
                      ? "Select Invention"
                      : currentStep === 3
                        ? "Inventor Details"
                        : currentStep === 4
                          ? "Assigning / Transferring Ownership"
                          : currentStep === 5
                            ? "Invention Details"
                            : currentStep === 6
                              ? "Invention Information"
                                : currentStep === 7
                                ? "Package Details"
                                : currentStep === 8
                                  ? "Order Summary"
                                  : currentStep === 9
                                    ? "Engagement Agreement"
                                    : currentStep === 10
                                      ? "Payment Details"
                                      : "Complete"}
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
                  {currentStep === 1
                    ? "Complete your contact details and create your password so PatentZoom can save your intake and move you into the next step."
                    : currentStep === 2
                      ? "Your contact profile is saved. Name the invention or filing matter so PatentZoom can keep the rest of this intake organized."
                      : currentStep === 3
                        ? "Step 2 is saved. Add inventor details now so PatentZoom can continue the application flow into assignee information."
                        : currentStep === 4
                          ? "Step 3 is saved. Confirm whether ownership needs to be assigned or transferred before the invention-detail stage."
                          : currentStep === 5
                            ? "Ownership handling is saved. Now capture the detailed invention description that supports the filing."
                            : currentStep === 6
                              ? "The invention description is saved. Answer the intake questions that shape filing context, public disclosure, and related application history."
                                : currentStep === 7
                                ? "Core invention information is saved. Select the package and patent-search option that should carry into the order summary."
                                : currentStep === 8
                                  ? "Review the saved intake information, package choice, and order lines before moving to the engagement phase."
                                  : currentStep === 9
                                    ? "Order summary is saved. Review the engagement terms, add the signer title, and complete the client signature before moving into payment details."
                                    : currentStep === 10
                                      ? "The engagement agreement is saved. Confirm billing information, submit the payment authorization, and continue into Stripe Checkout."
                                      : "Stripe payment is recorded for this intake, and PatentZoom can now move into the post-payment completion state."}
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-[#f8f9fb] px-5 py-4 text-sm leading-7 text-slate-600">
                <p>
                  <span className="font-semibold text-[#25306b]">Service:</span>{" "}
                  {serviceLabel}
                </p>
                {selectedPackageLabel ? (
                  <p>
                    <span className="font-semibold text-[#25306b]">Package:</span>{" "}
                    {selectedPackageLabel}
                  </p>
                ) : null}
                <p>
                  <span className="font-semibold text-[#25306b]">Signed in as:</span>{" "}
                  {session.displayName}
                </p>
              </div>
            </div>

            <IntakeStepRail currentStep={currentStep} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
            <section>
              {currentStep === 1 ? (
                <div>
                  <div className="mb-6 rounded-[22px] border border-[#fb4522]/20 bg-[#fff7f4] px-5 py-4 text-sm leading-7 text-slate-700">
                    Step 1 comes first because this account still needs complete
                    contact information. Once you save this section, PatentZoom
                    will bring you back here at Step 2 automatically.
                  </div>

                  <AccountProfileForm
                    user={{
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                      phone: user.phone,
                      address1: user.address1,
                      address2: user.address2,
                      city: user.city,
                      state: user.state,
                      zip: user.zip,
                      country: user.country,
                      bestTime: user.bestTime,
                      passwordMissing: !user.passwordHash,
                    }}
                    pendingService={normalizedService}
                    serviceIntentOverride={normalizedService}
                    packageKey={selectedPackageKey}
                    packageLabel={selectedPackageLabel}
                    showPendingBanner={false}
                    submitLabel="Save and Continue"
                    footerNote="Step 1 saves your contact information, login password, and current service selection before moving you into Step 2."
                  />
                </div>
              ) : currentStep === 2 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
                  <IntakeStepTwoForm
                    serviceIntent={normalizedService}
                    packageKey={selectedPackageKey}
                    packageLabel={selectedPackageLabel}
                    previousHref={stepOneHref}
                    defaultValue={draft?.inventionName ?? ""}
                  />
                </div>
              ) : currentStep === 3 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
                  <IntakeStepThreeForm
                    serviceIntent={normalizedService}
                    packageKey={selectedPackageKey}
                    packageLabel={selectedPackageLabel}
                    previousHref={stepTwoHref}
                    profileDefaults={{
                      firstName: user.firstName,
                      lastName: user.lastName,
                      address1: user.address1,
                      address2: user.address2,
                      city: user.city,
                      state: user.state,
                      zip: user.zip,
                      country: user.country,
                      email: user.email,
                    }}
                    defaultValues={
                      draft?.inventor ?? {
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        address1: "",
                        address2: "",
                        city: "",
                        state: "",
                        zip: "",
                        country: user.country || "United States",
                        email: "",
                        filedMoreThanFour: "not-sure",
                      }
                    }
                  />
                </div>
              ) : currentStep === 4 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
                  <IntakeStepFourForm
                    serviceIntent={normalizedService}
                    packageKey={selectedPackageKey}
                    packageLabel={selectedPackageLabel}
                    previousHref={stepThreeHref}
                    defaultValue={draft?.assignmentRequired ?? null}
                  />
                </div>
              ) : currentStep === 5 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
                  <IntakeStepFiveForm
                    serviceIntent={normalizedService}
                    packageKey={selectedPackageKey}
                    packageLabel={selectedPackageLabel}
                    previousHref={stepFourHref}
                    inventionTitle={draft?.inventionName ?? "New Invention"}
                    defaultDescription={draft?.inventionDetails?.description ?? ""}
                  />
                </div>
              ) : currentStep === 6 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
                  <IntakeStepSixForm
                    serviceIntent={normalizedService}
                    packageKey={selectedPackageKey}
                    packageLabel={selectedPackageLabel}
                    previousHref={stepFiveHref}
                    defaultValues={{
                      publicDisclosure:
                        draft?.inventionInformation?.publicDisclosure ?? "",
                      priorApplications:
                        draft?.inventionInformation?.priorApplications ?? "",
                      competitors:
                        draft?.inventionInformation?.competitors ?? "",
                      governmentContract:
                        draft?.inventionInformation?.governmentContract ?? "no",
                    }}
                  />
                </div>
              ) : currentStep === 7 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
                  <IntakeStepSevenForm
                    serviceIntent={normalizedService}
                    previousHref={stepSixHref}
                    packages={packageCards}
                    defaultPackageKey={draft?.packageKey ?? selectedPackageKey}
                    defaultPackageLabel={draft?.packageLabel ?? selectedPackageLabel}
                    defaultSearchOption={draft?.searchOption ?? "none"}
                  />
                </div>
              ) : currentStep === 8 && draft ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
                  <IntakeStepEightSummary
                    serviceIntent={normalizedService}
                    packageKey={draft.packageKey ?? selectedPackageKey}
                    packageLabel={draft.packageLabel ?? selectedPackageLabel}
                    currentHref={stepEightHref}
                    previousHref={stepSevenHref}
                    editStepOneHref={stepOneHref}
                    editStepTwoHref={stepTwoHref}
                    editStepThreeHref={stepThreeHref}
                    editStepFourHref={stepFourHref}
                    contactSummary={{
                      name: `${user.firstName} ${user.lastName}`.trim(),
                      email: user.email,
                      phone: user.phone,
                      address1: user.address1,
                      city: user.city,
                      state: user.state,
                      zip: user.zip,
                      country: user.country,
                    }}
                    draft={draft}
                    orderLines={orderLines}
                    totalLabel={
                      totalLabel
                    }
                  />
                </div>
              ) : currentStep === 9 && draft ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
                  <IntakeStepNineAgreement
                    serviceIntent={normalizedService}
                    serviceLabel={serviceLabel}
                    packageKey={draft.packageKey ?? selectedPackageKey}
                    packageLabel={draft.packageLabel ?? selectedPackageLabel}
                    currentHref={stepNineHref}
                    previousHref={stepEightHref}
                    signerName={`${user.firstName} ${user.lastName}`.trim() || session.displayName}
                    signerEmail={user.email}
                    signerPhone={user.phone}
                    signerAddress={contactDetails.address}
                    draft={draft}
                    orderLines={orderLines}
                    totalLabel={
                      totalLabel
                    }
                  />
                </div>
              ) : currentStep === 10 && draft ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8">
                  <IntakeStepTenPayment
                    serviceIntent={normalizedService}
                    packageKey={draft.packageKey ?? selectedPackageKey}
                    packageLabel={draft.packageLabel ?? selectedPackageLabel}
                    currentHref={stepTenHref}
                    previousHref={stepNineHref}
                    caseNumber={caseNumber}
                    profileDefaults={{
                      firstName: user.firstName,
                      lastName: user.lastName,
                      address1: user.address1,
                      address2: user.address2,
                      city: user.city,
                      state: user.state,
                      zip: user.zip,
                      country: user.country || "United States",
                    }}
                    draft={draft}
                    orderLines={orderLines}
                    subtotalLabel={subtotalLabel}
                    ccFeeLabel={ccFeeLabel}
                    totalLabel={totalLabel}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-[24px] border border-slate-200 bg-[#f8f9fb] p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                      Step 11 ready
                    </p>
                    <h2 className="mt-4 text-[2.2rem] font-light leading-none tracking-[-0.04em] text-[#25306b]">
                      Continue into completion
                    </h2>
                    <p className="mt-4 text-sm leading-8 text-slate-600">
                      Stripe payment is now recorded for this service, so the
                      intake has moved into the completion state. This screen
                      can now serve as the live payment confirmation and handoff
                      summary for PatentZoom.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <article className="rounded-[24px] border border-slate-200 bg-white p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Package summary
                      </p>
                      <p className="mt-3 text-[1.65rem] font-light leading-8 text-[#25306b]">
                        {draft?.packageLabel ?? selectedPackageLabel ?? "No package saved yet"}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        The saved package and search option are now attached to
                        the signed intake that has completed Stripe payment.
                      </p>
                    </article>

                    <article className="rounded-[24px] border border-slate-200 bg-white p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Search option
                      </p>
                      <p className="mt-3 text-[1.65rem] font-light leading-8 text-[#25306b]">
                        {searchOptionLabel}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        This search preference is already included in the Stripe
                        payment summary and completion handoff.
                      </p>
                    </article>
                  </div>

                  <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                      What Step 11 will handle
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-[18px] bg-[#f8f9fb] px-5 py-4 text-sm leading-7 text-slate-700">
                        Confirmation receipt state
                      </div>
                      <div className="rounded-[18px] bg-[#f8f9fb] px-5 py-4 text-sm leading-7 text-slate-700">
                        Client thank-you messaging
                      </div>
                      <div className="rounded-[18px] bg-[#f8f9fb] px-5 py-4 text-sm leading-7 text-slate-700">
                        Internal next-step handoff
                      </div>
                      <div className="rounded-[18px] bg-[#f8f9fb] px-5 py-4 text-sm leading-7 text-slate-700">
                        Paid-intake timeline summary
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={stepTenHref}
                        className="inline-flex rounded-[10px] bg-[#396aa2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f5d91]"
                      >
                        &lt; Previous
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <section className="rounded-[24px] border border-slate-200 bg-[#243551] p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                  Intake status
                </p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      Current step
                    </p>
                    <p className="mt-2 text-lg font-medium text-white">
                      Step {currentStep} of {intakeSteps.length}
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {currentStep === 1
                        ? "Contact information is still required before the wizard can move forward."
                        : currentStep === 2
                          ? "Contact information is complete, and the intake now needs an invention name before moving to Step 3."
                          : currentStep === 3
                            ? "The invention name is already saved, and the intake now needs inventor details before moving to Step 4."
                            : currentStep === 4
                              ? "Inventor details are saved, and the intake now needs the ownership-transfer decision before Step 5."
                              : currentStep === 5
                                ? "Ownership handling is saved, and the intake now needs the detailed invention write-up before Step 6."
                                : currentStep === 6
                                  ? "The invention write-up is saved, and the intake now needs the information questionnaire before Step 7."
                                  : currentStep === 7
                                    ? "The information questionnaire is saved, and the intake now needs package details before Step 8."
                                    : currentStep === 8
                                      ? "The package details are saved, and the intake is now at order summary."
                                      : currentStep === 9
                                        ? "The order summary is saved, and the intake now needs the engagement agreement signature before Step 10."
                                        : currentStep === 10
                                          ? "The engagement agreement is saved, and the intake now needs payment details before completion."
                                          : "Stripe payment is saved, and the intake is now positioned for completion."}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      Contact profile
                    </p>
                    <p className="mt-2 text-lg font-medium text-white">
                      {session.profileComplete ? "Saved and ready" : "Needs completion"}
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {user.email}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[24px] border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                  Need help?
                </p>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  If you want help deciding whether this should be provisional,
                  utility, design, or another service, talk with PatentZoom
                  before continuing the wizard.
                </p>
                <div className="mt-6 space-y-2 text-sm leading-7 text-slate-700">
                  <p>Phone: {contactDetails.phoneDisplay}</p>
                  <p>Email: {contactDetails.email}</p>
                  <p>Address: {contactDetails.address}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/patent-search"
                    className="inline-flex rounded-full bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
                  >
                    Explore services
                  </Link>
                  <Link
                    href="/account"
                    className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
                  >
                    My account
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
