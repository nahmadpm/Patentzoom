"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/admin";
import { runSeoAutomation } from "@/lib/seo-automation";

export async function runSeoAutomationAction() {
  await requireAdminSession();
  await runSeoAutomation({ manual: true, retry: true });
  revalidatePath("/admin");
  revalidatePath("/admin/seo-automation");
  redirect("/admin/seo-automation");
}
