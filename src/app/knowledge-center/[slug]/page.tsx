import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getArticleBySlug } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://patentzoom.us").replace(/\/$/, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    return {};
  }

  const url = article.canonicalUrl || `${getAppUrl()}/knowledge-center/${article.slug}`;
  const title = article.seoTitle || article.title;
  const description = article.metaDescription || article.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.openGraphTitle || title,
      description: article.openGraphDescription || description,
      type: "article",
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: article.imageUrl, alt: article.title }],
    },
  };
}

function renderMarkdownBlock(block: string) {
  if (block.startsWith("### ")) {
    return (
      <h3 key={block} className="pt-4 text-2xl font-semibold leading-8 text-[#25306b]">
        {block.replace(/^###\s+/, "")}
      </h3>
    );
  }

  if (block.startsWith("## ")) {
    return (
      <h2 key={block} className="pt-6 text-[2rem] font-semibold leading-9 text-[#25306b]">
        {block.replace(/^##\s+/, "")}
      </h2>
    );
  }

  if (/^[-*]\s/m.test(block)) {
    const items = block
      .split(/\n/)
      .map((item) => item.replace(/^[-*]\s+/, "").trim())
      .filter(Boolean);

    return (
      <ul key={block} className="list-disc space-y-2 pl-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p key={block}>{block}</p>;
}

export default async function KnowledgeArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  const paragraphs = article.body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const canonicalUrl = article.canonicalUrl || `${getAppUrl()}/knowledge-center/${article.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.seoTitle || article.title,
    description: article.metaDescription || article.excerpt,
    image: article.imageUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: article.author || "PatentZoom Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "PatentZoom",
      url: getAppUrl(),
    },
    mainEntityOfPage: canonicalUrl,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Knowledge Center",
        item: `${getAppUrl()}/knowledge-center`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="bg-white text-slate-900">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="border-b border-slate-200 bg-[#f8f9fb] py-14">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[1fr_0.72fr] lg:px-10">
          <div>
            <Link
              href="/knowledge-center"
              className="text-sm font-semibold uppercase tracking-[0.08em] text-[#fb4522]"
            >
              Knowledge Center
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              {article.category}
            </p>
            <h1 className="mt-5 text-[3rem] font-light leading-[0.98] tracking-[-0.05em] text-[#25306b] sm:text-[4rem]">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {article.excerpt}
            </p>
            <p className="mt-5 text-sm text-slate-500">{article.meta}</p>
            {article.primaryKeyword ? (
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Target keyword: {article.primaryKeyword}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-center rounded-[24px] border border-slate-200 bg-white p-8">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={360}
              height={260}
              className="h-auto max-h-64 w-auto object-contain"
            />
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14 lg:px-0">
        {article.shortAnswer ? (
          <div className="mb-10 rounded-[24px] border border-slate-200 bg-[#f8f9fb] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#fb4522]">
              Short answer
            </p>
            <p className="mt-3 text-lg leading-8 text-[#25306b]">
              {article.shortAnswer}
            </p>
          </div>
        ) : null}

        {article.keyTakeaways?.length ? (
          <div className="mb-10 rounded-[24px] border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold text-[#25306b]">Key takeaways</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-8 text-slate-700">
              {article.keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {article.tableOfContents?.length ? (
          <nav className="mb-10 rounded-[24px] border border-slate-200 bg-[#f8f9fb] p-6">
            <h2 className="text-2xl font-semibold text-[#25306b]">Table of contents</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-8 text-slate-700">
              {article.tableOfContents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="space-y-6 text-base leading-8 text-slate-700">
          {paragraphs.map(renderMarkdownBlock)}
        </div>

        {article.faqs?.length ? (
          <section className="mt-12">
            <h2 className="text-[2rem] font-semibold text-[#25306b]">FAQs</h2>
            <div className="mt-5 space-y-4">
              {article.faqs.map((faq) => (
                <div key={faq.question} className="rounded-[18px] border border-slate-200 bg-[#f8f9fb] p-5">
                  <h3 className="text-lg font-semibold text-[#25306b]">{faq.question}</h3>
                  <p className="mt-3 text-base leading-8 text-slate-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {article.officialSources?.length ? (
          <section className="mt-12">
            <h2 className="text-[2rem] font-semibold text-[#25306b]">Official sources</h2>
            <ul className="mt-5 space-y-3 text-base leading-8 text-slate-700">
              {article.officialSources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} className="font-semibold text-[#fb4522]" rel="noreferrer" target="_blank">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {article.internalLinks?.length ? (
          <section className="mt-12">
            <h2 className="text-[2rem] font-semibold text-[#25306b]">Related PatentZoom resources</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {article.internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border border-slate-300 px-4 py-2 text-sm font-semibold text-[#25306b] hover:border-[#fb4522] hover:text-[#fb4522]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-12 rounded-[24px] border border-slate-200 bg-[#f8f9fb] p-6">
          <h2 className="text-2xl font-light tracking-[-0.04em] text-[#25306b]">
            Need help choosing the next IP step?
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            PatentZoom can help decide whether search, filing, or broader
            portfolio planning should come first.
          </p>
          <Link
            href={article.ctaHref || "/patent-search#consultation"}
            className="mt-5 inline-flex bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
          >
            {article.ctaLabel || "Request consultation"}
          </Link>
        </div>

        <p className="mt-8 text-sm leading-7 text-slate-500">
          This article is general information, not legal advice. Patent rules,
          USPTO fees, and filing requirements can change, so confirm strategy
          with a qualified patent professional before acting.
        </p>
      </article>
    </main>
  );
}
