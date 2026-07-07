import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminArticleForm } from "@/components/admin-article-form";
import { requireAdminSession } from "@/lib/admin";
import { getArticleById } from "@/lib/admin-content";

export default async function EditAdminPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f4f0eb] px-4 py-5 text-[#241c17]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-[#fb4522]">
              Admin / Posts
            </p>
            <h1 className="mt-2 text-2xl font-bold">Edit post</h1>
          </div>
          <Link href="/admin/posts" className="text-sm font-bold text-[#fb4522]">
            Back to posts
          </Link>
        </div>
        <AdminArticleForm article={article} />
      </div>
    </main>
  );
}
