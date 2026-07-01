"use client";

import Link from "next/link";

import { contactDetails, navigationLinks } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--brand-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f7efe8_100%)] text-slate-700">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:gap-10 md:px-6 md:py-14 lg:grid-cols-[0.9fr_0.7fr_0.9fr] lg:px-10">
        <div>
          <h3 className="text-[0.9rem] font-semibold uppercase tracking-[0.14em] text-[var(--brand-ink)] md:text-sm md:tracking-[0.18em]">
            About PatentZoom
          </h3>
          <ul className="mt-4 space-y-3 border-t border-slate-200 text-[0.92rem] md:border-t-0 md:text-sm">
            <li>
              <Link href="/about" className="block border-b border-slate-200 py-2 transition hover:text-slate-950 md:border-b-0 md:py-0">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/knowledge-center" className="block border-b border-slate-200 py-2 transition hover:text-slate-950 md:border-b-0 md:py-0">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/knowledge-center" className="block border-b border-slate-200 py-2 transition hover:text-slate-950 md:border-b-0 md:py-0">
                Obtained Patents
              </Link>
            </li>
            <li>
              <Link href="/knowledge-center" className="block border-b border-slate-200 py-2 transition hover:text-slate-950 md:border-b-0 md:py-0">
                Confidentiality & Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block py-2 transition hover:text-slate-950 md:py-0">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-[0.92rem] md:text-sm">
          <h3 className="font-semibold uppercase tracking-[0.14em] text-[var(--brand-ink)] md:tracking-[0.18em]">
            Contact Us
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-semibold text-[var(--brand-ink)]">Address</p>
              <p>{contactDetails.address}</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--brand-ink)]">Email</p>
              <Link
                href={contactDetails.emailHref}
                className="transition hover:text-slate-950"
              >
                {contactDetails.email}
              </Link>
            </div>
            <div>
              <p className="font-semibold text-[var(--brand-ink)]">Phone</p>
              <Link
                href={contactDetails.phoneHref}
                className="transition hover:text-slate-950"
              >
                {contactDetails.phoneDisplay}
              </Link>
            </div>
            <div>
              <p className="font-semibold text-[var(--brand-ink)]">Office Hours</p>
              <p>{contactDetails.hours}</p>
            </div>
          </div>
        </div>

        <div className="text-[0.92rem] md:text-sm">
          <h3 className="font-semibold uppercase tracking-[0.14em] text-[var(--brand-ink)] md:tracking-[0.18em]">
            Explore
          </h3>
          <ul className="mt-4 space-y-3">
            {navigationLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border-b border-slate-200 py-2 transition hover:text-slate-950 md:border-b-0 md:py-0"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-5 text-center text-[0.72rem] text-slate-500 sm:px-6 md:text-xs lg:px-10">
        Copyright &copy; {new Date().getFullYear()} PatentZoom. Use of this
        website does not create an attorney-client relationship.
      </div>
    </footer>
  );
}
