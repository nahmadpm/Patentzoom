import Link from "next/link";

import { LeadForm } from "@/components/lead-form";
import { contactDetails } from "@/lib/site-data";

export function PageShell({
  eyebrow,
  title,
  summary,
  bullets,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  bullets: readonly string[];
}) {
  return (
    <main className="relative overflow-hidden">
      <section className="relative border-b border-white/10">
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,#1d4ed8_0%,rgba(15,23,42,0)_60%)] opacity-30" />
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div className="relative z-10 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              {eyebrow}
            </p>
            <h1 className="max-w-3xl font-serif text-5xl leading-none tracking-tight text-white sm:text-6xl">
              {title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              {summary}
            </p>
            <ul className="grid gap-3 text-sm text-slate-200">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/patent-search#consultation"
                className="inline-flex items-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Request consultation
              </Link>
              <Link
                href={contactDetails.phoneHref}
                className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30"
              >
                Call {contactDetails.phoneDisplay}
              </Link>
            </div>
          </div>

          <div className="relative z-10">
            <LeadForm compact />
          </div>
        </div>
      </section>
    </main>
  );
}
