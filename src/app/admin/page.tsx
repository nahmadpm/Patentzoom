import { adminLogoutAction } from "@/app/actions/admin";
import { requireAdminSession } from "@/lib/admin";
import { listStoredUsers, type IntakeDraft } from "@/lib/auth";
import { readConsultationSubmissions } from "@/lib/consultations";
import type { ServiceIntent } from "@/lib/service-intents";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type IntakeRow = {
  userId: string;
  userName: string;
  email: string;
  serviceIntent: ServiceIntent;
  draft: IntakeDraft;
};

export default async function AdminDashboardPage() {
  const adminSession = await requireAdminSession();
  const [users, consultations] = await Promise.all([
    listStoredUsers(),
    readConsultationSubmissions(),
  ]);

  const intakeRows: IntakeRow[] = users.flatMap((user) =>
    Object.entries(user.intakeDrafts ?? {}).flatMap(([serviceIntent, draft]) =>
      draft
        ? [
            {
              userId: user.id,
              userName: `${user.firstName} ${user.lastName}`.trim() || user.email,
              email: user.email,
              serviceIntent: serviceIntent as ServiceIntent,
              draft,
            },
          ]
        : [],
    ),
  );

  const paidIntakes = intakeRows.filter(
    (row) => row.draft.paymentInformation?.stripeCheckoutStatus === "paid",
  );
  const activeIntakes = intakeRows.filter((row) => row.draft.currentStep < 11);
  const completedProfiles = users.filter(
    (user) =>
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

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <section className="border-b border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              PatentZoom Admin
            </p>
            <h1 className="mt-4 text-[2.8rem] font-light leading-none tracking-[-0.06em] text-[#1f2d4d]">
              Operations Dashboard
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
              Review registered users, consultation leads, intake completion,
              Stripe payment status, and uploaded invention files from one
              place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              Signed in as <span className="font-semibold text-slate-900">{adminSession.email}</span>
            </div>
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="inline-flex rounded-full bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#e63c18]"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Registered users", value: users.length, note: "Accounts created through website forms" },
            { label: "Completed profiles", value: completedProfiles.length, note: "Users with contact profile and password saved" },
            { label: "Active intakes", value: activeIntakes.length, note: "Drafts still moving through intake steps" },
            { label: "Paid intakes", value: paidIntakes.length, note: "Stripe checkout marked as paid" },
            { label: "Consultation leads", value: consultations.length, note: "Contact and consultation submissions saved" },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-4 text-[2.25rem] font-light leading-none tracking-[-0.05em] text-[#1f2d4d]">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.note}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                  Intake activity
                </p>
                <h2 className="mt-3 text-[2rem] font-light leading-none tracking-[-0.05em] text-[#1f2d4d]">
                  Service progress and payment state
                </h2>
              </div>
              <p className="text-sm text-slate-500">{intakeRows.length} drafts</p>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  <tr>
                    <th className="pb-3 pr-4 font-semibold">User</th>
                    <th className="pb-3 pr-4 font-semibold">Service</th>
                    <th className="pb-3 pr-4 font-semibold">Step</th>
                    <th className="pb-3 pr-4 font-semibold">Package</th>
                    <th className="pb-3 pr-4 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Uploads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {intakeRows.length ? (
                    intakeRows
                      .sort(
                        (a, b) =>
                          new Date(b.draft.updatedAt).getTime() -
                          new Date(a.draft.updatedAt).getTime(),
                      )
                      .map((row) => (
                        <tr key={`${row.userId}-${row.serviceIntent}`}>
                          <td className="py-4 pr-4 align-top">
                            <p className="font-semibold text-slate-900">{row.userName}</p>
                            <p className="mt-1 text-xs text-slate-500">{row.email}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              Updated {formatDateTime(row.draft.updatedAt)}
                            </p>
                          </td>
                          <td className="py-4 pr-4 align-top capitalize text-slate-700">
                            {row.serviceIntent.replace(/-/g, " ")}
                          </td>
                          <td className="py-4 pr-4 align-top">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700">
                              Step {row.draft.currentStep}
                            </span>
                          </td>
                          <td className="py-4 pr-4 align-top text-slate-700">
                            {row.draft.packageLabel ?? "Not selected"}
                          </td>
                          <td className="py-4 pr-4 align-top">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                                row.draft.paymentInformation?.stripeCheckoutStatus === "paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : row.draft.paymentInformation?.stripeCheckoutStatus === "pending"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {row.draft.paymentInformation?.stripeCheckoutStatus ?? "Not started"}
                            </span>
                          </td>
                          <td className="py-4 align-top text-slate-700">
                            {row.draft.inventionDetails?.uploads?.length ?? 0}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                        No intake drafts have been saved yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                Recent leads
              </p>
              <h2 className="mt-3 text-[2rem] font-light leading-none tracking-[-0.05em] text-[#1f2d4d]">
                Consultation submissions
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {consultations.length ? (
                consultations.slice(0, 12).map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{lead.name}</p>
                        <p className="mt-1 text-sm text-slate-600">{lead.email}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.12em] text-slate-400">
                        {formatDateTime(lead.createdAt)}
                      </span>
                    </div>
                    {lead.phone ? (
                      <p className="mt-3 text-sm text-slate-600">Phone: {lead.phone}</p>
                    ) : null}
                    {lead.company ? (
                      <p className="mt-1 text-sm text-slate-600">Company: {lead.company}</p>
                    ) : null}
                    {lead.message ? (
                      <p className="mt-3 text-sm leading-7 text-slate-600">{lead.message}</p>
                    ) : null}
                  </article>
                ))
              ) : (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                  No consultation leads have been stored yet.
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                Registered users
              </p>
              <h2 className="mt-3 text-[2rem] font-light leading-none tracking-[-0.05em] text-[#1f2d4d]">
                Account roster
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {users.length ? (
                users
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                  )
                  .slice(0, 20)
                  .map((user) => (
                    <article
                      key={user.id}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {`${user.firstName} ${user.lastName}`.trim() || user.email}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                            user.passwordHash
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {user.passwordHash ? "Profile ready" : "Needs password"}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <p>Phone: {user.phone || "Not added"}</p>
                        <p>Created: {formatDateTime(user.createdAt)}</p>
                        <p className="sm:col-span-2">
                          Address: {user.address1 ? `${user.address1}, ${user.city}, ${user.state} ${user.zip}` : "Not added"}
                        </p>
                      </div>
                    </article>
                  ))
              ) : (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                  No users have registered yet.
                </div>
              )}
            </div>
          </article>

          <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                Payments and files
              </p>
              <h2 className="mt-3 text-[2rem] font-light leading-none tracking-[-0.05em] text-[#1f2d4d]">
                Paid work and uploaded materials
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {intakeRows.length ? (
                intakeRows
                  .filter(
                    (row) =>
                      row.draft.paymentInformation?.stripeCheckoutStatus === "paid" ||
                      (row.draft.inventionDetails?.uploads?.length ?? 0) > 0,
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.draft.updatedAt).getTime() -
                      new Date(a.draft.updatedAt).getTime(),
                  )
                  .slice(0, 20)
                  .map((row) => (
                    <article
                      key={`${row.userId}-${row.serviceIntent}-detail`}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{row.userName}</p>
                          <p className="mt-1 text-sm capitalize text-slate-600">
                            {row.serviceIntent.replace(/-/g, " ")}
                          </p>
                        </div>
                        {row.draft.paymentInformation?.stripeCheckoutStatus ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">
                            {row.draft.paymentInformation.stripeCheckoutStatus}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <p>
                          Package: {row.draft.packageLabel ?? "Not selected"}
                        </p>
                        <p>
                          Amount: {row.draft.paymentInformation?.stripeAmountTotal != null
                            ? `$${(row.draft.paymentInformation.stripeAmountTotal / 100).toFixed(2)}`
                            : "Not paid"}
                        </p>
                        <p>
                          Files uploaded: {row.draft.inventionDetails?.uploads?.length ?? 0}
                        </p>
                        <p>
                          Last updated: {formatDateTime(row.draft.updatedAt)}
                        </p>
                      </div>

                      {row.draft.inventionDetails?.uploads?.length ? (
                        <ul className="mt-4 space-y-2">
                          {row.draft.inventionDetails.uploads.slice(0, 5).map((file) => (
                            <li
                              key={file.id}
                              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                            >
                              {file.originalName}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))
              ) : (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                  No payment or upload activity has been saved yet.
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
