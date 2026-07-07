import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getArticleBySlug } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

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

  return (
    <main className="bg-white text-slate-900">
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
        <div className="space-y-6 text-base leading-8 text-slate-700">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 rounded-[24px] border border-slate-200 bg-[#f8f9fb] p-6">
          <h2 className="text-2xl font-light tracking-[-0.04em] text-[#25306b]">
            Need help choosing the next IP step?
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            PatentZoom can help decide whether search, filing, or broader
            portfolio planning should come first.
          </p>
          <Link
            href="/patent-search#consultation"
            className="mt-5 inline-flex bg-[#fb4522] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white"
          >
            Request consultation
          </Link>
        </div>
      </article>
    </main>
  );
}
