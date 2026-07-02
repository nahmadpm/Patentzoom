"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { clearAdminSession, loginAdmin } from "@/lib/admin";

export type AdminActionState = {
  errors?: Record<string, string[]>;
  message?: string;
};

const adminLoginSchema = z.object({
  email: z.email({ message: "Please enter a valid admin email." }).trim(),
  password: z.string().trim().min(8, {
    message: "Password must be at least 8 characters.",
  }),
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
