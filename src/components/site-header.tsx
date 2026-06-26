"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  contactDetails,
  homepageServiceMenu,
  navigationLinks,
} from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [sessionState, setSessionState] = useState<{
    authenticated: boolean;
  }>({
    authenticated: false,
  });

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        authenticated: boolean;
      };

      setSessionState({ authenticated: data.authenticated });
    } catch {
      setSessionState({ authenticated: false });
    }
  }, []);

  useEffect(() => {
    void loadSession();

    const handlePageShow = () => {
      void loadSession();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handlePageShow);
    };
  }, [loadSession]);

  const usesLightChrome =
    pathname === "/" ||
    pathname === "/account" ||
    pathname === "/contact" ||
    pathname === "/blog" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/patent-search" ||
    pathname === "/knowledge-center" ||
    pathname === "/provisional-patent" ||
    pathname === "/utility-patent" ||
    pathname === "/design-patent" ||
    pathname === "/trademark" ||
    pathname === "/pct-international" ||
    pathname === "/office-action-responses" ||
    pathname === "/ip-portfolio-strategy" ||
    pathname.startsWith("/intake/");

  if (usesLightChrome) {
    return (
      <header className="sticky top-0 z-50 border-b border-[var(--brand-line)] bg-[rgba(255,253,249,0.94)] text-slate-800 shadow-[0_12px_34px_rgba(36,28,23,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 pb-0 pt-3.5 lg:px-10">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/patentzoom-logo.svg"
              alt="PatentZoom logo"
              width={250}
              height={63}
              priority
              className="h-auto w-[210px] sm:w-[228px]"
            />
          </Link>

          <div className="hidden items-center gap-1 text-[14px] text-slate-500 md:flex">
            <Link href="/contact" className="transition hover:text-[#fb4522]">
              Contact Us
            </Link>
            <span>|</span>
            <Link href="/knowledge-center" className="transition hover:text-[#fb4522]">
              Blog
            </Link>
            <span>|</span>
            {sessionState.authenticated ? (
              <>
                <Link href="/account" className="transition hover:text-[#fb4522]">
                  My Account
                </Link>
                <span>|</span>
                <Link href="/logout" className="transition hover:text-[#fb4522]">
                  Sign Out
                </Link>
              </>
            ) : (
              <Link href="/login" className="transition hover:text-[#fb4522]">
                Sign In
              </Link>
            )}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-6 pt-2 pb-3 lg:px-10">
          <div className="group relative hidden lg:block">
            <button
              type="button"
              className="rounded-full bg-[#fb4522] px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(251,69,34,0.2)]"
            >
              Menu of Services
            </button>
            <div className="invisible absolute left-0 top-full z-50 mt-2 w-[300px] translate-y-1 rounded-[24px] border border-[var(--brand-line)] bg-[var(--brand-surface)] opacity-0 shadow-[0_24px_60px_rgba(36,28,23,0.14)] transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="space-y-4 p-4">
                {homepageServiceMenu.map((section) => (
                  <div key={section.title}>
                    <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-900">
                      {section.title}
                    </p>
                    <ul className="space-y-2">
                      {section.links.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="block text-[15px] text-slate-700 transition hover:text-[#fb4522]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Link
                href="/patent-search"
                className="block rounded-b-[24px] bg-[#fb4522] px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-white"
              >
                Open Full Menu
              </Link>
            </div>
          </div>
          <nav className="hidden flex-wrap items-center gap-[26px] text-[15px] font-medium text-slate-700 lg:flex">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[#fb4522]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(36,28,23,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/patentzoom-logo.svg"
              alt="PatentZoom logo"
              width={210}
              height={53}
              className="h-auto w-[185px]"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-200 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={contactDetails.phoneHref}
            className="text-sm font-medium text-slate-200 transition hover:text-white"
          >
            {contactDetails.phoneDisplay}
          </Link>
          <Link
            href="/patent-search#consultation"
            className="inline-flex items-center justify-center rounded-full bg-[#fb4522] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(251,69,34,0.2)] transition hover:bg-[#e43b19]"
          >
            Book consultation
          </Link>
        </div>
      </div>
    </header>
  );
}
