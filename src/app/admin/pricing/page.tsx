import Link from "next/link";

import { AdminPricingForm } from "@/components/admin-pricing-form";
import { requireAdminSession } from "@/lib/admin";
import { listPricingRecords } from "@/lib/admin-content";
import { referenceServicePages } from "@/lib/site-data";

export default async function AdminPricingPage() {
  await requireAdminSession();
  const records = await listPricingRecords();
  const groupedRecords = Object.keys(referenceServicePages).map((serviceKey) => ({
    serviceKey,
    title: referenceServicePages[serviceKey as keyof typeof referenceServicePages].hero.title,
    records: records.filter((record) => record.serviceKey === serviceKey),
  }));

  return (
    <main className="min-h-screen bg-[#f4f0eb] px-4 py-5 text-[#241c17]">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase text-[#fb4522]">
                Admin / Pricing
              </p>
              <h1 className="mt-2 text-2xl font-bold">Service pricing editor</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#6f6258]">
                Update service package prices and labels. Saved changes publish
                immediately to public service pages and checkout pricing.
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-[10px] border border-[#e7d9cb] bg-white px-4 py-2 text-[12px] font-bold hover:border-[#fb4522]/40 hover:text-[#fb4522]"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        <div className="mt-5 space-y-5">
          {groupedRecords.map((group) => (
            <section
              key={group.serviceKey}
              className="rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] p-4"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#fb4522]">
                    {group.serviceKey.replace(/-/g, " ")}
                  </p>
                  <h2 className="mt-1 text-lg font-bold">{group.title}</h2>
                </div>
                <span className="rounded-full bg-[#f4f0eb] px-3 py-1 text-[11px] font-bold text-[#6f6258]">
                  {group.records.length} packages
                </span>
              </div>

              <div className="space-y-3">
                {group.records.map((record) => (
                  <AdminPricingForm
                    key={`${record.serviceKey}-${record.packageKey}`}
                    record={record}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
