"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  clearSession,
  loginUser,
  registerStarterUser,
  requestTemporaryPassword,
  resetPasswordWithTemporary,
  updateCurrentUserProfile,
} from "@/lib/auth";
import { sendTemporaryPasswordEmail } from "@/lib/mailer";
import { normalizeServiceIntent } from "@/lib/service-intents";

export type AuthActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  mode?: "request" | "reset";
  email?: string;
  delivery?: "smtp" | "outbox";
};

const registerStarterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name." }),
  email: z.email({ message: "Please enter a valid email address." }).trim(),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Please enter a valid phone number." }),
});

const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }).trim(),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters." }),
});

const accountSchema = z
  .object({
    firstName: z.string().trim().min(1, { message: "First name is required." }),
    lastName: z.string().trim().min(1, { message: "Last name is required." }),
    email: z.email({ message: "Please enter a valid email address." }).trim(),
    phone: z.string().trim().min(7, { message: "Phone number is required." }),
    address1: z.string().trim().min(3, { message: "Address is required." }),
    address2: z.string().trim().optional(),
    city: z.string().trim().min(2, { message: "City is required." }),
    state: z.string().trim().min(2, { message: "State is required." }),
    zip: z.string().trim().min(4, { message: "ZIP / postal code is required." }),
    country: z.string().trim().min(2, { message: "Country is required." }),
    bestTime: z.string().trim().min(2, { message: "Choose a contact time." }),
    password: z.string().trim().optional(),
    confirmPassword: z.string().trim().optional(),
  })
  .superRefine((data, context) => {
    if (data.password && data.password.length < 8) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters.",
        path: ["password"],
      });
    }

    if ((data.password || data.confirmPassword) && data.password !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }).trim(),
});

const resetTemporaryPasswordSchema = z
  .object({
    email: z.email({ message: "Please enter a valid email address." }).trim(),
    temporaryPassword: z
      .string()
      .trim()
      .min(6, { message: "Enter the temporary password from your email." }),
    newPassword: z
      .string()
      .trim()
      .min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .trim()
      .min(8, { message: "Please retype the new password." }),
  })
  .superRefine((data, context) => {
    if (data.newPassword !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export async function registerStarterAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validated = registerStarterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies AuthActionState;
  }

  const result = await registerStarterUser({
    ...validated.data,
    pendingService: normalizeServiceIntent(formData.get("serviceIntent")),
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies AuthActionState;
  }

  redirect(result.redirectTo);
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies AuthActionState;
  }

  const result = await loginUser({
    ...validated.data,
    pendingService: normalizeServiceIntent(formData.get("serviceIntent")),
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies AuthActionState;
  }

  redirect(result.redirectTo);
}

export async function updateAccountAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validated = accountSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address1: formData.get("address1"),
    address2: formData.get("address2"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
    country: formData.get("country"),
    bestTime: formData.get("bestTime"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    } satisfies AuthActionState;
  }

  const passwordRequired = String(formData.get("passwordRequired") ?? "") === "true";

  if (passwordRequired && !validated.data.password) {
    return {
      errors: {
        password: ["Please create a password to continue."],
      },
    } satisfies AuthActionState;
  }

  const result = await updateCurrentUserProfile({
    firstName: validated.data.firstName,
    lastName: validated.data.lastName,
    email: validated.data.email,
    phone: validated.data.phone,
    address1: validated.data.address1,
    address2: validated.data.address2 ?? "",
    city: validated.data.city,
    state: validated.data.state,
    zip: validated.data.zip,
    country: validated.data.country,
    bestTime: validated.data.bestTime,
    password: validated.data.password || undefined,
    pendingService: normalizeServiceIntent(formData.get("serviceIntent")),
    pendingPackageKey: String(formData.get("packageKey") ?? "").trim() || null,
    pendingPackageLabel: String(formData.get("packageLabel") ?? "").trim() || null,
  });

  if (!result.ok) {
    return {
      message: result.message,
    } satisfies AuthActionState;
  }

  redirect(result.redirectTo);
}

export async function requestPasswordResetAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validated = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      mode: "request",
    } satisfies AuthActionState;
  }

  const result = await requestTemporaryPassword({
    email: validated.data.email,
    sendEmail: sendTemporaryPasswordEmail,
  });

  if (!result.ok) {
    return {
      mode: "request",
      message: result.message,
    } satisfies AuthActionState;
  }

  return {
    mode: "reset",
    email: result.email,
    message: result.message,
    delivery: result.delivery,
  } satisfies AuthActionState;
}

export async function resetPasswordWithTemporaryAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validated = resetTemporaryPasswordSchema.safeParse({
    email: formData.get("email"),
    temporaryPassword: formData.get("temporaryPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      mode: "reset",
      email: String(formData.get("email") ?? ""),
    } satisfies AuthActionState;
  }

  const result = await resetPasswordWithTemporary({
    email: validated.data.email,
    temporaryPassword: validated.data.temporaryPassword,
    newPassword: validated.data.newPassword,
  });

  if (!result.ok) {
    return {
      mode: "reset",
      email: validated.data.email,
      message: result.message,
    } satisfies AuthActionState;
  }

  redirect(result.redirectTo);
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
