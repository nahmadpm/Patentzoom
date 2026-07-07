"use client";

import { useActionState } from "react";

import { saveArticleAction, type ContentActionState } from "@/app/actions/content";
import type { ArticleRecord } from "@/lib/admin-content";

const initialState: ContentActionState = {};

function FieldError({
  errors,
  name,
}: {
  errors?: Record<string, string[]>;
  name: string;
}) {
  const message = errors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-1 text-[12px] text-red-600">{message}</p>;
}

export function AdminArticleForm({ article }: { article?: ArticleRecord | null }) {
  const [state, action, pending] = useActionState(saveArticleAction, initialState);
  const publishedAt = article?.publishedAt
    ? article.publishedAt.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-5 rounded-[18px] border border-[#e7d9cb] bg-[#fffdf9] p-5">
      {article?.id ? <input type="hidden" name="id" value={article.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-bold uppercase text-[#6f6258]">
            Title
          </span>
          <input
            name="title"
            defaultValue={article?.title ?? ""}
            className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[14px] outline-none focus:border-[#fb4522]"
          />
          <FieldError errors={state.errors} name="title" />
        </label>

        <label className="block">
          <span className="text-[11px] font-bold uppercase text-[#6f6258]">
            Slug
          </span>
          <input
            name="slug"
            defaultValue={article?.slug ?? ""}
            placeholder="auto-generated if blank"
            className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[14px] outline-none focus:border-[#fb4522]"
          />
          <FieldError errors={state.errors} name="slug" />
        </label>

        <label className="block">
          <span className="text-[11px] font-bold uppercase text-[#6f6258]">
            Category
          </span>
          <input
            name="category"
            defaultValue={article?.category ?? "Patent Strategy"}
            className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[14px] outline-none focus:border-[#fb4522]"
          />
          <FieldError errors={state.errors} name="category" />
        </label>

        <label className="block">
          <span className="text-[11px] font-bold uppercase text-[#6f6258]">
            Meta/read time
          </span>
          <input
            name="meta"
            defaultValue={article?.meta ?? "5 min read"}
            className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[14px] outline-none focus:border-[#fb4522]"
          />
          <FieldError errors={state.errors} name="meta" />
        </label>

        <label className="block">
          <span className="text-[11px] font-bold uppercase text-[#6f6258]">
            Image URL
          </span>
          <input
            name="imageUrl"
            defaultValue={article?.imageUrl ?? "/service-strategy.svg"}
            className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[14px] outline-none focus:border-[#fb4522]"
          />
          <FieldError errors={state.errors} name="imageUrl" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-bold uppercase text-[#6f6258]">
              Status
            </span>
            <select
              name="status"
              defaultValue={article?.status ?? "published"}
              className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[14px] outline-none focus:border-[#fb4522]"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <FieldError errors={state.errors} name="status" />
          </label>

          <label className="block">
            <span className="text-[11px] font-bold uppercase text-[#6f6258]">
              Publish date
            </span>
            <input
              name="publishedAt"
              type="date"
              defaultValue={publishedAt}
              className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[14px] outline-none focus:border-[#fb4522]"
            />
          </label>
        </div>
      </div>

      <label className="block">
        <span className="text-[11px] font-bold uppercase text-[#6f6258]">
          Excerpt
        </span>
        <textarea
          name="excerpt"
          defaultValue={article?.excerpt ?? ""}
          rows={3}
          className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[14px] outline-none focus:border-[#fb4522]"
        />
        <FieldError errors={state.errors} name="excerpt" />
      </label>

      <label className="block">
        <span className="text-[11px] font-bold uppercase text-[#6f6258]">
          Body
        </span>
        <textarea
          name="body"
          defaultValue={article?.body ?? ""}
          rows={14}
          className="mt-1 w-full rounded-[10px] border border-[#e7d9cb] px-3 py-2 text-[14px] leading-7 outline-none focus:border-[#fb4522]"
        />
        <FieldError errors={state.errors} name="body" />
      </label>

      {state.message ? (
        <p className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-[12px] bg-[#fb4522] px-5 py-3 text-[13px] font-bold uppercase text-white disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save article"}
      </button>
    </form>
  );
}
