import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminSession, isAdminConfigured } from "@/lib/admin";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const configured = isAdminConfigured();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f5_0%,#f8fafc_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
            PatentZoom Admin
          </p>
          <h1 className="max-w-xl text-[3.25rem] font-light leading-none tracking-[-0.06em] text-[#1f2d4d]">
            Manage leads, intake progress, and payment activity in one place.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            This first admin panel is connected to the live PatentZoom account
            store, intake drafts, uploaded invention files, and consultation
            submissions already captured by the website.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Live visibility
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                See user accounts, payment state, and intake progress without
                opening files on the server.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Founder-focused
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Track who registered, what service they selected, and how far
                they reached in the intake.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Stripe-aware
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Review checkout session status and payment milestones tied to
                each intake draft.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Secure Access
            </p>
            <h2 className="mt-4 text-[2rem] font-light leading-none tracking-[-0.05em] text-[#1f2d4d]">
              Sign in to the admin dashboard
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Use the admin credentials stored in the PatentZoom production
              environment.
            </p>
          </div>

          {!configured ? (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
              Add <code>PATENTZOOM_ADMIN_EMAIL</code> and{" "}
              <code>PATENTZOOM_ADMIN_PASSWORD</code> to your environment before
              using this panel.
            </div>
          ) : null}

          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}
