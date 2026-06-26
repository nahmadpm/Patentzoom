"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  advanceOrderSummaryStep,
  saveEngagementAgreementStep,
  saveAssignmentDecision,
  saveInventorDetails,
  saveInventionDetailsStep,
  saveInventionInformationStep,
  saveInventionSelection,
  savePaymentInformationStep,
  savePackageSelectionStep,
} from "@/lib/auth";
import { normalizeServiceIntent } from "@/lib/service-intents";

export type IntakeActionState = {
  errors?: Record<string, string[]>;
  message?: string;
};

const stepTwoSchema = z.object({
  inventionName: z
    .string()
    .trim()
    .min(2, { message: "Please enter an invention name." }),
});

const stepThreeSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required." }),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, { message: "Last name is required." }),
  address1: z.string().trim().min(3, { message: "Address 1 is required." }),
  address2: z.string().trim().optional(),
  city: z.string().trim().min(2, { message: "City is required." }),
  state: z.string().trim().min(2, { message: "State is required." }),
  zip: z.string().trim().min(4, { message: "ZIP / postal code is required." }),
  country: z.string().trim().min(2, { message: "Country is required." }),
  email: z
    .union([
      z.string().trim().length(0),
      z.email({ message: "Please enter a valid email address." }).trim(),
    ]),
  filedMoreThanFour: z.enum(["yes", "no", "not-sure"], {
    message: "Please choose an option.",
  }),
});

const stepFourSchema = z.object({
  assignmentRequired: z.enum(["yes", "no"], {
    message: "Please choose yes or no.",
  }),
});

const stepFiveSchema = z.object({
  description: z
    .string()
    .trim()
    .min(20, { message: "Please add more detail about the invention." }),
});

const stepSixSchema = z.object({
  publicDisclosure: z
    .string()
    .trim()
    .min(3, { message: "Please answer question 1." }),
  priorApplications: z
    .string()
    .trim()
    .min(3, { message: "Please answer question 2." }),
  competitors: z
    .string()
    .trim()
    .min(3, { message: "Please answer question 3." }),
  governmentContract: z.enum(["yes", "no"], {
    message: "Please answer question 4.",
  }),
});

const stepSevenSchema = z.object({
  packageKey: z
    .string()
    .trim()
    .min(1, { message: "Please select a package." }),
  packageLabel: z
    .string()
    .trim()
    .min(1, { message: "Please select a package." }),
  searchOption: z.enum(
    ["none", "patent-search-report", "review-existing-search-report"],
    {
      message: "Please choose a patent search option.",
    },
  ),
});

const stepNineSchema = z.object({
  signerName: z
    .string()
    .trim()
    .min(2, { message: "Signer name is required." }),
  signerTitle: z
    .string()
    .trim()
    .min(2, { message: "Please enter your title." }),
  company: z.string().trim().optional(),
  signatureDataUrl: z
    .string()
    .trim()
    .min(30, { message: "Please submit the client signature before continuing." }),
  agreementAccepted: z.literal("true", {
    message: "Please sign the engagement agreement before continuing.",
  }),
});

const stepTenSchema = z.object({
  cardholderName: z
    .string()
    .trim()
    .min(2, { message: "Name on card is required." }),
  cardNumber: z
    .string()
    .trim()
    .regex(/^[0-9 ]{13,23}$/, { message: "Please enter a valid card number." }),
  cardType: z
    .string()
    .trim()
    .min(2, { message: "Please select a card type." }),
  expMonth: z
    .string()
    .trim()
    .min(1, { message: "Please choose an expiry month." }),
  expYear: z
    .string()
    .trim()
    .min(4, { message: "Please choose an expiry year." }),
  cvv: z
    .string()
    .trim()
    .regex(/^[0-9]{3,4}$/, { message: "Please enter a valid CVV." }),
  billingSameAsProfile: z.enum(["true", "false"]),
  billingFirstName: z
    .string()
    .trim()
    .min(1, { message: "Billing first name is required." }),
  billingLastName: z
    .string()
    .trim()
    .min(1, { message: "Billing last name is required." }),
  billingAddress1: z
    .string()
    .trim()
    .min(3, { message: "Billing address is required." }),
  billingAddress2: z.string().trim().optional(),
  billingCity: z
    .string()
    .trim()
    .min(2, { message: "Billing city is required." }),
  billingState: z
    .string()
    .trim()
    .min(2, { message: "Billing state is required." }),
  billingZip: z
    .string()
    .trim()
    .min(4, { message: "Billing ZIP / postal code is required." }),
  billingCountry: z
    .string()
    .trim()
    .min(2, { message: "Billing country is required." }),
  authorizationSignatureDataUrl: z
    .string()
    .trim()
    .min(30, { message: "Please sign the payment authorization." }),
});

export async function saveStepTwoAction(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const serviceIntent = normalizeServiceIntent(formData.get("serviceIntent"));

  if (!serviceIntent) {
    return {
      message: "A valid service selection is required.",
    } satisfies IntakeActionState;
  }

  const validated = stepTwoSchema.safeParse({
    inventionName: formData.get("inventionName"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies IntakeActionState;
  }

  const intent = String(formData.get("intent") ?? "save").trim();
  const result = await saveInventionSelection({
    serviceIntent,
    inventionName: validated.data.inventionName,
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
    continueToNextStep: intent === "continue",
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies IntakeActionState;
  }

  redirect(result.redirectTo);
}

export async function saveStepThreeAction(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const serviceIntent = normalizeServiceIntent(formData.get("serviceIntent"));

  if (!serviceIntent) {
    return {
      message: "A valid service selection is required.",
    } satisfies IntakeActionState;
  }

  const validated = stepThreeSchema.safeParse({
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName"),
    lastName: formData.get("lastName"),
    address1: formData.get("address1"),
    address2: formData.get("address2"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
    country: formData.get("country"),
    email: formData.get("email"),
    filedMoreThanFour: formData.get("filedMoreThanFour"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies IntakeActionState;
  }

  const intent = String(formData.get("intent") ?? "save").trim();
  const result = await saveInventorDetails({
    serviceIntent,
    inventor: {
      firstName: validated.data.firstName,
      middleName: validated.data.middleName ?? "",
      lastName: validated.data.lastName,
      address1: validated.data.address1,
      address2: validated.data.address2 ?? "",
      city: validated.data.city,
      state: validated.data.state,
      zip: validated.data.zip,
      country: validated.data.country,
      email: validated.data.email,
      filedMoreThanFour: validated.data.filedMoreThanFour,
    },
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
    continueToNextStep: intent === "continue",
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies IntakeActionState;
  }

  redirect(result.redirectTo);
}

export async function saveStepFourAction(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const serviceIntent = normalizeServiceIntent(formData.get("serviceIntent"));

  if (!serviceIntent) {
    return {
      message: "A valid service selection is required.",
    } satisfies IntakeActionState;
  }

  const validated = stepFourSchema.safeParse({
    assignmentRequired: formData.get("assignmentRequired"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies IntakeActionState;
  }

  const intent = String(formData.get("intent") ?? "save").trim();
  const result = await saveAssignmentDecision({
    serviceIntent,
    assignmentRequired: validated.data.assignmentRequired,
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
    continueToNextStep: intent === "continue",
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies IntakeActionState;
  }

  redirect(result.redirectTo);
}

export async function saveStepFiveAction(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const serviceIntent = normalizeServiceIntent(formData.get("serviceIntent"));

  if (!serviceIntent) {
    return {
      message: "A valid service selection is required.",
    } satisfies IntakeActionState;
  }

  const validated = stepFiveSchema.safeParse({
    description: formData.get("description"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies IntakeActionState;
  }

  const intent = String(formData.get("intent") ?? "save").trim();
  const result = await saveInventionDetailsStep({
    serviceIntent,
    description: validated.data.description,
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
    continueToNextStep: intent === "continue",
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies IntakeActionState;
  }

  redirect(result.redirectTo);
}

export async function saveStepSixAction(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const serviceIntent = normalizeServiceIntent(formData.get("serviceIntent"));

  if (!serviceIntent) {
    return {
      message: "A valid service selection is required.",
    } satisfies IntakeActionState;
  }

  const validated = stepSixSchema.safeParse({
    publicDisclosure: formData.get("publicDisclosure"),
    priorApplications: formData.get("priorApplications"),
    competitors: formData.get("competitors"),
    governmentContract: formData.get("governmentContract"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies IntakeActionState;
  }

  const intent = String(formData.get("intent") ?? "save").trim();
  const result = await saveInventionInformationStep({
    serviceIntent,
    publicDisclosure: validated.data.publicDisclosure,
    priorApplications: validated.data.priorApplications,
    competitors: validated.data.competitors,
    governmentContract: validated.data.governmentContract,
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
    continueToNextStep: intent === "continue",
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies IntakeActionState;
  }

  redirect(result.redirectTo);
}

export async function saveStepSevenAction(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const serviceIntent = normalizeServiceIntent(formData.get("serviceIntent"));

  if (!serviceIntent) {
    return {
      message: "A valid service selection is required.",
    } satisfies IntakeActionState;
  }

  const validated = stepSevenSchema.safeParse({
    packageKey: formData.get("selectedPackageKey"),
    packageLabel: formData.get("selectedPackageLabel"),
    searchOption: formData.get("searchOption"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies IntakeActionState;
  }

  const intent = String(formData.get("intent") ?? "save").trim();
  const result = await savePackageSelectionStep({
    serviceIntent,
    packageKey: validated.data.packageKey,
    packageLabel: validated.data.packageLabel,
    searchOption: validated.data.searchOption,
    continueToNextStep: intent === "continue",
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies IntakeActionState;
  }

  redirect(result.redirectTo);
}

export async function continueFromOrderSummaryAction(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const serviceIntent = normalizeServiceIntent(formData.get("serviceIntent"));

  if (!serviceIntent) {
    return {
      message: "A valid service selection is required.",
    } satisfies IntakeActionState;
  }

  const result = await advanceOrderSummaryStep({
    serviceIntent,
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies IntakeActionState;
  }

  redirect(result.redirectTo);
}

export async function saveStepNineAction(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const serviceIntent = normalizeServiceIntent(formData.get("serviceIntent"));

  if (!serviceIntent) {
    return {
      message: "A valid service selection is required.",
    } satisfies IntakeActionState;
  }

  const validated = stepNineSchema.safeParse({
    signerName: formData.get("signerName"),
    signerTitle: formData.get("signerTitle"),
    company: formData.get("company"),
    signatureDataUrl: formData.get("signatureDataUrl"),
    agreementAccepted: formData.get("agreementAccepted"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies IntakeActionState;
  }

  const intent = String(formData.get("intent") ?? "save").trim();
  const result = await saveEngagementAgreementStep({
    serviceIntent,
    signerName: validated.data.signerName,
    signerTitle: validated.data.signerTitle,
    company: validated.data.company ?? "",
    signatureDataUrl: validated.data.signatureDataUrl,
    accepted: true,
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
    continueToNextStep: intent === "continue",
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies IntakeActionState;
  }

  redirect(result.redirectTo);
}

export async function saveStepTenAction(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const serviceIntent = normalizeServiceIntent(formData.get("serviceIntent"));

  if (!serviceIntent) {
    return {
      message: "A valid service selection is required.",
    } satisfies IntakeActionState;
  }

  const validated = stepTenSchema.safeParse({
    cardholderName: formData.get("cardholderName"),
    cardNumber: formData.get("cardNumber"),
    cardType: formData.get("cardType"),
    expMonth: formData.get("expMonth"),
    expYear: formData.get("expYear"),
    cvv: formData.get("cvv"),
    billingSameAsProfile: String(formData.get("billingSameAsProfile") ?? "false"),
    billingFirstName: formData.get("billingFirstName"),
    billingLastName: formData.get("billingLastName"),
    billingAddress1: formData.get("billingAddress1"),
    billingAddress2: formData.get("billingAddress2"),
    billingCity: formData.get("billingCity"),
    billingState: formData.get("billingState"),
    billingZip: formData.get("billingZip"),
    billingCountry: formData.get("billingCountry"),
    authorizationSignatureDataUrl: formData.get("authorizationSignatureDataUrl"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies IntakeActionState;
  }

  const digitsOnly = validated.data.cardNumber.replace(/\D/g, "");
  const cardLastFour = digitsOnly.slice(-4);
  const intent = String(formData.get("intent") ?? "save").trim();
  const result = await savePaymentInformationStep({
    serviceIntent,
    cardholderName: validated.data.cardholderName,
    cardType: validated.data.cardType,
    cardLastFour,
    expMonth: validated.data.expMonth,
    expYear: validated.data.expYear,
    billingSameAsProfile: validated.data.billingSameAsProfile === "true",
    billingFirstName: validated.data.billingFirstName,
    billingLastName: validated.data.billingLastName,
    billingAddress1: validated.data.billingAddress1,
    billingAddress2: validated.data.billingAddress2 ?? "",
    billingCity: validated.data.billingCity,
    billingState: validated.data.billingState,
    billingZip: validated.data.billingZip,
    billingCountry: validated.data.billingCountry,
    authorizationSignatureDataUrl: validated.data.authorizationSignatureDataUrl,
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
    continueToNextStep: intent === "continue",
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies IntakeActionState;
  }

  redirect(result.redirectTo);
}
