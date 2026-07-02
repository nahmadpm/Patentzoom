import { createHmac, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

import { cookies } from "next/headers";

import type { UploadedIntakeFile } from "@/lib/intake-upload-types";
import {
  type ServiceIntent,
  getIntakeHref,
} from "@/lib/service-intents";

const scrypt = promisify(scryptCallback);

const AUTH_COOKIE_NAME = "patentzoom_session";
const AUTH_SECRET =
  process.env.PATENTZOOM_AUTH_SECRET ?? "patentzoom-dev-session-secret";
const AUTH_STORE_PATH = join(process.cwd(), ".codex-temp", "auth-store.json");

type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  bestTime: string;
  passwordHash: string | null;
  resetPasswordHash: string | null;
  resetPasswordExpiresAt: string | null;
  resetPasswordSentAt: string | null;
  intakeDrafts?: Partial<Record<ServiceIntent, IntakeDraft>>;
  createdAt: string;
  updatedAt: string;
};

export type IntakeDraft = {
  currentStep: number;
  inventionName: string;
  inventor: {
    firstName: string;
    middleName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
    filedMoreThanFour: "yes" | "no" | "not-sure";
  } | null;
  assignmentRequired: "yes" | "no" | null;
  inventionDetails: {
    description: string;
    uploads: UploadedIntakeFile[];
  } | null;
  inventionInformation: {
    publicDisclosure: string;
    priorApplications: string;
    competitors: string;
    governmentContract: "yes" | "no";
  } | null;
  searchOption:
    | "none"
    | "patent-search-report"
    | "review-existing-search-report"
    | null;
  engagementAgreement: {
    accepted: boolean;
    signerName: string;
    signerTitle: string;
    company: string;
    signatureDataUrl: string;
    signedAt: string | null;
  } | null;
  paymentInformation: {
    billingSameAsProfile: boolean;
    billingFirstName: string;
    billingLastName: string;
    billingAddress1: string;
    billingAddress2: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    billingCountry: string;
    authorizationSignatureDataUrl: string;
    authorizedAt: string | null;
    stripeCheckoutSessionId: string | null;
    stripeCheckoutStatus: "pending" | "paid" | "expired" | "failed" | null;
    stripePaymentIntentId: string | null;
    stripePaymentStatus: string | null;
    stripeCustomerEmail: string | null;
    stripeCurrency: string | null;
    stripeAmountSubtotal: number | null;
    stripeAmountTotal: number | null;
    paidAt: string | null;
  } | null;
  packageKey: string | null;
  packageLabel: string | null;
  updatedAt: string;
};

type AuthStore = {
  users: StoredUser[];
};

export type SessionUser = {
  userId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileComplete: boolean;
  pendingService: ServiceIntent | null;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
};

async function ensureAuthStore() {
  await mkdir(join(process.cwd(), ".codex-temp"), { recursive: true });

  try {
    await readFile(AUTH_STORE_PATH, "utf8");
  } catch {
    const emptyStore: AuthStore = { users: [] };
    await writeFile(AUTH_STORE_PATH, JSON.stringify(emptyStore, null, 2), "utf8");
  }
}

async function readAuthStore() {
  await ensureAuthStore();
  const raw = await readFile(AUTH_STORE_PATH, "utf8");
  return JSON.parse(raw) as AuthStore;
}

async function writeAuthStore(store: AuthStore) {
  await writeFile(AUTH_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function hydrateUser(user: StoredUser): StoredUser {
  return {
    ...user,
    resetPasswordHash: user.resetPasswordHash ?? null,
    resetPasswordExpiresAt: user.resetPasswordExpiresAt ?? null,
    resetPasswordSentAt: user.resetPasswordSentAt ?? null,
    intakeDrafts: user.intakeDrafts ?? {},
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function splitName(name: string) {
  const trimmed = name.trim().replace(/\s+/g, " ");
  const [firstName = "", ...rest] = trimmed.split(" ");

  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function getDisplayName(user: Pick<StoredUser, "firstName" | "lastName" | "email">) {
  const name = `${user.firstName} ${user.lastName}`.trim();
  return name || user.email;
}

export function isProfileComplete(user: StoredUser) {
  return Boolean(
    user.firstName &&
      user.lastName &&
      user.phone &&
      user.address1 &&
      user.city &&
      user.state &&
      user.zip &&
      user.country &&
      user.passwordHash,
  );
}

function buildSessionUser(
  user: StoredUser,
  pendingService: ServiceIntent | null,
  pendingPackageKey: string | null,
  pendingPackageLabel: string | null,
): SessionUser {
  return {
    userId: user.id,
    email: user.email,
    displayName: getDisplayName(user),
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    profileComplete: isProfileComplete(user),
    pendingService,
    pendingPackageKey,
    pendingPackageLabel,
  };
}

function encodeSession(session: SessionUser) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

function decodeSession(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

async function setSession(session: SessionUser) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}

export async function getCurrentUserContext() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const store = await readAuthStore();
  const user = store.users.find((entry) => entry.id === session.userId);

  if (!user) {
    return null;
  }

  const hydratedUser = hydrateUser(user);
  const freshSession = buildSessionUser(
    hydratedUser,
    session.pendingService,
    session.pendingPackageKey ?? null,
    session.pendingPackageLabel ?? null,
  );

  return {
    session: freshSession,
    user: hydratedUser,
  };
}

export function getIntakeDraft(
  user: StoredUser,
  serviceIntent: ServiceIntent,
) {
  return user.intakeDrafts?.[serviceIntent] ?? null;
}

async function updateIntakeDraftByUserId(input: {
  userId: string;
  serviceIntent: ServiceIntent;
  currentStep: number;
  patch: Partial<IntakeDraft>;
}) {
  const store = await readAuthStore();
  const userIndex = store.users.findIndex((entry) => entry.id === input.userId);

  if (userIndex === -1) {
    return {
      ok: false as const,
      message: "We could not load your account for the Stripe update.",
    };
  }

  const hydratedUser = hydrateUser(store.users[userIndex]);
  const now = new Date().toISOString();
  const existingDraft = hydratedUser.intakeDrafts?.[input.serviceIntent];

  if (!existingDraft) {
    return {
      ok: false as const,
      message: "We could not find the intake draft for this Stripe update.",
    };
  }

  const nextDraft: IntakeDraft = {
    ...existingDraft,
    currentStep: input.currentStep,
    updatedAt: now,
    ...input.patch,
  };

  hydratedUser.intakeDrafts = hydratedUser.intakeDrafts ?? {};
  hydratedUser.intakeDrafts[input.serviceIntent] = nextDraft;
  hydratedUser.updatedAt = now;
  store.users[userIndex] = hydratedUser;
  await writeAuthStore(store);

  return {
    ok: true as const,
    draft: nextDraft,
  };
}

function buildIntakeStepHref(
  serviceIntent: ServiceIntent,
  packageKey: string | null,
  step: number,
) {
  const baseHref = getIntakeHref(serviceIntent, packageKey);
  return `${baseHref}${baseHref.includes("?") ? "&" : "?"}step=${step}`;
}

async function persistIntakeDraft(input: {
  serviceIntent: ServiceIntent;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
  currentStep: number;
  redirectStep: number;
  patch: Partial<IntakeDraft>;
}) {
  const context = await getCurrentUserContext();

  if (!context) {
    return {
      ok: false as const,
      message: "Your session expired. Please log in again.",
    };
  }

  const store = await readAuthStore();
  const user = store.users.find((entry) => entry.id === context.user.id);

  if (!user) {
    await clearSession();
    return {
      ok: false as const,
      message: "We could not load your account. Please log in again.",
    };
  }

  const hydratedUser = hydrateUser(user);
  const now = new Date().toISOString();
  const existingDraft = hydratedUser.intakeDrafts?.[input.serviceIntent];

  const nextDraft: IntakeDraft = {
    currentStep: input.currentStep,
    inventionName: existingDraft?.inventionName ?? "",
    inventor: existingDraft?.inventor ?? null,
    assignmentRequired: existingDraft?.assignmentRequired ?? null,
    inventionDetails: existingDraft?.inventionDetails ?? null,
    inventionInformation: existingDraft?.inventionInformation ?? null,
    searchOption: existingDraft?.searchOption ?? null,
    engagementAgreement: existingDraft?.engagementAgreement ?? null,
    paymentInformation: existingDraft?.paymentInformation ?? null,
    packageKey: input.pendingPackageKey ?? existingDraft?.packageKey ?? null,
    packageLabel:
      input.pendingPackageLabel ?? existingDraft?.packageLabel ?? null,
    updatedAt: now,
    ...input.patch,
  };

  hydratedUser.intakeDrafts = hydratedUser.intakeDrafts ?? {};
  hydratedUser.intakeDrafts[input.serviceIntent] = nextDraft;
  hydratedUser.updatedAt = now;

  const userIndex = store.users.findIndex((entry) => entry.id === hydratedUser.id);
  store.users[userIndex] = hydratedUser;
  await writeAuthStore(store);

  const session = buildSessionUser(
    hydratedUser,
    input.serviceIntent,
    nextDraft.packageKey,
    nextDraft.packageLabel,
  );
  await setSession(session);

  return {
    ok: true as const,
    redirectTo: buildIntakeStepHref(
      input.serviceIntent,
      nextDraft.packageKey,
      input.redirectStep,
    ),
  };
}

async function hashPassword(password: string) {
  const salt = randomUUID();
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

function generateTemporaryPassword() {
  return randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
}

async function verifyPassword(password: string, storedHash: string) {
  const [salt, storedValue] = storedHash.split(":");

  if (!salt || !storedValue) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(storedValue, "hex");

  return (
    storedBuffer.length === derivedKey.length &&
    timingSafeEqual(storedBuffer, derivedKey)
  );
}

function getPostAuthHref(session: SessionUser) {
  if (session.pendingService) {
    return getIntakeHref(session.pendingService, session.pendingPackageKey);
  }

  return "/account";
}

export async function registerStarterUser(input: {
  name: string;
  email: string;
  phone: string;
  pendingService: ServiceIntent | null;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
}) {
  const store = await readAuthStore();
  const normalizedEmail = normalizeEmail(input.email);
  const existingUser = store.users.find((user) => user.email === normalizedEmail);

  if (existingUser?.passwordHash) {
    return {
      ok: false as const,
      message: "An account already exists for this email. Please log in instead.",
    };
  }

  const now = new Date().toISOString();

  if (existingUser) {
    const { firstName, lastName } = splitName(input.name);
    existingUser.firstName = existingUser.firstName || firstName;
    existingUser.lastName = existingUser.lastName || lastName;
    existingUser.phone = existingUser.phone || input.phone.trim();
    existingUser.updatedAt = now;

    await writeAuthStore(store);

    const hydratedExistingUser = hydrateUser(existingUser);
    const session = buildSessionUser(
      hydratedExistingUser,
      input.pendingService,
      input.pendingPackageKey,
      input.pendingPackageLabel,
    );
    await setSession(session);

    return {
      ok: true as const,
      redirectTo: getPostAuthHref(session),
    };
  }

  const { firstName, lastName } = splitName(input.name);
  const user: StoredUser = {
    id: randomUUID(),
    firstName,
    lastName,
    email: normalizedEmail,
    phone: input.phone.trim(),
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    bestTime: "",
    passwordHash: null,
    resetPasswordHash: null,
    resetPasswordExpiresAt: null,
    resetPasswordSentAt: null,
    createdAt: now,
    updatedAt: now,
  };

  store.users.push(user);
  await writeAuthStore(store);

  const session = buildSessionUser(
    user,
    input.pendingService,
    input.pendingPackageKey,
    input.pendingPackageLabel,
  );
  await setSession(session);

  return {
    ok: true as const,
    redirectTo: getPostAuthHref(session),
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
  pendingService: ServiceIntent | null;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
}) {
  const store = await readAuthStore();
  const normalizedEmail = normalizeEmail(input.email);
  const user = store.users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return {
      ok: false as const,
      message: "We could not find an account with that email.",
    };
  }

  if (!user.passwordHash) {
    return {
      ok: false as const,
      message:
        "This account still needs onboarding. Register again with the same email to continue setup.",
    };
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    return {
      ok: false as const,
      message: "The password you entered is incorrect.",
    };
  }

  const session = buildSessionUser(
    hydrateUser(user),
    input.pendingService,
    input.pendingPackageKey,
    input.pendingPackageLabel,
  );
  await setSession(session);

  return {
    ok: true as const,
    redirectTo: getPostAuthHref(session),
  };
}

export async function updateCurrentUserProfile(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  bestTime: string;
  password?: string;
  pendingService?: ServiceIntent | null;
  pendingPackageKey?: string | null;
  pendingPackageLabel?: string | null;
}) {
  const context = await getCurrentUserContext();

  if (!context) {
    return {
      ok: false as const,
      message: "Your session expired. Please log in again.",
    };
  }

  const store = await readAuthStore();
  const user = store.users.find((entry) => entry.id === context.user.id);

  if (!user) {
    await clearSession();
    return {
      ok: false as const,
      message: "We could not load your account. Please log in again.",
    };
  }

  const nextEmail = normalizeEmail(input.email);
  const conflict = store.users.find(
    (entry) => entry.email === nextEmail && entry.id !== user.id,
  );

  if (conflict) {
    return {
      ok: false as const,
      message: "That email is already attached to another account.",
    };
  }

  user.firstName = input.firstName.trim();
  user.lastName = input.lastName.trim();
  user.email = nextEmail;
  user.phone = input.phone.trim();
  user.address1 = input.address1.trim();
  user.address2 = input.address2.trim();
  user.city = input.city.trim();
  user.state = input.state.trim();
  user.zip = input.zip.trim();
  user.country = input.country.trim();
  user.bestTime = input.bestTime.trim();
  user.updatedAt = new Date().toISOString();

  if (input.password) {
    user.passwordHash = await hashPassword(input.password);
    user.resetPasswordHash = null;
    user.resetPasswordExpiresAt = null;
    user.resetPasswordSentAt = null;
  }

  await writeAuthStore(store);

  const session = buildSessionUser(
    hydrateUser(user),
    input.pendingService ?? context.session.pendingService,
    input.pendingPackageKey ?? context.session.pendingPackageKey,
    input.pendingPackageLabel ?? context.session.pendingPackageLabel,
  );
  await setSession(session);

  return {
    ok: true as const,
    redirectTo: getPostAuthHref(session),
  };
}

export async function requestTemporaryPassword(input: {
  email: string;
  sendEmail: (payload: {
    email: string;
    temporaryPassword: string;
    displayName: string;
  }) => Promise<{ delivery: "smtp" | "outbox" }>;
}) {
  const store = await readAuthStore();
  const normalizedEmail = normalizeEmail(input.email);
  const user = store.users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return {
      ok: false as const,
      message: "We could not find an account with that email.",
    };
  }

  const temporaryPassword = generateTemporaryPassword();
  user.resetPasswordHash = await hashPassword(temporaryPassword);
  user.resetPasswordSentAt = new Date().toISOString();
  user.resetPasswordExpiresAt = new Date(
    Date.now() + 1000 * 60 * 30,
  ).toISOString();
  user.updatedAt = new Date().toISOString();

  await writeAuthStore(store);

  const emailResult = await input.sendEmail({
    email: user.email,
    temporaryPassword,
    displayName: getDisplayName(user),
  });

  return {
    ok: true as const,
    email: user.email,
    delivery: emailResult.delivery,
    message:
      "An email has been sent to you with a temporary password. Please check your email and enter the temporary password below.",
  };
}

export async function resetPasswordWithTemporary(input: {
  email: string;
  temporaryPassword: string;
  newPassword: string;
}) {
  const store = await readAuthStore();
  const normalizedEmail = normalizeEmail(input.email);
  const user = store.users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    return {
      ok: false as const,
      message: "We could not find an account with that email.",
    };
  }

  const hydratedUser = hydrateUser(user);

  if (!hydratedUser.resetPasswordHash || !hydratedUser.resetPasswordExpiresAt) {
    return {
      ok: false as const,
      message: "Please request a temporary password first.",
    };
  }

  if (new Date(hydratedUser.resetPasswordExpiresAt).getTime() < Date.now()) {
    return {
      ok: false as const,
      message: "This temporary password expired. Please request a new one.",
    };
  }

  const matches = await verifyPassword(
    input.temporaryPassword.trim(),
    hydratedUser.resetPasswordHash,
  );

  if (!matches) {
    return {
      ok: false as const,
      message: "The temporary password you entered is incorrect.",
    };
  }

  user.passwordHash = await hashPassword(input.newPassword.trim());
  user.resetPasswordHash = null;
  user.resetPasswordExpiresAt = null;
  user.resetPasswordSentAt = null;
  user.updatedAt = new Date().toISOString();

  await writeAuthStore(store);

  const session = buildSessionUser(hydrateUser(user), null, null, null);
  await setSession(session);

  return {
    ok: true as const,
    redirectTo: "/account",
  };
}

export async function updatePendingSelection(input: {
  serviceIntent: ServiceIntent;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
}) {
  const context = await getCurrentUserContext();

  if (!context) {
    return {
      ok: false as const,
      message: "Please log in first.",
    };
  }

  const session = buildSessionUser(
    context.user,
    input.serviceIntent,
    input.pendingPackageKey,
    input.pendingPackageLabel,
  );
  await setSession(session);

  return {
    ok: true as const,
    redirectTo: getPostAuthHref(session),
  };
}

export async function saveInventionSelection(input: {
  serviceIntent: ServiceIntent;
  inventionName: string;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
  continueToNextStep: boolean;
}) {
  return persistIntakeDraft({
    serviceIntent: input.serviceIntent,
    pendingPackageKey: input.pendingPackageKey,
    pendingPackageLabel: input.pendingPackageLabel,
    currentStep: input.continueToNextStep ? 3 : 2,
    redirectStep: input.continueToNextStep ? 3 : 2,
    patch: {
      inventionName: input.inventionName.trim(),
    },
  });
}

export async function saveInventorDetails(input: {
  serviceIntent: ServiceIntent;
  inventor: NonNullable<IntakeDraft["inventor"]>;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
  continueToNextStep: boolean;
}) {
  return persistIntakeDraft({
    serviceIntent: input.serviceIntent,
    pendingPackageKey: input.pendingPackageKey,
    pendingPackageLabel: input.pendingPackageLabel,
    currentStep: input.continueToNextStep ? 4 : 3,
    redirectStep: input.continueToNextStep ? 4 : 3,
    patch: {
      inventor: input.inventor,
    },
  });
}

export async function saveAssignmentDecision(input: {
  serviceIntent: ServiceIntent;
  assignmentRequired: "yes" | "no";
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
  continueToNextStep: boolean;
}) {
  return persistIntakeDraft({
    serviceIntent: input.serviceIntent,
    pendingPackageKey: input.pendingPackageKey,
    pendingPackageLabel: input.pendingPackageLabel,
    currentStep: input.continueToNextStep ? 5 : 4,
    redirectStep: input.continueToNextStep ? 5 : 4,
    patch: {
      assignmentRequired: input.assignmentRequired,
    },
  });
}

export async function saveInventionDetailsStep(input: {
  serviceIntent: ServiceIntent;
  description: string;
  uploads: UploadedIntakeFile[];
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
  continueToNextStep: boolean;
}) {
  return persistIntakeDraft({
    serviceIntent: input.serviceIntent,
    pendingPackageKey: input.pendingPackageKey,
    pendingPackageLabel: input.pendingPackageLabel,
    currentStep: input.continueToNextStep ? 6 : 5,
    redirectStep: input.continueToNextStep ? 6 : 5,
    patch: {
      inventionDetails: {
        description: input.description.trim(),
        uploads: input.uploads,
      },
    },
  });
}

export async function saveInventionInformationStep(input: {
  serviceIntent: ServiceIntent;
  publicDisclosure: string;
  priorApplications: string;
  competitors: string;
  governmentContract: "yes" | "no";
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
  continueToNextStep: boolean;
}) {
  return persistIntakeDraft({
    serviceIntent: input.serviceIntent,
    pendingPackageKey: input.pendingPackageKey,
    pendingPackageLabel: input.pendingPackageLabel,
    currentStep: input.continueToNextStep ? 7 : 6,
    redirectStep: input.continueToNextStep ? 7 : 6,
    patch: {
      inventionInformation: {
        publicDisclosure: input.publicDisclosure.trim(),
        priorApplications: input.priorApplications.trim(),
        competitors: input.competitors.trim(),
        governmentContract: input.governmentContract,
      },
    },
  });
}

export async function savePackageSelectionStep(input: {
  serviceIntent: ServiceIntent;
  packageKey: string;
  packageLabel: string;
  searchOption:
    | "none"
    | "patent-search-report"
    | "review-existing-search-report";
  continueToNextStep: boolean;
}) {
  return persistIntakeDraft({
    serviceIntent: input.serviceIntent,
    pendingPackageKey: input.packageKey,
    pendingPackageLabel: input.packageLabel,
    currentStep: input.continueToNextStep ? 8 : 7,
    redirectStep: input.continueToNextStep ? 8 : 7,
    patch: {
      packageKey: input.packageKey,
      packageLabel: input.packageLabel,
      searchOption: input.searchOption,
    },
  });
}

export async function advanceOrderSummaryStep(input: {
  serviceIntent: ServiceIntent;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
}) {
  return persistIntakeDraft({
    serviceIntent: input.serviceIntent,
    pendingPackageKey: input.pendingPackageKey,
    pendingPackageLabel: input.pendingPackageLabel,
    currentStep: 9,
    redirectStep: 9,
    patch: {},
  });
}

export async function saveEngagementAgreementStep(input: {
  serviceIntent: ServiceIntent;
  signerName: string;
  signerTitle: string;
  company: string;
  signatureDataUrl: string;
  accepted: boolean;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
  continueToNextStep: boolean;
}) {
  const signedAt = input.accepted ? new Date().toISOString() : null;

  return persistIntakeDraft({
    serviceIntent: input.serviceIntent,
    pendingPackageKey: input.pendingPackageKey,
    pendingPackageLabel: input.pendingPackageLabel,
    currentStep: input.continueToNextStep ? 10 : 9,
    redirectStep: input.continueToNextStep ? 10 : 9,
    patch: {
      engagementAgreement: {
        accepted: input.accepted,
        signerName: input.signerName.trim(),
        signerTitle: input.signerTitle.trim(),
        company: input.company.trim(),
        signatureDataUrl: input.signatureDataUrl,
        signedAt,
      },
    },
  });
}

export async function savePaymentInformationStep(input: {
  serviceIntent: ServiceIntent;
  billingSameAsProfile: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  authorizationSignatureDataUrl: string;
  stripeCheckoutSessionId: string;
  stripeCheckoutStatus: "pending";
  stripePaymentIntentId: string | null;
  stripePaymentStatus: string;
  stripeCustomerEmail: string;
  stripeCurrency: string;
  stripeAmountSubtotal: number;
  stripeAmountTotal: number;
  pendingPackageKey: string | null;
  pendingPackageLabel: string | null;
}) {
  const authorizedAt = new Date().toISOString();

  return persistIntakeDraft({
    serviceIntent: input.serviceIntent,
    pendingPackageKey: input.pendingPackageKey,
    pendingPackageLabel: input.pendingPackageLabel,
    currentStep: 10,
    redirectStep: 10,
    patch: {
      paymentInformation: {
        billingSameAsProfile: input.billingSameAsProfile,
        billingFirstName: input.billingFirstName.trim(),
        billingLastName: input.billingLastName.trim(),
        billingAddress1: input.billingAddress1.trim(),
        billingAddress2: input.billingAddress2.trim(),
        billingCity: input.billingCity.trim(),
        billingState: input.billingState.trim(),
        billingZip: input.billingZip.trim(),
        billingCountry: input.billingCountry.trim(),
        authorizationSignatureDataUrl: input.authorizationSignatureDataUrl,
        authorizedAt,
        stripeCheckoutSessionId: input.stripeCheckoutSessionId,
        stripeCheckoutStatus: input.stripeCheckoutStatus,
        stripePaymentIntentId: input.stripePaymentIntentId,
        stripePaymentStatus: input.stripePaymentStatus,
        stripeCustomerEmail: input.stripeCustomerEmail.trim(),
        stripeCurrency: input.stripeCurrency.trim(),
        stripeAmountSubtotal: input.stripeAmountSubtotal,
        stripeAmountTotal: input.stripeAmountTotal,
        paidAt: null,
      },
    },
  });
}

export async function markStripeCheckoutStatus(input: {
  userId: string;
  serviceIntent: ServiceIntent;
  stripeCheckoutSessionId: string | null;
  stripeCheckoutStatus: "pending" | "paid" | "expired" | "failed";
  stripePaymentIntentId: string | null;
  stripePaymentStatus: string | null;
  stripeCustomerEmail: string | null;
  stripeCurrency: string | null;
  stripeAmountSubtotal: number | null;
  stripeAmountTotal: number | null;
  paidAt: string | null;
}) {
  const context = await getCurrentUserContext();
  const fallbackEmail =
    context?.session.userId === input.userId ? context.session.email : null;
  const fallbackStore = await readAuthStore();
  const fallbackUser = fallbackStore.users.find((entry) => entry.id === input.userId);
  const existingDraft =
    fallbackUser?.intakeDrafts?.[input.serviceIntent] ?? null;
  const existingPayment = existingDraft?.paymentInformation;

  if (!existingDraft || !existingPayment) {
    return {
      ok: false as const,
      message: "We could not locate the stored intake payment details for Stripe.",
    };
  }

  return updateIntakeDraftByUserId({
    userId: input.userId,
    serviceIntent: input.serviceIntent,
    currentStep: input.stripeCheckoutStatus === "paid" ? 11 : 10,
    patch: {
      paymentInformation: {
        ...existingPayment,
        stripeCheckoutSessionId:
          input.stripeCheckoutSessionId ?? existingPayment.stripeCheckoutSessionId,
        stripeCheckoutStatus: input.stripeCheckoutStatus,
        stripePaymentIntentId:
          input.stripePaymentIntentId ?? existingPayment.stripePaymentIntentId,
        stripePaymentStatus:
          input.stripePaymentStatus ?? existingPayment.stripePaymentStatus,
        stripeCustomerEmail:
          input.stripeCustomerEmail ??
          existingPayment.stripeCustomerEmail ??
          fallbackEmail,
        stripeCurrency: input.stripeCurrency ?? existingPayment.stripeCurrency,
        stripeAmountSubtotal:
          input.stripeAmountSubtotal ?? existingPayment.stripeAmountSubtotal,
        stripeAmountTotal:
          input.stripeAmountTotal ?? existingPayment.stripeAmountTotal,
        paidAt: input.paidAt ?? existingPayment.paidAt,
      },
    },
  });
}
