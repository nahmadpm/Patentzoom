import Link from "next/link";

import { AdminArticleForm } from "@/components/admin-article-form";
import { requireAdminSession } from "@/lib/admin";

export default async function NewAdminPostPage() {
  await requireAdminSession();

  return (
    <main className="min-h-screen bg-[#f4f0eb] px-4 py-5 text-[#241c17]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-[#fb4522]">
              Admin / Posts
            </p>
            <h1 className="mt-2 text-2xl font-bold">New post</h1>
          </div>
          <Link href="/admin/posts" className="text-sm font-bold text-[#fb4522]">
            Back to posts
          </Link>
        </div>
        <AdminArticleForm />
      </div>
    </main>
  );
}
