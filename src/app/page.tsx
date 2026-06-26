import Link from "next/link";

import { HeroInteractiveShell } from "@/components/hero-interactive-shell";
import { HomeHeroCard } from "@/components/home-hero-card";
import { contactDetails, homepageServices, resourceCards } from "@/lib/site-data";

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
              <h1 className="home-title max-w-3xl text-[3.45rem] leading-[0.93] text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.48)] sm:text-[4.7rem]">
                Protect Your Ideas with Confidence
              </h1>
              <p className="mt-5 max-w-2xl text-[1.18rem] leading-8 text-white drop-shadow-[0_6px_22px_rgba(0,0,0,0.42)] sm:text-[1.32rem]">
                From patent searches to patent filing and prosecution support, we
                help inventors, startups, and businesses secure their
                intellectual property with expert guidance.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/patent-search"
                  className="hero-service-button inline-flex items-center rounded-full bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
                >
                  Patent Search
                </Link>
                <Link
                  href="/utility-patent"
                  className="hero-service-button inline-flex items-center rounded-full border border-white/35 bg-slate-950/36 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm"
                >
                  Patent Filing
                </Link>
                <Link
                  href="/office-action-responses"
                  className="hero-service-button inline-flex items-center rounded-full border border-white/35 bg-slate-950/36 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm"
                >
                  Patent Prosecution
                </Link>
              </div>
            </div>
          </div>
        }
        card={<HomeHeroCard />}
      />

      <section className="bg-white py-14">
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
        className="relative overflow-hidden py-20"
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

      <section className="bg-[#f8f9fb] py-16">
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

      <section className="bg-white py-16">
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
        className="relative overflow-hidden py-20"
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

      <section className="bg-white py-16">
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

      <section className="bg-[#f8f9fb] py-16">
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
