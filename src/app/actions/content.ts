"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  normalizeSlug,
  saveArticle,
  type ArticleStatus,
  savePricingRecord,
  getArticleBySlug,
  getArticleById,
  listPricingRecords,
  type PricingRecord,
} from "@/lib/admin-content";
import { requireAdminSession } from "@/lib/admin";
import { referenceServicePages } from "@/lib/site-data";

export type ContentActionState = {
  errors?: Record<string, string[]>;
  message?: string;
};

const pricingSchema = z.object({
  serviceKey: z.custom<PricingRecord["serviceKey"]>((value) =>
    typeof value === "string" && (value === "patent-search" || Object.hasOwn(referenceServicePages, value)),
    { message: "Choose a valid service." },
  ),
  packageKey: z.string().trim().min(1, { message: "Package key is required." }),
  packageName: z.string().trim().min(1, { message: "Package name is required." }),
  price: z.string().trim().regex(/^\$(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/, {
    message: "Use a Stripe-ready price like $899 or $3,300.",
  }).refine((value) => { const amount = Number(value.replace(/[$,]/g, "")); return amount > 0 && amount < 1_000_000; }, { message: "Price must be greater than $0 and less than $1,000,000." }),
  fee: z.string().trim().min(1, { message: "Fee label is required." }),
  ctaLabel: z.string().trim().min(1, { message: "CTA label is required." }),
  featured: z.string().optional(),
  active: z.string().optional(),
});

const articleSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(3, { message: "Title is required." }),
  slug: z.string().trim().optional(),
  category: z.string().trim().min(2, { message: "Category is required." }),
  excerpt: z.string().trim().min(10, { message: "Excerpt is required." }),
  imageUrl: z.string().trim().refine((value) => /^\/(?!\/)/.test(value) || /^https?:\/\//i.test(value), { message: "Use a local image path or an HTTP(S) image URL." }),
  body: z.string().trim().min(20, { message: "Article body is required." }),
  meta: z.string().trim().min(2, { message: "Read time/meta is required." }),
  status: z.enum(
    [
      "keyword-candidate",
      "researching",
      "research-brief-ready",
      "draft",
      "seo-review",
      "legal-review-required",
      "changes-requested",
      "approved",
      "scheduled",
      "published",
      "failed",
      "skipped",
      "update-required",
    ] as [ArticleStatus, ...ArticleStatus[]],
    {
      message: "Choose a valid article status.",
    },
  ),
  publishedAt: z.string().trim().refine((value) => !value || Number.isFinite(Date.parse(value)), { message: "Enter a valid publication date." }).optional(),
});

export async function savePricingAction(
  _prevState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  await requireAdminSession();

  const validated = pricingSchema.safeParse({
    serviceKey: formData.get("serviceKey"),
    packageKey: formData.get("packageKey"),
    packageName: formData.get("packageName"),
    price: formData.get("price"),
    fee: formData.get("fee"),
    ctaLabel: formData.get("ctaLabel"),
    featured: formData.get("featured") ?? undefined,
    active: formData.get("active") ?? undefined,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const records = await listPricingRecords();
  if (!records.some((record) => record.serviceKey === validated.data.serviceKey && record.packageKey === validated.data.packageKey)) {
    return { message: "This package no longer exists. Reload the pricing editor." };
  }
  await savePricingRecord({
    serviceKey: validated.data.serviceKey,
    packageKey: validated.data.packageKey,
    packageName: validated.data.packageName,
    price: validated.data.price,
    fee: validated.data.fee,
    ctaLabel: validated.data.ctaLabel,
    featured: validated.data.featured === "true",
    active: validated.data.active === "true",
  });

  revalidatePath("/");
  revalidatePath(`/${validated.data.serviceKey}`);
  revalidatePath(`/intake/${validated.data.serviceKey}`);
  revalidatePath("/admin/pricing");
  revalidatePath("/admin");

  return {
    message: "Pricing saved.",
  };
}

export async function saveArticleAction(
  _prevState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  await requireAdminSession();

  const validated = articleSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    excerpt: formData.get("excerpt"),
    imageUrl: formData.get("imageUrl"),
    body: formData.get("body"),
    meta: formData.get("meta"),
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const slug = normalizeSlug(validated.data.slug || validated.data.title);

  if (!slug) {
    return {
      errors: {
        slug: ["Use a valid article slug."],
      },
    };
  }

  const existing = validated.data.id ? await getArticleById(validated.data.id) : null;
  const conflict = await getArticleBySlug(slug);
  if (conflict && conflict.id !== existing?.id) {
    return { errors: { slug: ["An article already uses this URL. Choose another slug."] } };
  }

  const article = await saveArticle({
    id: validated.data.id || undefined,
    title: validated.data.title,
    slug,
    category: validated.data.category,
    excerpt: validated.data.excerpt,
    imageUrl: validated.data.imageUrl,
    body: validated.data.body,
    meta: validated.data.meta,
    status: validated.data.status,
    publishedAt: validated.data.publishedAt
      ? new Date(validated.data.publishedAt).toISOString()
      : new Date().toISOString(),
  });

  revalidatePath("/knowledge-center");
  revalidatePath(`/knowledge-center/${article.slug}`);
  if (existing && existing.slug !== article.slug) revalidatePath(`/knowledge-center/${existing.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/posts");
  revalidatePath("/admin");

  redirect("/admin/posts");
}
