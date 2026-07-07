import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminResetPasswordForm } from "@/components/admin-reset-password-form";
import { getAdminSession, isAdminConfigured } from "@/lib/admin";

export default async function AdminResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const configured = isAdminConfigured();
  const { token = "" } = await searchParams;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f5_0%,#f8fafc_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
            PatentZoom Admin
          </p>
          <h1 className="max-w-xl text-[3rem] font-light leading-none tracking-[-0.06em] text-[#1f2d4d]">
            Create a new admin password.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            This one-time reset link verifies access to the configured admin
            mailbox before changing the admin password.
          </p>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Secure Reset
            </p>
            <h2 className="mt-4 text-[2rem] font-light leading-none tracking-[-0.05em] text-[#1f2d4d]">
              Set password
            </h2>
          </div>

          {!configured ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
              Admin recovery is not configured yet.
            </div>
          ) : token ? (
            <AdminResetPasswordForm token={token} />
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-700">
                This reset link is missing its secure token.
              </div>
              <Link
                href="/admin/forgot-password"
                className="block text-center text-sm font-semibold text-[#1f4faa] underline underline-offset-4"
              >
                Request a new reset link
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
