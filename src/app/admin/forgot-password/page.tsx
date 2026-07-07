import { redirect } from "next/navigation";

import { AdminForgotPasswordForm } from "@/components/admin-forgot-password-form";
import { getAdminSession, isAdminConfigured } from "@/lib/admin";

export default async function AdminForgotPasswordPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const configured = isAdminConfigured();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f5_0%,#f8fafc_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
            PatentZoom Admin
          </p>
          <h1 className="max-w-xl text-[3rem] font-light leading-none tracking-[-0.06em] text-[#1f2d4d]">
            Reset admin access through the verified mailbox.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            The reset link is sent only to the configured admin email address
            and expires after 30 minutes.
          </p>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Secure Recovery
            </p>
            <h2 className="mt-4 text-[2rem] font-light leading-none tracking-[-0.05em] text-[#1f2d4d]">
              Email a reset link
            </h2>
          </div>

          {!configured ? (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
              Add <code>PATENTZOOM_ADMIN_EMAIL</code> and{" "}
              <code>PATENTZOOM_ADMIN_PASSWORD</code> to your environment before
              using admin recovery.
            </div>
          ) : null}

          <AdminForgotPasswordForm />
        </section>
      </div>
    </main>
  );
}
