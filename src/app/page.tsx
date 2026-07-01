import Image from "next/image";
import Link from "next/link";

import { HeroInteractiveShell } from "@/components/hero-interactive-shell";
import { HomeHeroCard } from "@/components/home-hero-card";
import {
  contactDetails,
  founderSignals,
  homepageServices,
  processSteps,
  resourceCards,
} from "@/lib/site-data";

const advantageItems = [
  {
    title: "Startup-focused strategy",
    description: "Built for VC-backed and growth-stage companies that need IP to match momentum.",
  },
  {
    title: "Transparent investment structure",
    description: "Clearer expectations around filing paths, timing, and scope before work expands.",
  },
  {
    title: "Fast, responsive communication",
    description: "A better fit for founders who cannot wait through slow traditional workflows.",
  },
  {
    title: "Deep understanding of VC dynamics",
    description: "Guidance shaped by diligence pressure, roadmap timing, and defensibility questions.",
  },
  {
    title: "Long-term portfolio thinking",
    description: "Individual filings are treated as part of a roadmap instead of one-off transactions.",
  },
];

const testimonials = [
  "We came in needing clarity around timing and left with a filing strategy that actually matched the roadmap.",
  "The process felt far more strategic than simply getting a patent application on file.",
  "What changed most was the quality of the defensibility story we could tell around the company.",
];

const mobileAdvantageItems = [
  {
    title: "Licensed Patent Practitioners",
    description:
      "Our team of patent attorneys and agents help founders move from concept to filing with clearer strategic guidance.",
    iconSrc: "/icon-consult.svg",
  },
  {
    title: "Fixed Fees First",
    description:
      "Clear pricing before work begins, so startup teams can plan protection without surprise legal cost drift.",
    iconSrc: "/icon-receipt.svg",
  },
  {
    title: "Live Team Monday-Friday",
    description:
      "Reach PatentZoom by phone or email during the work week while deadlines, launches, and diligence questions are active.",
    iconSrc: "/icon-live.svg",
  },
  {
    title: "Electronic Signing",
    description:
      "Review and sign core documents digitally from your phone or laptop without breaking momentum.",
    iconSrc: "/icon-specs.svg",
  },
  {
    title: "Screen Share Meetings",
    description:
      "Talk through product details, drafts, and filing questions together when the invention needs real-time review.",
    iconSrc: "/globe.svg",
  },
];

const mobileServiceCards = [
  {
    title: "Provisional Patent Application",
    description:
      "Temporary for 12 months, perfect for early disclosure timing and startup launch prep.",
    href: "/provisional-patent",
    iconSrc: "/file.svg",
  },
  {
    title: "Non-Provisional Utility Patent Application",
    description:
      "Protect how the invention works and the systems, methods, or components that create advantage.",
    href: "/utility-patent",
    iconSrc: "/service-software.svg",
  },
  {
    title: "Non-Provisional Design Patent Application",
    description:
      "Protect the exterior design and appearance when product form itself drives value.",
    href: "/design-patent",
    iconSrc: "/service-design.svg",
  },
  {
    title: "Patent Search Report",
    description:
      "Learn what already exists and where novelty may still be protected before filing decisions harden.",
    href: "/patent-search",
    iconSrc: "/service-pct.svg",
  },
  {
    title: "IP Portfolio Strategy",
    description:
      "Map what to file now, what can wait, and how patents support diligence and valuation later.",
    href: "/ip-portfolio-strategy",
    iconSrc: "/service-strategy.svg",
  },
];

const heroImage =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80";

const serviceImages = [
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
];

const articleImages = [
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?auto=format&fit=crop&w=900&q=80",
];

const testimonialBackground =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80";

const knowledgeBackground =
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80";

export default function Home() {
  return (
    <main className="home-reference overflow-hidden">
      <HeroInteractiveShell
        backgroundImage={heroImage}
        content={
          <div className="relative z-10 max-w-3xl">
            <div className="hero-content-glow absolute -left-10 top-6 h-44 w-44 rounded-full bg-[#fb4522]/12 blur-3xl" />
            <div className="relative">
              <h1 className="home-title max-w-[10.5ch] text-[2.25rem] leading-[0.92] text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.48)] min-[390px]:text-[2.55rem] sm:max-w-3xl sm:text-[4.7rem]">
                Protect Your Ideas with Confidence
              </h1>
              <p className="mt-4 max-w-xl text-[0.97rem] leading-7 text-white drop-shadow-[0_6px_22px_rgba(0,0,0,0.42)] sm:mt-5 sm:max-w-2xl sm:text-[1.32rem] sm:leading-8">
                From patent searches to patent filing and prosecution support, we
                help inventors, startups, and businesses secure their
                intellectual property with expert guidance.
              </p>
              <div className="mt-6 hidden max-w-[22rem] grid-cols-2 gap-3 sm:mt-8 sm:max-w-none sm:flex sm:flex-wrap">
                <Link
                  href="/patent-search"
                  className="hero-service-button inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#fb4522] px-4 py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white sm:px-5 sm:text-sm sm:tracking-[0.08em]"
                >
                  Patent Search
                </Link>
                <Link
                  href="/utility-patent"
                  className="hero-service-button inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/35 bg-slate-950/36 px-4 py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm sm:px-5 sm:text-sm sm:tracking-[0.08em]"
                >
                  Patent Filing
                </Link>
                <Link
                  href="/office-action-responses"
                  className="hero-service-button col-span-2 inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/35 bg-slate-950/36 px-4 py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm sm:px-5 sm:text-sm sm:tracking-[0.08em]"
                >
                  Patent Prosecution
                </Link>
              </div>
            </div>
          </div>
        }
        card={<HomeHeroCard />}
      />

      <section className="md:hidden bg-white py-10">
        <div className="mx-auto w-full max-w-7xl px-4">
          <h2 className="home-section-title text-center text-[1.95rem] leading-none text-[#25306b]">
            WHY FOUNDERS CHOOSE PATENTZOOM
          </h2>
          <div className="mt-7 space-y-7">
            {mobileAdvantageItems.map((item) => (
              <article
                key={item.title}
                className="border-b border-slate-200 pb-7 text-center last:border-b-0 last:pb-0"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#cfd7e4] bg-white">
                  <Image src={item.iconSrc} alt="" width={28} height={28} className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-[1.15rem] font-semibold uppercase leading-6 text-[#25306b]">
                  {item.title}
                </h3>
                <p className="mx-auto mt-3 max-w-[20rem] text-[0.92rem] leading-7 text-slate-500">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="md:hidden bg-[#eef4ff] py-10">
        <div className="mx-auto w-full max-w-7xl px-4 text-center">
          <h2 className="home-section-title text-[1.85rem] leading-tight text-[#25306b]">
            BUILT FOR STARTUP VELOCITY
          </h2>
          <div className="mt-8 space-y-4">
            {founderSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-[18px] border border-[#d7e1f0] bg-white px-4 py-4 text-[0.96rem] font-medium leading-7 text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
              >
                {signal}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="md:hidden bg-white py-10">
        <div className="mx-auto w-full max-w-7xl px-4">
          <h2 className="home-section-title text-center text-[1.9rem] leading-tight text-[#25306b]">
            STARTUP IP SERVICES
          </h2>
          <div className="mt-8 space-y-6">
            {mobileServiceCards.map((service) => (
              <article key={service.title} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-[var(--brand-surface-alt)]">
                    <Image src={service.iconSrc} alt="" width={28} height={28} className="h-7 w-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[1rem] font-semibold uppercase leading-6 text-[#25306b]">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-[0.92rem] leading-7 text-slate-500">
                      {service.description}
                    </p>
                    <Link
                      href={service.href}
                      className="mt-3 inline-flex text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-[#25306b] underline underline-offset-4"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-7 text-center">
            <Link
              href="/patent-search"
              className="inline-flex rounded-full bg-[#61789d] px-5 py-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-white"
            >
              Go To The Menu Of Services
            </Link>
          </div>
        </div>
      </section>

      <section className="md:hidden relative overflow-hidden bg-[#101827] py-10 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,39,0.72),rgba(16,24,39,0.9))]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 text-center">
          <h2 className="home-section-title text-[1.95rem] leading-tight text-white">
            THE PATENTZOOM PROCESS
          </h2>
          <p className="mx-auto mt-3 max-w-[18rem] text-[0.92rem] leading-7 text-white/75">
            A clearer path from invention framing to filing strategy, built for fast-moving startup teams.
          </p>
          <div className="mt-7 space-y-4">
            {processSteps.map((step) => (
              <article
                key={step.step}
                className="rounded-[18px] border border-white/12 bg-white/8 px-4 py-4 text-left backdrop-blur-sm"
              >
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[#ff9b82]">
                  Step {step.step}
                </p>
                <h3 className="mt-2 text-[1.05rem] font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.92rem] leading-7 text-white/72">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="md:hidden bg-white py-10">
        <div className="mx-auto w-full max-w-7xl px-4 text-center">
          <h2 className="home-section-title text-[1.9rem] leading-tight text-[#25306b]">
            CLIENT REVIEWS
          </h2>
          <p className="mt-3 text-[0.92rem] leading-7 text-slate-500">
            Startup-focused feedback on how PatentZoom helps teams move from uncertainty to a filing plan.
          </p>
          <article className="mx-auto mt-6 max-w-[22rem] rounded-[20px] border border-slate-200 bg-white p-5 text-left shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-surface-alt)] text-sm font-semibold text-[#25306b]">
                PZ
              </div>
              <div>
                <p className="font-semibold text-slate-800">PatentZoom Client</p>
                <p className="text-xs text-slate-400">Startup founder feedback</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {testimonials[0]}
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#fb4522]">★★★★★</span>
              <span className="text-slate-400">Founder perspective</span>
            </div>
          </article>
        </div>
      </section>

      <section
        className="mobile-bg-scroll md:hidden relative overflow-hidden py-10"
        style={{
          backgroundImage: `linear-gradient(rgba(58,43,28,0.74), rgba(58,43,28,0.74)), url('${knowledgeBackground}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,20,12,0.22),rgba(29,20,12,0.62))]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 text-center">
          <h2 className="home-section-title text-[1.85rem] leading-tight text-white">
            PATENTZOOM KNOWLEDGE CENTER
          </h2>
          <p className="mx-auto mt-3 max-w-[18rem] text-[0.92rem] leading-7 text-white/80">
            Read articles about how to best protect your intellectual property rights.
          </p>
          <div className="mt-7 space-y-4">
            {resourceCards.map((card, index) => (
              <article key={card.title} className="overflow-hidden rounded-[18px] bg-white shadow-[0_20px_42px_rgba(15,23,42,0.18)]">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${articleImages[index]}')`,
                  }}
                />
                <div className="px-4 py-4">
                  <h3 className="text-[0.92rem] font-semibold uppercase leading-6 text-[#25306b]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.08em] text-slate-400">
                    May 27, 2026
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/knowledge-center"
              className="inline-flex rounded-full bg-[#61789d] px-6 py-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-white"
            >
              Knowledge Center
            </Link>
          </div>
        </div>
      </section>

      <section className="md:hidden bg-[#152235] py-10 text-white">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(50,73,104,0.55),rgba(18,28,43,0.9))] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.28)]">
            <h2 className="text-[1.55rem] font-semibold leading-tight">
              Talk to us and get started!
            </h2>
            <p className="mt-3 text-[0.95rem] leading-7 text-white/75">
              Speak with one of our team members to get started with the right patent strategy.
            </p>
            <Link
              href="/contact"
              className="mt-5 flex w-full items-center justify-center rounded-[14px] border border-[#4a6488] bg-transparent px-4 py-3 text-[0.9rem] font-semibold uppercase tracking-[0.08em] text-white"
            >
              Talk or Chat With Us
            </Link>
          </div>
          <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-white/95 p-2 shadow-[0_24px_50px_rgba(0,0,0,0.28)]">
            <HomeHeroCard
              registerSubmitLabel="Register"
              helperLabel=""
              description="Protect your intellectual property rights today."
              contentAlign="center"
            />
          </div>
        </div>
      </section>

      <section className="hidden bg-white py-14 md:block">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="home-section-title text-center text-[3.35rem] leading-none text-[#25306b]">
            THE REALITY FUNDED FOUNDERS FACE
          </h2>
          <div className="mt-10 grid border-y border-slate-200 md:grid-cols-5">
            {advantageItems.map((item, index) => (
              <article
                key={item.title}
                className={`flex min-h-[255px] flex-col items-center px-6 py-10 text-center ${
                  index < advantageItems.length - 1 ? "md:border-r md:border-slate-200" : ""
                }`}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#25306b] text-2xl text-[#25306b]">
                  {index + 1}
                </div>
                <h3 className="mt-8 text-[1.7rem] font-light leading-tight text-[#25306b]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="mobile-bg-scroll relative overflow-hidden py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(58,43,28,0.76), rgba(58,43,28,0.76)), url('${knowledgeBackground}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,20,12,0.18),rgba(29,20,12,0.58))]" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="home-section-title text-center text-[3.15rem] leading-none text-white">
            BUILT FOR STARTUP VELOCITY
          </h2>
          <div className="mt-8 grid gap-4 border-y border-white/20 py-6 text-center text-lg text-white/88 md:grid-cols-3">
            <div>Aligned with fundraising milestones</div>
            <div>Claims structured for competitive protection</div>
            <div>Filing timelines mapped to product releases</div>
          </div>
        </div>
      </section>

      <section className="hidden bg-[#f8f9fb] py-16 md:block">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="home-section-title text-center text-[3.3rem] leading-none text-[#25306b]">
            STRATEGIC IP SERVICES FOR GROWTH-STAGE STARTUPS
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {homepageServices.map((service, index) => (
              <article
                key={service.href}
                className="overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                <div
                  className="h-52 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(30,41,59,0.22), rgba(30,41,59,0.22)), url('${serviceImages[index % serviceImages.length]}')`,
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold uppercase leading-7 text-[#25306b]">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              type="button"
              className="bg-[#25306b] px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white"
            >
              Go To The Menu Of Services
            </button>
          </div>
        </div>
      </section>

      <section className="hidden bg-white py-16 md:block">
        <div className="mx-auto w-full max-w-7xl px-6 text-center lg:px-10">
          <h2 className="home-section-title text-[3.35rem] leading-none text-[#25306b]">
            BEFORE & AFTER PATENTZOOM
          </h2>
          <p className="mt-4 text-[1.9rem] font-light text-slate-700">
            The shift is not just legal filing. It is a stronger IP roadmap.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "No clear IP roadmap",
              "Board scrutiny around defensibility",
              "Reactive filing decisions",
            ].map((item) => (
              <div
                key={item}
                className="flex min-h-56 items-center justify-center border border-slate-200 bg-[linear-gradient(135deg,#f4f7fb,#dde6f4)] px-6 text-center text-2xl font-light text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button
              type="button"
              className="border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
            >
              Clear IP roadmap aligned with funding stages
            </button>
          </div>
        </div>
      </section>

      <section
        className="mobile-bg-scroll relative overflow-hidden py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(39,30,20,0.72), rgba(39,30,20,0.72)), url('${testimonialBackground}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,18,13,0.35),rgba(23,18,13,0.62))]" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="home-section-title text-center text-[3.15rem] leading-none text-white">
            WHY FUNDED FOUNDERS CHOOSE PATENTZOOM
          </h2>
          <p className="mt-4 text-center text-[1.85rem] font-light text-white/88">
            Startup-native guidance for companies building quickly under real pressure.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((quote, index) => (
              <article
                key={quote}
                className="rounded-[20px] border border-white/40 bg-[rgba(255,255,255,0.94)] p-7 shadow-[0_22px_50px_rgba(15,23,42,0.18)]"
              >
                <p className="text-base leading-8 text-slate-700">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]">
                  Priority {index + 1}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden bg-white py-16 md:block">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="home-section-title text-center text-[3.15rem] leading-none text-[#25306b]">
            THE STARTUP IP ROADMAP
          </h2>
          <p className="mt-4 text-center text-[1.85rem] font-light text-slate-700">
            Learn how patents affect valuation, timing, and long-term leverage.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {resourceCards.map((card, index) => (
              <article key={card.title} className="border border-slate-200 bg-white">
                <div
                  className="h-52 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(30,41,59,0.18), rgba(30,41,59,0.18)), url('${articleImages[index]}')`,
                  }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-light leading-8 text-[#25306b]">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>
                  <p className="mt-4 text-sm text-slate-500">May 27, 2026</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/knowledge-center"
              className="text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
            >
              Knowledge Center
            </Link>
          </div>
        </div>
      </section>

      <section className="hidden bg-[#f8f9fb] py-16 md:block">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.95fr] lg:px-10">
          <div>
            <h2 className="home-section-title text-[3.15rem] leading-none text-[#25306b]">
              Build a defensible company, not just a funded one.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              If you have raised capital, your IP strategy should match your ambition. Book a strategic IP session and align your patents with your roadmap, diligence priorities, and valuation goals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/patent-search#consultation"
                className="bg-red-600 px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white"
              >
                Schedule Your Strategic IP Session
              </Link>
              <Link
                href={contactDetails.phoneHref}
                className="border border-slate-300 px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
              >
                {contactDetails.phoneDisplay}
              </Link>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-6">
            <h3 className="text-2xl font-light text-[#25306b]">
              What we help founders answer
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              What is your defensibility? How strong are your claims? Is your IP aligned with the roadmap? What happens during diligence? Those are the questions this strategy work is built to answer.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
