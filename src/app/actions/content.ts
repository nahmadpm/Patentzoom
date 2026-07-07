"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  normalizeSlug,
  saveArticle,
  savePricingRecord,
} from "@/lib/admin-content";
import { requireAdminSession } from "@/lib/admin";
import { referenceServicePages } from "@/lib/site-data";

export type ContentActionState = {
  errors?: Record<string, string[]>;
  message?: string;
};

const pricingSchema = z.object({
  serviceKey: z.enum(
    Object.keys(referenceServicePages) as [
      keyof typeof referenceServicePages,
      ...Array<keyof typeof referenceServicePages>,
    ],
  ),
  packageKey: z.string().trim().min(1, { message: "Package key is required." }),
  packageName: z.string().trim().min(1, { message: "Package name is required." }),
  price: z.string().trim().regex(/^\$[\d,]+(?:\.\d{1,2})?$/, {
    message: "Use a Stripe-ready price like $899 or $3,300.",
  }),
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
  imageUrl: z.string().trim().min(1, { message: "Image URL is required." }),
  body: z.string().trim().min(20, { message: "Article body is required." }),
  meta: z.string().trim().min(2, { message: "Read time/meta is required." }),
  status: z.enum(["draft", "published"], {
    message: "Choose draft or published.",
  }),
  publishedAt: z.string().trim().optional(),
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
    featured: formData.get("featured"),
    active: formData.get("active"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
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
  revalidatePath("/admin/posts");
  revalidatePath("/admin");

  redirect("/admin/posts");
}
