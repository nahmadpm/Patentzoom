"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PatentDirectorySection } from "@/components/patent-directory-section";
import type { ArticleRecord } from "@/lib/admin-content";

export const fallbackFeaturedArticles = [
  {
    category: "Patent Search",
    title: "When a patent search should come before the first filing",
    description:
      "Use search work to decide whether the invention is ready for a provisional, utility, or design filing path.",
    href: "/patent-search",
    image: "/service-technical.svg",
    meta: "8 min read",
  },
  {
    category: "Utility Patent",
    title: "How to decide between a provisional and a non-provisional utility filing",
    description:
      "A founder-focused guide to timing, disclosure risk, and when full claim drafting becomes worth the investment.",
    href: "/utility-patent",
    image: "/service-software.svg",
    meta: "10 min read",
  },
  {
    category: "Design Patent",
    title: "What design patents actually protect for physical products",
    description:
      "Understand when the look, exterior form, and product silhouette deserve a dedicated protection strategy.",
    href: "/design-patent",
    image: "/service-design.svg",
    meta: "7 min read",
  },
] as const;

const knowledgeCategories = [
  {
    title: "Patent Search",
    description:
      "Search-focused resources for understanding prior art, patentability, and filing confidence.",
    icon: "/service-technical.svg",
  },
  {
    title: "Provisional Patent",
    description:
      "Early-stage filing guidance for founders preparing to share, launch, or raise.",
    icon: "/file.svg",
  },
  {
    title: "Utility Patent",
    description:
      "Resources for protecting how an invention works, how it is built, and what it claims.",
    icon: "/service-software.svg",
  },
  {
    title: "Design Patent",
    description:
      "Guides for protecting product appearance, shape, exterior form, and design-led value.",
    icon: "/service-design.svg",
  },
  {
    title: "Patent Filing & Strategy",
    description:
      "Practical guidance on filing sequence, portfolio planning, and choosing the next IP step.",
    icon: "/service-strategy.svg",
  },
  {
    title: "Patent Basics",
    description:
      "Plain-English explainers for founders learning the patent process and core protection options.",
    icon: "/globe.svg",
  },
] as const;

type KnowledgeCategory = (typeof knowledgeCategories)[number]["title"];

const quickAnswers = [
  {
    question: "Should I do a patent search before filing?",
    answer:
      "A patent search is useful when you are unsure how new the invention is, when competitors are close, or when you want more confidence before spending on drafting and filing.",
  },
  {
    question: "When does a provisional filing make more sense than a utility filing?",
    answer:
      "A provisional filing usually makes sense when the invention is still evolving, but you need an early filing date before pitching, publishing, testing, or launching.",
  },
  {
    question: "Can design and utility protection work together?",
    answer:
      "Yes. A utility patent can protect how the invention works, while a design patent can protect how the product looks. Some products benefit from both layers of protection.",
  },
  {
    question: "How should startups sequence filings across multiple inventions?",
    answer:
      "Start with the inventions tied most closely to product value, fundraising, market differentiation, and disclosure risk. Then build a roadmap for follow-on filings as the product matures.",
  },
] as const;

const serviceReads = [
  {
    title: "Provisional Patent",
    description:
      "Early-stage protection guidance for founders preparing to share, launch, or raise.",
    href: "/provisional-patent",
  },
  {
    title: "Utility Patent",
    description:
      "Long-form protection for how the invention works, how it is built, and what it claims.",
    href: "/utility-patent",
  },
  {
    title: "Patent Search",
    description:
      "Landscape research and patentability guidance before you commit to drafting spend.",
    href: "/patent-search",
  },
  {
    title: "Office Action Responses",
    description:
      "Guidance on responding to examiner objections without losing sight of claim value.",
    href: "/office-action-responses",
  },
] as const;

export function KnowledgeCenterPage({ articles }: { articles: ArticleRecord[] }) {
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null);
  const [openAnswer, setOpenAnswer] = useState<string | null>(null);
  const visibleArticles = useMemo(() => {
    if (!selectedCategory) {
      return articles.slice(0, 3);
    }

    return articles.filter(
      (article) =>
        article.category.trim().toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [articles, selectedCategory]);

  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-[#f8f9fb] py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Knowledge Center
            </p>
            <h1 className="mt-5 text-[3.4rem] font-light leading-[0.96] tracking-[-0.05em] text-[#25306b] sm:text-[4.6rem]">
              IP guidance for founders making decisions under pressure.
            </h1>
            <p className="mt-6 max-w-[36rem] text-lg leading-8 text-slate-600">
              This page is the new editorial hub for PatentZoom. It is designed
              to feel more useful than a simple blog list by helping visitors
              move between articles, service pages, and the next consultation
              step with clearer intent.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/patent-search#consultation"
                className="bg-[#fb4522] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
              >
                Ask an IP question
              </Link>
              <Link
                href="/patent-search"
                className="border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
              >
                Explore patent search
              </Link>
            </div>
          </div>

          <article className="border border-slate-200 bg-white p-7 shadow-[0_20px_50px_rgba(37,48,107,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Featured guide
            </p>
            <div className="mt-5 flex items-center justify-center rounded-[24px] bg-[#edf2fb] p-6">
              <Image
                src="/service-strategy.svg"
                alt="Knowledge center featured illustration"
                width={280}
                height={210}
                className="h-auto w-full max-w-[240px] object-contain"
              />
            </div>
            <h2 className="mt-6 text-[2.2rem] font-light leading-none tracking-[-0.04em] text-[#25306b]">
              How founders should sequence search, filing, and portfolio moves
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              Start with the decision framework that ties patent search,
              provisional timing, non-provisional drafting, and longer-term
              portfolio planning into one cleaner roadmap.
            </p>
            <Link
              href="/ip-portfolio-strategy"
              className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
            >
              Read the strategy path
            </Link>
          </article>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap gap-3" aria-label="Knowledge Center category filters">
            {knowledgeCategories.map((category) => {
              const isSelected = selectedCategory === category.title;

              return (
              <button
                key={category.title}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category.title)
                }
                className={`inline-flex items-center border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "border-[#fb4522] bg-[#fb4522] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#fb4522] hover:text-[#fb4522]"
                }`}
              >
                {category.title}
              </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {visibleArticles.map((article) => (
              <article
                key={article.title}
                className="border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(37,48,107,0.06)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                    {article.category}
                  </p>
                  <span className="text-sm text-slate-500">{article.meta}</span>
                </div>
                <Link href={`/knowledge-center/${article.slug}`} className="mt-5 flex h-36 items-center justify-center rounded-[22px] bg-[#edf2fb]">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={180}
                    height={120}
                    className="h-auto max-h-28 w-auto object-contain"
                  />
                </Link>
                <h2 className="mt-6 text-[2rem] font-light leading-9 tracking-[-0.04em] text-[#25306b]">
                  {article.title}
                </h2>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {article.excerpt}
                </p>
                <Link
                  href={`/knowledge-center/${article.slug}`}
                  className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
                >
                  Continue reading
                </Link>
              </article>
            ))}
          </div>

          {visibleArticles.length === 0 ? (
            <div className="mt-10 border border-slate-200 bg-[#f8f9fb] p-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                {selectedCategory}
              </p>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Articles for this category will appear here after they are
                assigned in the admin panel.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <PatentDirectorySection />

      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
            Browse by topic
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {knowledgeCategories.map((category) => {
              const isSelected = selectedCategory === category.title;

              return (
              <button
                key={category.title}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category.title)
                }
                className={`border bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(37,48,107,0.10)] ${
                  isSelected ? "border-[#fb4522]" : "border-slate-200"
                }`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#25306b] bg-[#f8f9fb]">
                  <Image
                    src={category.icon}
                    alt={category.title}
                    width={34}
                    height={34}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h3 className="mt-6 text-[1.65rem] font-light leading-8 tracking-[-0.03em] text-[#25306b]">
                  {category.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {category.description}
                </p>
              </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-10">
          <div className="border border-slate-200 bg-[#243551] p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Quick answers
            </p>
            <h2 className="mt-4 text-[2.8rem] font-light leading-none tracking-[-0.04em] text-[#63cbff]">
              The questions founders ask most often
            </h2>
            <p className="mt-5 text-sm leading-8 text-slate-200">
              These are the recurring questions that usually connect content
              directly to a consultation, a search request, or a service-page
              decision.
            </p>
          </div>

          <div className="grid gap-4">
            {quickAnswers.map((item) => {
              const isOpen = openAnswer === item.question;

              return (
                <article
                  key={item.question}
                  className="border border-slate-200 bg-[#f8f9fb]"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenAnswer(isOpen ? null : item.question)}
                    className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[1.2rem] font-light leading-8 text-[#25306b]">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center border border-slate-300 text-lg leading-none text-[#25306b]"
                    >
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-slate-200 px-6 pb-6 pt-4">
                      <p className="text-sm leading-7 text-slate-600">
                        {item.answer}
                      </p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f8f9fb] py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
                Service-related reads
              </p>
              <h2 className="mt-4 text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
                Move from article to action more easily.
              </h2>
            </div>
            <Link
              href="/patent-search#consultation"
              className="inline-flex text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
            >
              Request consultation
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {serviceReads.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="border border-slate-200 bg-white p-6 transition hover:border-[#fb4522]"
              >
                <h3 className="text-[1.6rem] font-light leading-8 tracking-[-0.03em] text-[#25306b]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-[1.06fr_0.94fr] lg:px-10">
          <div>
            <h2 className="text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
              Content now, CMS later.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              This layout is ready for a future headless CMS migration. The
              visual structure is already set up for featured articles, category
              filters, guides, and service-linked educational content.
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Next best step
            </p>
            <h3 className="mt-4 text-[2.15rem] font-light leading-none tracking-[-0.04em] text-[#25306b]">
              Need help choosing the right protection path?
            </h3>
            <p className="mt-5 text-sm leading-8 text-slate-600">
              If reading raises more strategic questions than answers, use the
              consultation flow and we will help decide whether search,
              provisional, utility, design, or portfolio planning should come
              first.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/patent-search#consultation"
                className="bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
              >
                Ask PatentZoom
              </Link>
              <Link
                href="/patent-search"
                className="border border-slate-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
              >
                Explore Patent Search
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
