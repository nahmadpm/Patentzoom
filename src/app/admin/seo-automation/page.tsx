import Link from "next/link";

import { runSeoAutomationAction } from "@/app/actions/seo-automation";
import { requireAdminSession } from "@/lib/admin";
import { getSeoAutomationOverview } from "@/lib/seo-automation";

function formatDateTime(value?: string) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: string }) {
  const isGood = status === "published" || status === "connected";
  const isWarning = status === "skipped" || status === "not-connected";

  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
        isGood
          ? "bg-emerald-50 text-emerald-700"
          : isWarning
            ? "bg-amber-50 text-amber-700"
            : "bg-red-50 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

export default async function AdminSeoAutomationPage() {
  await requireAdminSession();
  const overview = await getSeoAutomationOverview();

  return (
    <main className="min-h-screen bg-[#f4f0eb] px-4 py-5 text-[#241c17]">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase text-[#fb4522]">
                Admin / SEO Automation
              </p>
              <h1 className="mt-2 text-2xl font-bold">Automated article publishing</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#6f6258]">
                Daily Knowledge Center article generation runs from GitHub Actions,
                uses the weekday category schedule, and publishes into the existing
                article system.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <form action={runSeoAutomationAction}>
                <button
                  type="submit"
                  className="rounded-[10px] bg-[#fb4522] px-4 py-2 text-[12px] font-bold text-white"
                >
                  Run now
                </button>
              </form>
              <Link
                href="/admin"
                className="rounded-[10px] border border-[#e7d9cb] bg-white px-4 py-2 text-[12px] font-bold hover:border-[#fb4522]/40 hover:text-[#fb4522]"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-4 lg:grid-cols-4">
          {[
            ["Today category", overview.todayCategory ?? "Sunday: no publishing"],
            ["Next run", overview.nextRunLabel],
            ["Auto publish", overview.settings.autoPublish ? "Enabled" : "Disabled"],
            ["Score rule", `Minimum ${overview.settings.minimumScore}, publish best anyway`],
          ].map(([label, value]) => (
            <article
              key={label}
              className="rounded-[16px] border border-[#e7d9cb] bg-[#fffdf9] p-4"
            >
              <p className="text-[11px] font-bold uppercase text-[#6f6258]">
                {label}
              </p>
              <p className="mt-2 text-lg font-bold text-[#06183d]">{value}</p>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] p-5">
          <h2 className="text-lg font-bold text-[#06183d]">Integration status</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {overview.integrations.map((integration) => (
              <article
                key={integration.name}
                className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-bold text-[#06183d]">
                    {integration.name}
                  </p>
                  <StatusBadge status={integration.status} />
                </div>
                <p className="mt-3 text-[12px] leading-6 text-[#64748b]">
                  {integration.message}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#06183d]">Recent automation jobs</h2>
              <p className="mt-1 text-sm text-[#6f6258]">
                Warnings are stored when quality, duplicate-intent, or integration
                checks need attention.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {overview.jobs.length ? (
              overview.jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-[16px] border border-[#d8e1ee] bg-[#f8fbff] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#06183d]">
                          {job.category}
                        </h3>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="mt-2 text-sm text-[#64748b]">
                        {job.selectedKeyword ?? "No keyword selected yet"}
                      </p>
                    </div>
                    <div className="text-right text-[12px] leading-6 text-[#64748b]">
                      <p>Run date: {job.runDate}</p>
                      <p>Completed: {formatDateTime(job.completedAt)}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-[12px] border border-[#d8e1ee] bg-white p-3">
                      <p className="text-[11px] font-bold uppercase text-[#64748b]">
                        Score
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#06183d]">
                        {job.opportunityScore ?? "-"}
                      </p>
                    </div>
                    <div className="rounded-[12px] border border-[#d8e1ee] bg-white p-3">
                      <p className="text-[11px] font-bold uppercase text-[#64748b]">
                        Published URL
                      </p>
                      {job.publishedUrl ? (
                        <Link
                          href={job.publishedUrl}
                          className="mt-1 block truncate text-sm font-bold text-[#fb4522]"
                        >
                          {job.publishedUrl}
                        </Link>
                      ) : (
                        <p className="mt-1 text-sm text-[#64748b]">Not published</p>
                      )}
                    </div>
                    <div className="rounded-[12px] border border-[#d8e1ee] bg-white p-3">
                      <p className="text-[11px] font-bold uppercase text-[#64748b]">
                        Candidates
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#06183d]">
                        {job.candidates.length}
                      </p>
                    </div>
                  </div>

                  {job.brief ? (
                    <details className="mt-4 rounded-[12px] border border-[#d8e1ee] bg-white p-3">
                      <summary className="cursor-pointer text-[12px] font-bold uppercase text-[#06183d]">
                        Research brief
                      </summary>
                      <div className="mt-3 grid gap-3 text-sm leading-7 text-[#64748b] md:grid-cols-2">
                        <p>
                          <span className="font-bold text-[#06183d]">Intent:</span>{" "}
                          {job.brief.searchIntent}
                        </p>
                        <p>
                          <span className="font-bold text-[#06183d]">CTA:</span>{" "}
                          {job.brief.recommendedCta}
                        </p>
                        <p>
                          <span className="font-bold text-[#06183d]">Service page:</span>{" "}
                          {job.brief.relevantServicePage}
                        </p>
                        <p>
                          <span className="font-bold text-[#06183d]">Reason:</span>{" "}
                          {job.brief.reasonForSelection}
                        </p>
                      </div>
                    </details>
                  ) : null}

                  {job.warnings.length ? (
                    <div className="mt-4 rounded-[12px] border border-amber-200 bg-amber-50 p-3 text-sm leading-7 text-amber-800">
                      <p className="font-bold">Warnings</p>
                      <ul className="mt-2 list-disc pl-5">
                        {job.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {job.errors.length ? (
                    <div className="mt-4 rounded-[12px] border border-red-200 bg-red-50 p-3 text-sm leading-7 text-red-700">
                      <p className="font-bold">Errors</p>
                      <ul className="mt-2 list-disc pl-5">
                        {job.errors.map((error) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-[14px] border border-[#d8e1ee] bg-[#f8fbff] px-4 py-8 text-center text-sm text-[#64748b]">
                No SEO automation jobs have run yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
