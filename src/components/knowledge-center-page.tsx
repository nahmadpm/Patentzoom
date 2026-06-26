import Image from "next/image";
import Link from "next/link";

const featuredArticles = [
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

const topicGroups = [
  {
    title: "Filing strategy",
    description:
      "Guides on provisional, utility, design, international, and office-action timing.",
    href: "/provisional-patent",
    icon: "/file.svg",
  },
  {
    title: "Prior-art and patentability",
    description:
      "Search-focused articles to help founders assess novelty before spending more on drafting.",
    href: "/patent-search",
    icon: "/globe.svg",
  },
  {
    title: "Startup IP planning",
    description:
      "Resources on portfolio sequencing, fundraising readiness, and smarter IP prioritization.",
    href: "/ip-portfolio-strategy",
    icon: "/service-strategy.svg",
  },
  {
    title: "Brand and design protection",
    description:
      "Coverage around visual identity, product form, trademark, and design-led defensibility.",
    href: "/trademark",
    icon: "/service-trademark.svg",
  },
] as const;

const quickAnswers = [
  "Should I do a patent search before filing?",
  "When does a provisional filing make more sense than a utility filing?",
  "Can design and utility protection work together?",
  "How should startups sequence filings across multiple inventions?",
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

export function KnowledgeCenterPage() {
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
          <div className="flex flex-wrap gap-3">
            {topicGroups.map((group) => (
              <Link
                key={group.title}
                href={group.href}
                className="inline-flex items-center border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#fb4522] hover:text-[#fb4522]"
              >
                {group.title}
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredArticles.map((article) => (
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
                <div className="mt-5 flex h-36 items-center justify-center rounded-[22px] bg-[#edf2fb]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={180}
                    height={120}
                    className="h-auto max-h-28 w-auto object-contain"
                  />
                </div>
                <h2 className="mt-6 text-[2rem] font-light leading-9 tracking-[-0.04em] text-[#25306b]">
                  {article.title}
                </h2>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {article.description}
                </p>
                <Link
                  href={article.href}
                  className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]"
                >
                  Continue reading
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <h2 className="text-center text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
            Browse by topic
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {topicGroups.map((group) => (
              <Link
                key={group.title}
                href={group.href}
                className="border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(37,48,107,0.10)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#25306b] bg-[#f8f9fb]">
                  <Image
                    src={group.icon}
                    alt={group.title}
                    width={34}
                    height={34}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h3 className="mt-6 text-[1.65rem] font-light leading-8 tracking-[-0.03em] text-[#25306b]">
                  {group.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-600">
                  {group.description}
                </p>
              </Link>
            ))}
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
            {quickAnswers.map((question) => (
              <article
                key={question}
                className="border border-slate-200 bg-[#f8f9fb] px-6 py-5"
              >
                <p className="text-[1.2rem] font-light leading-8 text-[#25306b]">
                  {question}
                </p>
              </article>
            ))}
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
              pages, guides, and service-linked educational content.
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
