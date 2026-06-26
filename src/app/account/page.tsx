import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { AccountProfileForm } from "@/components/account-profile-form";
import { contactDetails } from "@/lib/site-data";
import {
  getCurrentUserContext,
  isProfileComplete,
} from "@/lib/auth";
import {
  getIntakeHref,
  getServiceIntentLabel,
} from "@/lib/service-intents";

export default async function AccountPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect("/login");
  }

  const { session, user } = context;
  const profileComplete = isProfileComplete(user);

  return (
    <main className="bg-[#f8f9fb] py-16 text-slate-900">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
            My Account
          </p>
          <h1 className="mt-4 text-[3rem] font-light leading-none tracking-[-0.05em] text-[#25306b] sm:text-[3.4rem]">
            Complete your PatentZoom profile
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            Your account now holds the contact information, service intent, and
            future intake progress we&apos;ll use across PatentZoom. This is the
            Phase 1 scaffold for the fuller account-to-intake experience.
          </p>

          <div className="mt-8">
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
              pendingService={session.pendingService}
            />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-[#243551] p-8 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Account Status
            </p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-[20px] border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  Signed in as
                </p>
                <p className="mt-2 text-lg font-medium text-white">
                  {session.displayName}
                </p>
                <p className="mt-1 text-sm text-white/72">{session.email}</p>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  Profile readiness
                </p>
                <p className="mt-2 text-lg font-medium text-white">
                  {profileComplete ? "Ready for intake" : "Needs completion"}
                </p>
                <p className="mt-1 text-sm leading-7 text-white/72">
                  {profileComplete
                    ? "You can continue directly into the next PatentZoom intake step."
                    : "Add address details and set a password so the intake flow can continue cleanly."}
                </p>
              </div>
              {session.pendingService ? (
                <div className="rounded-[20px] border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                    Pending service
                  </p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {getServiceIntentLabel(session.pendingService)}
                  </p>
                  {session.pendingPackageLabel ? (
                    <p className="mt-2 text-sm font-medium text-white/88">
                      Package: {session.pendingPackageLabel}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm leading-7 text-white/72">
                    This service will be preselected when you enter the intake wizard.
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-[2rem] font-light leading-none tracking-[-0.04em] text-[#25306b]">
              Next action
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              This scaffold already remembers the service the user started from.
              The next implementation phase will replace this placeholder intake
              with the full multi-step PatentZoom wizard.
            </p>

            {session.pendingService ? (
              <Link
                href={getIntakeHref(session.pendingService, session.pendingPackageKey)}
                className="mt-6 inline-flex rounded-full bg-[#fb4522] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
              >
                Continue to {getServiceIntentLabel(session.pendingService)}
              </Link>
            ) : (
              <Link
                href="/patent-search"
                className="mt-6 inline-flex rounded-full bg-[#25306b] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
              >
                Choose a service
              </Link>
            )}

            <div className="mt-8 border-t border-slate-200 pt-6 text-sm leading-7 text-slate-600">
              <p>Phone: {contactDetails.phoneDisplay}</p>
              <p>Email: {contactDetails.email}</p>
              <p>Address: {contactDetails.address}</p>
            </div>

            <form action={logoutAction} className="mt-6">
              <button
                type="submit"
                className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500 transition hover:text-[#fb4522]"
              >
                Sign Out
              </button>
            </form>
          </section>
        </aside>
      </div>
    </main>
  );
}
