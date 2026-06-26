import Image from "next/image";
import Link from "next/link";

import { HomeHeroCard } from "@/components/home-hero-card";
import { ServicePackageAuthTrigger } from "@/components/service-package-auth-trigger";
import {
  contactDetails,
  type ReferenceServicePageData,
  resourceCards,
} from "@/lib/site-data";
import { type ServiceIntent } from "@/lib/service-intents";

function StatusIcon({ excluded = false }: { excluded?: boolean }) {
  return (
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-full ${
        excluded ? "bg-slate-300 text-white" : "bg-[#fb4522] text-white"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {excluded ? (
          <>
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </>
        ) : (
          <path d="M5 13l4 4L19 7" />
        )}
      </svg>
    </span>
  );
}

function toPackageKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ReferenceServicePage({
  page,
  serviceIntent,
}: {
  page: ReferenceServicePageData;
  serviceIntent: ServiceIntent;
}) {
  const hasSingleOffer = page.offers.cards.length === 1;

  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-[var(--brand-line)] bg-[var(--brand-surface)]">
        <div className="w-full px-0 pt-0">
          <div className="overflow-hidden lg:grid lg:grid-cols-[0.78fr_1.22fr]">
            <div className="flex min-h-[420px] items-center bg-[linear-gradient(160deg,#241c17_0%,#332821_100%)] px-8 py-10 text-white sm:px-12 lg:px-16">
              <div className="max-w-xl">
                <h1 className="max-w-xl text-[3rem] font-light leading-[1.02] tracking-[-0.04em] text-[#ff8f75] sm:text-[4.05rem]">
                  {page.hero.title}
                </h1>
                <p className="mt-5 max-w-[30rem] text-[1rem] leading-8 tracking-[0.02em] text-white/82">
                  {page.hero.summary}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/patent-search#consultation"
                    className="inline-flex items-center rounded-full bg-[#fb4522] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_16px_36px_rgba(251,69,34,0.2)]"
                  >
                    Request consultation
                  </Link>
                  <Link
                    href={contactDetails.phoneHref}
                    className="inline-flex items-center rounded-full border border-white/16 bg-white/5 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white/88 backdrop-blur-sm"
                  >
                    Call {contactDetails.phoneDisplay}
                  </Link>
                </div>
              </div>
            </div>

            <div
              className="relative flex min-h-[420px] items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-6 sm:px-6 lg:px-10 lg:py-7"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.06) 100%), url('${page.hero.image}')`,
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.10),rgba(15,23,42,0.04))]" />
              <div className="relative z-10 mx-auto w-full max-w-[430px]">
                <HomeHeroCard serviceIntent={serviceIntent} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-[3rem] font-light leading-none tracking-[-0.04em] text-[var(--brand-ink)] sm:text-[3.5rem]">
            {page.process.title}
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {page.process.steps.map((step, index) => (
              <article
                key={step.title}
                className={`relative border border-slate-200 px-5 py-6 ${
                  step.imageSrc ? "bg-white text-center shadow-[0_18px_40px_rgba(36,28,23,0.05)]" : "bg-[#f8f9fb]"
                }`}
              >
                {step.imageSrc ? (
                  <div className="mx-auto flex h-28 items-center justify-center">
                    <Image
                      src={step.imageSrc}
                      alt={step.imageAlt ?? step.title}
                      width={160}
                      height={120}
                      className="h-auto max-h-28 w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(251,69,34,0.3)] bg-white text-sm font-semibold text-[#fb4522]">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>
                )}
                <h3
                  className={`mt-5 text-xl font-semibold leading-7 text-[var(--brand-ink)] ${
                    step.imageSrc ? "mx-auto max-w-[18ch]" : ""
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`mt-3 text-sm leading-7 text-slate-600 ${
                    step.imageSrc ? "mx-auto max-w-[24ch]" : ""
                  }`}
                >
                  {step.description}
                </p>
                {step.imageSrc && index < page.process.steps.length - 1 ? (
                  <div className="pointer-events-none absolute -right-3 top-20 hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#fb4522] shadow-sm xl:flex">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-[3rem] font-light leading-none tracking-[-0.04em] text-[var(--brand-ink)] sm:text-[3.5rem]">
            {page.offers.title}
          </h2>
          {hasSingleOffer && page.offers.showcaseImages ? (
            <div className="mx-auto mt-10 grid max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_auto_1.1fr]">
              {page.offers.cards.map((card) => (
                <article
                  key={card.name}
                  className="rounded-[28px] border border-[var(--brand-line)] bg-[var(--brand-surface-alt)] px-7 py-8 text-center shadow-[0_16px_40px_rgba(36,28,23,0.08)]"
                >
                  <h3 className="text-[1.2rem] font-light uppercase tracking-[0.06em] text-[var(--brand-ink)] sm:text-[1.35rem]">
                    {card.name}
                  </h3>
                  <p className="mt-3 text-[4rem] font-light leading-none tracking-[-0.08em] text-slate-950">
                    {card.price}
                  </p>
                  <p className="mt-2 text-[1rem] text-slate-700">{card.fee}</p>

                  <ServicePackageAuthTrigger
                    buttonLabel={card.ctaLabel}
                    buttonClassName="mt-6 w-full rounded-[14px] bg-[#241c17] px-5 py-3.5 text-[1rem] font-medium uppercase tracking-[0.02em] text-white shadow-[0_14px_30px_rgba(36,28,23,0.15)]"
                    serviceIntent={serviceIntent}
                    packageKey={toPackageKey(card.name)}
                    packageLabel={card.name}
                  />

                  <ul className="mt-6 space-y-4 border-t border-[#bccce3] pt-6 text-left">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0">
                          <StatusIcon />
                        </span>
                        <span className="text-[0.98rem] leading-8 text-slate-700">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}

              <div className="hidden items-center justify-center text-[#25306b] lg:flex">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 96 24"
                  className="h-6 w-24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h80" />
                  <path d="M72 4l16 8-16 8" />
                </svg>
              </div>

              <div className="rounded-[24px] border border-dashed border-[rgba(251,69,34,0.32)] bg-white p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  {page.offers.showcaseImages.map((image) => (
                    <div
                      key={image.src}
                      className="flex aspect-square items-center justify-center border border-slate-400 bg-white p-4"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={220}
                        height={220}
                        className="h-auto max-h-full w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`mt-8 grid gap-6 ${
                hasSingleOffer ? "mx-auto max-w-[460px]" : "lg:grid-cols-3"
              }`}
            >
              {page.offers.cards.map((card) => (
                <article
                  key={card.name}
                  className={`relative overflow-hidden border px-6 py-8 text-center ${
                    card.featured
                      ? "border-[rgba(251,69,34,0.28)] bg-[linear-gradient(180deg,#fff4ee_0%,#f6e7da_100%)] shadow-[0_22px_56px_rgba(251,69,34,0.12)]"
                      : "border-[var(--brand-line)] bg-[var(--brand-surface-alt)]"
                  }`}
                >
                  {card.badge ? (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-[12px] bg-[#fb4522] px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                      {card.badge}
                    </span>
                  ) : null}

                  {card.imageSrc ? (
                    <div className="mx-auto mb-6 flex h-36 items-center justify-center">
                      <Image
                        src={card.imageSrc}
                        alt={card.imageAlt ?? card.name}
                        width={220}
                        height={160}
                        className="h-auto max-h-36 w-auto object-contain"
                      />
                    </div>
                  ) : null}

                  <h3 className="mx-auto max-w-[13ch] text-[2.2rem] font-medium leading-[1.04] tracking-[-0.05em] text-slate-950 sm:text-[2.45rem]">
                    {card.name}
                  </h3>
                  <p className="mt-5 text-[3.95rem] font-light leading-none tracking-[-0.07em] text-slate-950 sm:text-[4.25rem]">
                    {card.price}
                  </p>
                  <p className="mt-2 text-[1.05rem] font-medium text-slate-700">
                    {card.fee}
                  </p>

                  <ServicePackageAuthTrigger
                    buttonLabel={card.ctaLabel}
                    buttonClassName={`mt-7 w-full rounded-[14px] px-5 py-4 text-[1.05rem] font-medium uppercase tracking-[0.02em] ${
                      card.featured
                        ? "bg-[#2f3578] text-[#5fd2ff]"
                        : "bg-[#243551] text-white"
                    }`}
                    serviceIntent={serviceIntent}
                    packageKey={toPackageKey(card.name)}
                    packageLabel={card.name}
                  />

                  <div className="mt-7 border-t border-slate-300/90 pt-6 text-left">
                    {card.comparison ? (
                      <div className="grid grid-cols-[auto_auto_1fr] gap-x-4 gap-y-4">
                        {card.bullets.map((bullet, index) => (
                          <div key={bullet} className="contents">
                            <StatusIcon />
                            <StatusIcon
                              excluded={card.comparison?.[index] === "excluded"}
                            />
                            <p className="text-[0.98rem] leading-8 text-slate-700">
                              {bullet}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {card.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-3">
                            <span className="mt-0.5 shrink-0">
                              <StatusIcon />
                            </span>
                            <span className="text-[0.98rem] leading-8 text-slate-700">
                              {bullet}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          <p className="mt-6 text-center text-sm leading-7 text-slate-500">
            {page.offers.footnote}
          </p>
        </div>
      </section>

      {page.comparisonSection ? (
        <section className="bg-white py-16">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <h2 className="text-center text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
              {page.comparisonSection.title}
            </h2>
            <div className="mt-10 overflow-hidden border border-slate-200 bg-[#f8f9fb]">
              <div className="grid border-b border-slate-200 bg-white md:grid-cols-2">
                <div className="px-6 py-5 text-center text-[2rem] font-light tracking-[-0.04em] text-[#25306b]">
                  {page.comparisonSection.leftLabel}
                </div>
                <div className="border-t border-slate-200 px-6 py-5 text-center text-[2rem] font-light tracking-[-0.04em] text-[#25306b] md:border-l md:border-t-0">
                  {page.comparisonSection.rightLabel}
                </div>
              </div>
              {page.comparisonSection.rows.map((row) => (
                <div
                  key={`${row.left}-${row.right}`}
                  className="grid border-t border-slate-200 md:grid-cols-2"
                >
                  <div className="px-6 py-6 text-base leading-8 text-slate-700">
                    {row.left}
                  </div>
                  <div className="border-t border-slate-200 px-6 py-6 text-base leading-8 text-slate-700 md:border-l md:border-t-0">
                    {row.right}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
            {page.includes.title}
          </h2>
          <div className="mt-12 grid gap-x-7 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {page.includes.items.map((item) => (
              <article
                key={item.title}
                className={`relative rounded-[16px] border bg-white px-7 pb-7 pt-10 ${
                  item.iconSrc
                    ? "border-[#25306b] text-center"
                    : "border-slate-200"
                }`}
              >
                {item.iconSrc ? (
                  <div className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#25306b] bg-white">
                    <Image
                      src={item.iconSrc}
                      alt={item.iconAlt ?? item.title}
                      width={34}
                      height={34}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                ) : null}
                <h3 className={`text-[1.15rem] leading-7 text-[#25306b] ${item.iconSrc ? "font-medium uppercase" : "font-semibold"}`}>
                  {item.title}
                </h3>
                <p className={`mt-4 text-sm leading-8 text-slate-700 ${item.iconSrc ? "mx-auto max-w-[30ch]" : ""}`}>
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f8f9fb] py-10">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#25306b]">
            {page.trustStrip.title}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {page.trustStrip.items.map((item) => (
              <div
                key={item}
                className="border border-slate-200 bg-white px-4 py-4 text-center text-sm font-semibold uppercase tracking-[0.08em] text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
            {page.reviews.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-8 text-slate-600">
            {page.reviews.description}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {page.reviews.quotes.map((quote, index) => (
              <article key={quote} className="border border-slate-200 bg-white p-7">
                <p className="text-base leading-8 text-slate-700">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]">
                  Founder scenario {index + 1}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
          <div className="border border-slate-200 bg-white p-8 text-center lg:text-left">
            <p className="text-[3.8rem] font-light leading-none tracking-[-0.06em] text-[#fb4522]">
              {page.proof.stat}
            </p>
            <h2 className="mt-4 text-[2.6rem] font-light leading-none tracking-[-0.04em] text-[#25306b]">
              {page.proof.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {page.proof.description}
            </p>
            <Link
              href={page.proof.ctaHref}
              className="mt-6 inline-flex bg-[#25306b] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
            >
              {page.proof.ctaLabel}
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {page.proof.bullets.map((bullet) => (
              <article
                key={bullet}
                className="flex min-h-52 items-center justify-center border border-slate-200 bg-white px-6 text-center text-xl font-light leading-9 text-slate-700"
              >
                {bullet}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-10">
          <div className="border border-slate-200 bg-[#243551] p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Patent Search
            </p>
            <h2 className="mt-4 text-[2.8rem] font-light leading-none tracking-[-0.04em]">
              {page.searchPrompt.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-200">
              {page.searchPrompt.description}
            </p>
            <Link
              href={page.searchPrompt.ctaHref}
              className="mt-6 inline-flex bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#243551]"
            >
              {page.searchPrompt.ctaLabel}
            </Link>
          </div>

          <div>
            <h2 className="text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
              {page.resources.title}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              {page.resources.description}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {resourceCards.map((card) => (
                <article
                  key={card.title}
                  className="border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-2xl font-light leading-8 text-[#25306b]">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
            <Link
              href={page.resources.ctaHref}
              className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
            >
              {page.resources.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.92fr] lg:px-10">
          <div>
            <h2 className="text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
              {page.finalCta.title}
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {page.finalCta.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={page.finalCta.primaryHref}
                className="bg-[#fb4522] px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white"
              >
                {page.finalCta.primaryLabel}
              </Link>
              <Link
                href={page.finalCta.secondaryHref}
                className="border border-slate-300 px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
              >
                {page.finalCta.secondaryLabel}
              </Link>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <h3 className="text-2xl font-light text-[#25306b]">
              Why this page is built this way
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              This service page is designed to make {page.hero.title.toLowerCase()} feel
              clearer, more professional, and easier to act on than the older
              WordPress-style layout. Once approved, the same structure can be
              rolled out across the rest of PatentZoom&apos;s service pages.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
