import Link from "next/link";

import { requireAdminSession } from "@/lib/admin";
import { listArticles } from "@/lib/admin-content";

export default async function AdminPostsPage() {
  await requireAdminSession();
  const articles = await listArticles();

  return (
    <main className="min-h-screen bg-[#f4f0eb] px-4 py-5 text-[#241c17]">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase text-[#fb4522]">
                Admin / Posts
              </p>
              <h1 className="mt-2 text-2xl font-bold">Knowledge Center posts</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#6f6258]">
                Create and edit articles. Published posts appear on the public
                Knowledge Center immediately.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/posts/new"
                className="rounded-[10px] bg-[#fb4522] px-4 py-2 text-[12px] font-bold text-white"
              >
                New post
              </Link>
              <Link
                href="/admin"
                className="rounded-[10px] border border-[#e7d9cb] bg-white px-4 py-2 text-[12px] font-bold hover:border-[#fb4522]/40 hover:text-[#fb4522]"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#e7d9cb] text-[11px] uppercase text-[#6f6258]">
                <tr>
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Slug</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7d9cb]">
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td className="py-4 pr-4">
                      <p className="font-bold">{article.title}</p>
                      <p className="mt-1 text-xs text-[#6f6258]">{article.meta}</p>
                    </td>
                    <td className="py-4 pr-4 text-[#6f6258]">{article.category}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                          article.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-[#6f6258]">{article.slug}</td>
                    <td className="py-4">
                      <Link
                        href={`/admin/posts/${article.id}`}
                        className="rounded-[10px] border border-[#e7d9cb] bg-white px-3 py-2 text-[12px] font-bold hover:border-[#fb4522]/40 hover:text-[#fb4522]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
