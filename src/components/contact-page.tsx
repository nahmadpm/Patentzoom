import type { ReactNode } from "react";
import Link from "next/link";

import { ContactPageForm } from "@/components/contact-page-form";
import { contactDetails } from "@/lib/site-data";

function ContactInfoIcon({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-12 w-12 items-center justify-center text-[#25306b]">
      {children}
    </div>
  );
}

const mapQuery = encodeURIComponent(contactDetails.address);

export function ContactPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="py-14">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h1 className="text-center text-[3.1rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.45rem]">
            CONTACT US
          </h1>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <ContactPageForm />
            </div>

            <aside className="self-start">
              <div className="space-y-0 border-t border-slate-300">
                <div className="grid gap-4 border-b border-slate-300 py-5 sm:grid-cols-[56px_1fr]">
                  <ContactInfoIcon>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-9 w-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21s-6-5.6-6-11a6 6 0 1 1 12 0c0 5.4-6 11-6 11Z" />
                      <circle cx="12" cy="10" r="2.6" />
                    </svg>
                  </ContactInfoIcon>
                  <div className="space-y-1">
                    <h2 className="text-[1.7rem] font-medium leading-8 text-slate-900">
                      PatentZoom
                    </h2>
                    <p className="text-[1.02rem] leading-8 text-slate-600">
                      589 S 22nd Street
                      <br />
                      San Jose, CA 95116
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 border-b border-slate-300 py-5 sm:grid-cols-[56px_1fr]">
                  <ContactInfoIcon>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-9 w-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8l-1.3 1.3a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 1.8-.6l3 .5A2 2 0 0 1 22 16.9Z" />
                    </svg>
                  </ContactInfoIcon>
                  <div className="space-y-1">
                    <Link
                      href={contactDetails.phoneHref}
                      className="block text-[1.02rem] leading-8 text-slate-600 transition hover:text-[#25306b]"
                    >
                      {contactDetails.phoneDisplay}
                    </Link>
                    <Link
                      href={contactDetails.whatsappHref}
                      className="block text-[1.02rem] leading-8 text-slate-600 transition hover:text-[#25306b]"
                    >
                      WhatsApp Chat
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 border-b border-slate-300 py-5 sm:grid-cols-[56px_1fr]">
                  <ContactInfoIcon>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-9 w-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </ContactInfoIcon>
                  <div className="space-y-1">
                    <Link
                      href={contactDetails.emailHref}
                      className="block text-[1.02rem] leading-8 text-slate-600 transition hover:text-[#25306b]"
                    >
                      {contactDetails.email}
                    </Link>
                    <p className="text-[1.02rem] leading-8 text-slate-600">
                      For consultations, filing questions, and follow-ups.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 border-b border-slate-300 py-5 sm:grid-cols-[56px_1fr]">
                  <ContactInfoIcon>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-9 w-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M3 10h18" />
                      <path d="M8 14h.01" />
                      <path d="M12 14h.01" />
                      <path d="M16 14h.01" />
                      <path d="M8 18h.01" />
                      <path d="M12 18h.01" />
                      <path d="M16 18h.01" />
                    </svg>
                  </ContactInfoIcon>
                  <div className="space-y-1">
                    <p className="text-[1.02rem] leading-8 text-slate-600">
                      Office Hours: {contactDetails.hours}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200">
        <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
          <div className="overflow-hidden border border-slate-300">
            <iframe
              title="PatentZoom office map"
              src={`https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`}
              className="h-[380px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
