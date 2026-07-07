"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  clearAdminSession,
  loginAdmin,
  requestAdminPasswordReset,
  resetAdminPasswordWithToken,
} from "@/lib/admin";
import { sendAdminPasswordResetEmail } from "@/lib/mailer";

export type AdminActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  delivery?: "smtp" | "outbox";
};

const adminLoginSchema = z.object({
  email: z.email({ message: "Please enter a valid admin email." }).trim(),
  password: z.string().trim().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const adminResetRequestSchema = z.object({
  email: z.email({ message: "Please enter a valid admin email." }).trim(),
});

const adminResetPasswordSchema = z
  .object({
    token: z.string().trim().min(20, {
      message: "Use the secure reset link from the admin email.",
    }),
    newPassword: z.string().trim().min(12, {
      message: "Use at least 12 characters for the admin password.",
    }),
    confirmPassword: z.string().trim().min(12, {
      message: "Please retype the new password.",
    }),
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

export async function adminLoginAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const validated = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const result = await loginAdmin(validated.data);

  if (!result.ok) {
    return {
      message: result.message,
    };
  }

  redirect(result.redirectTo);
}

export async function adminLogoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function adminPasswordResetRequestAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const validated = adminResetRequestSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const result = await requestAdminPasswordReset({
    email: validated.data.email,
    sendEmail: sendAdminPasswordResetEmail,
  });

  if (!result.ok) {
    return {
      message: result.message,
    };
  }

  return {
    message: result.message,
    delivery: result.delivery,
  };
}

export async function adminPasswordResetAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const validated = adminResetPasswordSchema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const result = await resetAdminPasswordWithToken({
    token: validated.data.token,
    newPassword: validated.data.newPassword,
  });

  if (!result.ok) {
    return {
      message: result.message,
    };
  }

  redirect(result.redirectTo);
}
