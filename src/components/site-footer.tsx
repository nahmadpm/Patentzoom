"use client";

import Link from "next/link";

import { contactDetails, navigationLinks } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--brand-line)] bg-[linear-gradient(180deg,#fffdf9_0%,#f7efe8_100%)] text-slate-700">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[0.9fr_0.7fr_0.9fr] lg:px-10">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-ink)]">
            About PatentZoom
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/about" className="transition hover:text-slate-950">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/knowledge-center" className="transition hover:text-slate-950">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/knowledge-center" className="transition hover:text-slate-950">
                Obtained Patents
              </Link>
            </li>
            <li>
              <Link href="/knowledge-center" className="transition hover:text-slate-950">
                Confidentiality & Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-slate-950">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <h3 className="font-semibold uppercase tracking-[0.18em] text-[var(--brand-ink)]">
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

        <div className="text-sm">
          <h3 className="font-semibold uppercase tracking-[0.18em] text-[var(--brand-ink)]">
            Explore
          </h3>
          <ul className="mt-4 space-y-3">
            {navigationLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition hover:text-slate-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-6 py-5 text-center text-xs text-slate-500 lg:px-10">
        Copyright &copy; {new Date().getFullYear()} PatentZoom. Use of this
        website does not create an attorney-client relationship.
      </div>
    </footer>
  );
}
