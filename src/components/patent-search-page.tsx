import Image from "next/image";
import Link from "next/link";

import { HomeHeroCard } from "@/components/home-hero-card";
import { contactDetails, resourceCards } from "@/lib/site-data";

const searchSteps = [
  {
    title: "Share the invention context",
    description:
      "Start with sketches, product notes, screenshots, or a quick explanation of what makes the idea different.",
    icon: "/file.svg",
  },
  {
    title: "Define the search angle",
    description:
      "We align the search around the function, visual features, or technical workflow that matters most to your filing path.",
    icon: "/icon-consult.svg",
  },
  {
    title: "Review the prior-art landscape",
    description:
      "The search report highlights similar patents, pending applications, and the patterns that affect novelty and claim direction.",
    icon: "/globe.svg",
  },
  {
    title: "Plan the next move",
    description:
      "Use the results to decide whether to file, refine the invention, or adjust the protection strategy before spending more.",
    icon: "/icon-live.svg",
  },
] as const;

const searchCoverage = [
  {
    title: "U.S. granted patents",
    description:
      "Review published U.S. patents and applications that may shape patentability or claim scope.",
    image: "/service-mechanical.svg",
  },
  {
    title: "International references",
    description:
      "Expand the landscape review with WIPO and other international references when market reach matters.",
    image: "/service-technical.svg",
  },
  {
    title: "Design and product look-alikes",
    description:
      "Surface visual similarity and design-led overlap when shape, appearance, or brand presentation matters.",
    image: "/service-design.svg",
  },
] as const;

const deliverables = [
  "Landscape summary explaining where the closest references sit",
  "Search results organized around the invention's strongest differentiators",
  "Consultation guidance on whether a patent filing should come next",
  "A clearer basis for drafting claims or refining the invention first",
] as const;

const reasonsToSearch = [
  {
    title: "Avoid filing blind",
    description:
      "A search helps you understand whether the current invention direction is worth turning into a full filing.",
  },
  {
    title: "Improve patentability",
    description:
      "Seeing similar references early can help you refine features, positioning, and claim language before drafting begins.",
  },
  {
    title: "Support founder decisions",
    description:
      "Search work can reduce wasted legal spend and make roadmap, launch, and diligence conversations more informed.",
  },
] as const;

const contactChannels = [
  {
    label: "Call PatentZoom",
    value: contactDetails.phoneDisplay,
    href: contactDetails.phoneHref,
  },
  {
    label: "Email us",
    value: contactDetails.email,
    href: contactDetails.emailHref,
  },
  {
    label: "WhatsApp chat",
    value: "Start a quick conversation",
    href: contactDetails.whatsappHref,
  },
] as const;

export function PatentSearchPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="overflow-hidden lg:grid lg:grid-cols-[0.78fr_1.22fr]">
          <div className="flex min-h-[440px] items-center bg-[#243551] px-8 py-12 text-white sm:px-12 lg:px-16">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#fb4522]">
                Patent Search
              </p>
              <h1 className="mt-5 max-w-xl text-[3rem] font-light leading-[1.02] tracking-[-0.05em] text-[#63cbff] sm:text-[4.05rem]">
                Understand the prior-art landscape before you file.
              </h1>
              <p className="mt-5 max-w-[32rem] text-[1rem] leading-8 tracking-[0.02em] text-white/92">
                A patent search helps inventors, founders, and product teams see
                what already exists, where novelty may still live, and whether
                the next step should be a filing, refinement, or broader IP
                strategy conversation.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#consultation"
                  className="inline-flex items-center bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
                >
                  Start patent search
                </Link>
                <Link
                  href={contactDetails.phoneHref}
                  className="inline-flex items-center border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
                >
                  Call {contactDetails.phoneDisplay}
                </Link>
              </div>
            </div>
          </div>

          <div
            className="relative flex min-h-[440px] items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8 sm:px-6 lg:px-10"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.06) 100%), url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.22),rgba(15,23,42,0.10))]" />
            <div id="consultation" className="relative z-10 mx-auto w-full max-w-[430px]">
              <HomeHeroCard serviceIntent="patent-search" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.45rem]">
            How the search process works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {searchSteps.map((step, index) => (
              <article
                key={step.title}
                className="border border-slate-200 bg-[#f8f9fb] p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#25306b] bg-white">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-[1.55rem] font-light leading-8 tracking-[-0.03em] text-[#25306b]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
          <div className="border border-slate-200 bg-white p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              U.S. and international scope
            </p>
            <h2 className="mt-4 text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.3rem]">
              Search coverage that supports better filing decisions.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              PatentZoom uses search work to create clarity before the drafting
              stage. The goal is not just a list of references, but a more
              useful read on whether your invention looks promising, crowded, or
              ready for a more strategic claim approach.
            </p>

            <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
              {deliverables.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#66c96a] text-sm font-semibold text-white">
                    ✓
                  </span>
                  <p className="text-sm leading-8 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {searchCoverage.map((item) => (
              <article
                key={item.title}
                className="border border-slate-200 bg-white p-6 text-center shadow-[0_18px_40px_rgba(37,48,107,0.06)]"
              >
                <div className="mx-auto flex h-32 items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={180}
                    height={130}
                    className="h-auto max-h-28 w-auto object-contain"
                  />
                </div>
                <h3 className="mt-4 text-[1.55rem] font-light leading-8 tracking-[-0.03em] text-[#25306b]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
            Why teams start with search
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {reasonsToSearch.map((reason) => (
              <article
                key={reason.title}
                className="border border-slate-200 bg-[#f8f9fb] p-7"
              >
                <h3 className="text-[1.7rem] font-light leading-8 tracking-[-0.03em] text-[#25306b]">
                  {reason.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {reason.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f8f9fb] py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <div className="border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Need a faster answer?
            </p>
            <h2 className="mt-4 text-[2.9rem] font-light leading-none tracking-[-0.04em] text-[#25306b]">
              Talk through the invention with PatentZoom.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              If you are not sure whether to start with a search, a provisional
              filing, or a utility application, use the consultation form or
              contact us directly and we will help you choose the stronger next
              step.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {contactChannels.map((channel) => (
                <Link
                  key={channel.label}
                  href={channel.href}
                  className="border border-slate-200 bg-[#f8f9fb] px-5 py-5 transition hover:border-[#fb4522]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {channel.label}
                  </p>
                  <p className="mt-3 text-[1rem] font-medium text-[#25306b]">
                    {channel.value}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 bg-[#243551] p-8 text-white">
            <p className="text-[3.7rem] font-light leading-none tracking-[-0.06em] text-[#fb4522]">
              Before filing
            </p>
            <h3 className="mt-4 text-[2.3rem] font-light leading-none tracking-[-0.04em] text-[#63cbff]">
              Search can save time, budget, and drafting effort.
            </h3>
            <p className="mt-5 text-sm leading-8 text-slate-200">
              When the landscape is crowded, the smarter move may be refining
              the invention or adjusting the filing approach before spending
              more on a full application.
            </p>
            <div className="mt-8 rounded-[20px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-8 text-slate-200">
                Address: {contactDetails.address}
              </p>
              <p className="mt-2 text-sm leading-8 text-slate-200">
                Office hours: {contactDetails.hours}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                Knowledge Center
              </p>
              <h2 className="mt-4 text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
                Learn before you spend more on filing.
              </h2>
            </div>
            <Link
              href="/knowledge-center"
              className="inline-flex text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
            >
              Visit Knowledge Center
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
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
        </div>
      </section>
    </main>
  );
}
