import Link from "next/link";

import { adminLogoutAction } from "@/app/actions/admin";
import { requireAdminSession } from "@/lib/admin";
import { listArticles, listPricingRecords } from "@/lib/admin-content";
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

function AdminPanel({
  title,
  eyebrow,
  children,
  aside,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-[#d8e1ee] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow ? (
            <p className="text-[10px] font-bold uppercase text-[#5b77bb]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1 text-[15px] font-bold text-[#06183d]">{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] px-4 py-8 text-center text-[13px] text-[#64748b]">
      {children}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const adminSession = await requireAdminSession();
  const [users, consultations, articles, pricingRecords] = await Promise.all([
    listStoredUsers(),
    readConsultationSubmissions(),
    listArticles(),
    listPricingRecords(),
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
  const unpaidIntakes = intakeRows.filter(
    (row) => row.draft.paymentInformation?.stripeCheckoutStatus !== "paid",
  );
  const uploadCount = intakeRows.reduce(
    (count, row) => count + (row.draft.inventionDetails?.uploads?.length ?? 0),
    0,
  );

  const metrics = [
    { label: "Registered users", value: users.length },
    { label: "Completed profiles", value: completedProfiles.length },
    { label: "Active intakes", value: activeIntakes.length },
    { label: "Paid intakes", value: paidIntakes.length },
    { label: "Open payments", value: unpaidIntakes.length },
    { label: "Consultation leads", value: consultations.length },
    { label: "Uploaded files", value: uploadCount },
    { label: "Services started", value: intakeRows.length },
  ];

  const navSections = [
    { label: "Overview", value: 1, href: "#overview", active: true },
    { label: "Leads", value: consultations.length, href: "#leads" },
    { label: "Accounts", value: users.length, href: "#accounts" },
    { label: "Intake activity", value: intakeRows.length, href: "#intakes" },
    { label: "Payments", value: paidIntakes.length, href: "#payments" },
    { label: "Uploaded files", value: uploadCount, href: "#files" },
    { label: "Pricing", value: pricingRecords.length, href: "/admin/pricing" },
    { label: "Posts", value: articles.length, href: "/admin/posts" },
    { label: "Settings", value: 2, href: "#settings" },
  ];

  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
  const recentIntakes = intakeRows
    .sort(
      (a, b) =>
        new Date(b.draft.updatedAt).getTime() -
        new Date(a.draft.updatedAt).getTime(),
    )
    .slice(0, 10);

  return (
    <main className="min-h-screen scroll-smooth bg-[#f4f0eb] text-[#241c17]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[178px] shrink-0 border-r border-[#e7d9cb] bg-[#fffdf9] p-3 lg:block">
          <div className="rounded-[14px] bg-[#241c17] p-4 text-white shadow-[0_14px_34px_rgba(36,28,23,0.16)]">
            <p className="text-[10px] font-bold uppercase">Admin</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid size-8 place-items-center rounded-[10px] bg-[#fb4522] text-xs font-bold">
                PZ
              </div>
              <div>
                <p className="text-[13px] font-bold leading-tight">
                  PatentZoom
                </p>
                <p className="text-[11px] text-white/82">Management</p>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-5 text-white/84">
              Leads, accounts, intake progress, payment signals, and service
              operations.
            </p>
          </div>

          <div className="mt-3 rounded-[12px] border border-[#e7d9cb] bg-white px-3 py-2 text-[11px] text-[#6f6258]">
            Search admin sections
          </div>

          <nav className="mt-3 space-y-2">
            {navSections.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex h-8 items-center justify-between rounded-[10px] px-3 text-[11px] font-bold ${
                  item.active
                    ? "bg-[#fb4522] text-white"
                    : "border border-[#e7d9cb] bg-white text-[#6f6258] hover:border-[#fb4522]/40 hover:text-[#fb4522]"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`rounded-full px-1.5 text-[10px] ${
                    item.active ? "bg-white/20" : "bg-[#f4f0eb]"
                  }`}
                >
                  {item.value}
                </span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 p-3 sm:p-5">
          <header className="rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] px-4 py-4 shadow-[0_1px_2px_rgba(36,28,23,0.04)] sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#fb4522]">
                  Admin console / Overview
                </p>
                <h1 className="mt-2 text-[22px] font-bold text-[#241c17]">
                  PatentZoom Operations
                </h1>
                <p className="mt-2 max-w-3xl text-[12px] leading-6 text-[#6f6258]">
                  Manage accounts, consultation submissions, intake progress,
                  payment status, and uploaded invention materials from one
                  operational control center.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/"
                  className="rounded-[9px] border border-[#e7d9cb] bg-white px-3 py-2 text-[11px] font-bold text-[#241c17] hover:border-[#fb4522]/40 hover:text-[#fb4522]"
                >
                  Return to public site
                </Link>
                <div className="flex items-center gap-2 rounded-full border border-[#e7d9cb] bg-white px-2 py-1">
                  <span className="grid size-7 place-items-center rounded-full bg-[#fb4522] text-[10px] font-bold text-white">
                    PZ
                  </span>
                  <span className="max-w-[170px] truncate text-[11px] text-[#6f6258]">
                    {adminSession.email}
                  </span>
                </div>
                <form action={adminLogoutAction}>
                  <button
                    type="submit"
                    className="rounded-[9px] border border-[#e7d9cb] bg-white px-3 py-2 text-[11px] font-bold text-[#241c17] hover:border-[#fb4522]/40 hover:text-[#fb4522]"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </header>

          <div className="mt-4 space-y-4">
            <div id="overview" className="scroll-mt-4" />
            <AdminPanel
              title="Operations overview"
              eyebrow="Platform signals"
              aside={
                <p className="text-[11px] text-[#64748b]">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              }
            >
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((item) => (
                  <article
                    key={item.label}
                    className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] p-3"
                  >
                    <p className="text-[11px] text-[#64748b]">{item.label}</p>
                    <p className="mt-2 text-[24px] font-bold leading-none text-[#06183d]">
                      {item.value}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-3 grid gap-2 lg:grid-cols-[1fr_1fr_1.1fr]">
                <div className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] p-3">
                  <p className="text-[11px] font-bold text-[#06183d]">
                    Service mix
                  </p>
                  <div className="mt-3 space-y-2">
                    {Object.entries(
                      intakeRows.reduce<Record<string, number>>((acc, row) => {
                        const key = row.serviceIntent.replace(/-/g, " ");
                        acc[key] = (acc[key] ?? 0) + 1;
                        return acc;
                      }, {}),
                    )
                      .slice(0, 5)
                      .map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between text-[12px] capitalize text-[#64748b]"
                        >
                          <span>{label}</span>
                          <span className="font-bold text-[#06183d]">{value}</span>
                        </div>
                      ))}
                    {!intakeRows.length ? (
                      <p className="text-[12px] text-[#64748b]">
                        No service activity yet.
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] p-3">
                  <p className="text-[11px] font-bold text-[#06183d]">
                    Payment states
                  </p>
                  <div className="mt-3 space-y-2">
                    {[
                      ["Paid", paidIntakes.length],
                      ["Pending or open", unpaidIntakes.length],
                      ["No checkout", intakeRows.length - paidIntakes.length],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between text-[12px] text-[#64748b]"
                      >
                        <span>{label}</span>
                        <span className="font-bold text-[#06183d]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] p-3">
                  <p className="text-[11px] font-bold text-[#06183d]">
                    Publishing
                  </p>
                  <div className="mt-3 space-y-2">
                    {[
                      ["Editable packages", pricingRecords.length],
                      [
                        "Published posts",
                        articles.filter((article) => article.status === "published").length,
                      ],
                      [
                        "Draft posts",
                        articles.filter((article) => article.status === "draft").length,
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3 text-[12px] text-[#64748b]"
                      >
                        <span className="truncate">{label}</span>
                        <span className="shrink-0 font-bold text-[#06183d]">
                          {value}
                        </span>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Link
                        href="/admin/pricing"
                        className="rounded-[9px] bg-[#fb4522] px-3 py-2 text-[11px] font-bold text-white"
                      >
                        Pricing
                      </Link>
                      <Link
                        href="/admin/posts"
                        className="rounded-[9px] border border-[#e7d9cb] bg-white px-3 py-2 text-[11px] font-bold text-[#241c17] hover:text-[#fb4522]"
                      >
                        Posts
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </AdminPanel>

            <div id="intakes" className="scroll-mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <AdminPanel
                title="Service progress and payment state"
                eyebrow="Intake activity"
                aside={
                  <span className="rounded-full bg-[#eef3f8] px-2 py-1 text-[11px] font-bold text-[#64748b]">
                    {intakeRows.length} drafts
                  </span>
                }
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-[12px]">
                    <thead className="border-b border-[#d8e1ee] text-[10px] font-bold uppercase text-[#64748b]">
                      <tr>
                        <th className="pb-2 pr-3">User</th>
                        <th className="pb-2 pr-3">Service</th>
                        <th className="pb-2 pr-3">Step</th>
                        <th className="pb-2 pr-3">Package</th>
                        <th className="pb-2 pr-3">Payment</th>
                        <th className="pb-2">Uploads</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d8e1ee]">
                      {recentIntakes.length ? (
                        recentIntakes.map((row) => (
                          <tr key={`${row.userId}-${row.serviceIntent}`}>
                            <td className="py-3 pr-3 align-top">
                              <p className="font-bold text-[#06183d]">
                                {row.userName}
                              </p>
                              <p className="mt-1 text-[11px] text-[#64748b]">
                                {row.email}
                              </p>
                            </td>
                            <td className="py-3 pr-3 align-top capitalize text-[#64748b]">
                              {row.serviceIntent.replace(/-/g, " ")}
                            </td>
                            <td className="py-3 pr-3 align-top">
                              <span className="rounded-full bg-[#eef3f8] px-2 py-1 text-[10px] font-bold text-[#06183d]">
                                Step {row.draft.currentStep}
                              </span>
                            </td>
                            <td className="py-3 pr-3 align-top text-[#64748b]">
                              {row.draft.packageLabel ?? "Not selected"}
                            </td>
                            <td className="py-3 pr-3 align-top">
                              <span
                                className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                                  row.draft.paymentInformation?.stripeCheckoutStatus ===
                                  "paid"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : row.draft.paymentInformation
                                          ?.stripeCheckoutStatus === "pending"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-[#eef3f8] text-[#64748b]"
                                }`}
                              >
                                {row.draft.paymentInformation
                                  ?.stripeCheckoutStatus ?? "Not started"}
                              </span>
                            </td>
                            <td className="py-3 align-top font-bold text-[#06183d]">
                              {row.draft.inventionDetails?.uploads?.length ?? 0}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6">
                            <EmptyState>No intake drafts have been saved yet.</EmptyState>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </AdminPanel>

              <div id="leads" className="scroll-mt-4">
              <AdminPanel title="Consultation submissions" eyebrow="Recent leads">
                <div className="space-y-2">
                  {consultations.length ? (
                    consultations.slice(0, 8).map((lead) => (
                      <article
                        key={lead.id}
                        className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-[#06183d]">
                              {lead.name}
                            </p>
                            <p className="mt-1 truncate text-[12px] text-[#64748b]">
                              {lead.email}
                            </p>
                          </div>
                          <span className="shrink-0 text-[10px] uppercase text-[#64748b]">
                            {formatDateTime(lead.createdAt)}
                          </span>
                        </div>
                        {lead.message ? (
                          <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#64748b]">
                            {lead.message}
                          </p>
                        ) : null}
                      </article>
                    ))
                  ) : (
                    <EmptyState>No consultation leads have been stored yet.</EmptyState>
                  )}
                </div>
              </AdminPanel>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div id="accounts" className="scroll-mt-4">
              <AdminPanel title="Account roster" eyebrow="Registered users">
                <div className="space-y-2">
                  {recentUsers.length ? (
                    recentUsers.map((user) => (
                      <article
                        key={user.id}
                        className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] px-3 py-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-[13px] font-bold text-[#06183d]">
                              {`${user.firstName} ${user.lastName}`.trim() ||
                                user.email}
                            </p>
                            <p className="mt-1 text-[12px] text-[#64748b]">
                              {user.email}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                              user.passwordHash
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {user.passwordHash ? "Profile ready" : "Needs password"}
                          </span>
                        </div>
                        <div className="mt-2 grid gap-1 text-[12px] text-[#64748b] sm:grid-cols-2">
                          <p>Phone: {user.phone || "Not added"}</p>
                          <p>Created: {formatDateTime(user.createdAt)}</p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <EmptyState>No users have registered yet.</EmptyState>
                  )}
                </div>
              </AdminPanel>
              </div>

              <div id="payments" className="scroll-mt-4">
              <AdminPanel title="Paid work and uploaded materials" eyebrow="Files">
                <div className="space-y-2">
                  {intakeRows.length ? (
                    intakeRows
                      .filter(
                        (row) =>
                          row.draft.paymentInformation?.stripeCheckoutStatus ===
                            "paid" ||
                          (row.draft.inventionDetails?.uploads?.length ?? 0) > 0,
                      )
                      .slice(0, 10)
                      .map((row) => (
                        <article
                          key={`${row.userId}-${row.serviceIntent}-detail`}
                          className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] px-3 py-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-[13px] font-bold text-[#06183d]">
                                {row.userName}
                              </p>
                              <p className="mt-1 text-[12px] capitalize text-[#64748b]">
                                {row.serviceIntent.replace(/-/g, " ")}
                              </p>
                            </div>
                            <span className="rounded-full bg-[#eef3f8] px-2 py-1 text-[10px] font-bold uppercase text-[#64748b]">
                              {row.draft.paymentInformation?.stripeCheckoutStatus ??
                                "Open"}
                            </span>
                          </div>
                          <div className="mt-2 grid gap-1 text-[12px] text-[#64748b] sm:grid-cols-2">
                            <p>
                              Amount:{" "}
                              {row.draft.paymentInformation?.stripeAmountTotal !=
                              null
                                ? `$${(
                                    row.draft.paymentInformation
                                      .stripeAmountTotal / 100
                                  ).toFixed(2)}`
                                : "Not paid"}
                            </p>
                            <p>
                              Files:{" "}
                              {row.draft.inventionDetails?.uploads?.length ?? 0}
                            </p>
                          </div>
                        </article>
                      ))
                  ) : (
                    <EmptyState>
                      No payment or upload activity has been saved yet.
                    </EmptyState>
                  )}
                </div>
              </AdminPanel>
              </div>
            </div>

            <div id="files" className="scroll-mt-4" />
            <div id="settings" className="scroll-mt-4 rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] p-4 text-[12px] text-[#6f6258]">
              Admin recovery is enabled for <span className="font-bold text-[#241c17]">mail@patentzoom.us</span>.
              SMTP delivery still needs to be configured before reset emails can be sent from production.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
