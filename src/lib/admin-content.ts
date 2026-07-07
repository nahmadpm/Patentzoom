import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

import {
  referenceServicePages,
  type ReferenceServicePageData,
} from "@/lib/site-data";
import { isDatabaseConfigured, withDatabase } from "@/lib/postgres";
import type { ServiceIntent } from "@/lib/service-intents";

const CONTENT_STORE_PATH = join(process.cwd(), ".codex-temp", "admin-content-store.json");

export type PricingRecord = {
  serviceKey: keyof typeof referenceServicePages;
  packageKey: string;
  packageName: string;
  price: string;
  fee: string;
  ctaLabel: string;
  featured: boolean;
  active: boolean;
  updatedAt: string;
};

export type ArticleStatus = "draft" | "published";

export type ArticleRecord = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  body: string;
  meta: string;
  status: ArticleStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

type ContentStore = {
  pricing: PricingRecord[];
  articles: ArticleRecord[];
};

type PricingRow = {
  service_key: string;
  package_key: string;
  package_name: string;
  price: string;
  fee: string;
  cta_label: string;
  featured: boolean;
  active: boolean;
  updated_at: string | Date;
};

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image_url: string;
  body: string;
  meta: string;
  status: ArticleStatus;
  published_at: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
};

let contentSchemaPromise: Promise<void> | null = null;

export function toPackageKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeDate(value: string | Date) {
  return new Date(value).toISOString();
}

function getDefaultPricingRecords(): PricingRecord[] {
  return Object.entries(referenceServicePages).flatMap(([serviceKey, page]) =>
    page.offers.cards.map((card) => ({
      serviceKey: serviceKey as keyof typeof referenceServicePages,
      packageKey: toPackageKey(card.name),
      packageName: card.name,
      price: card.price,
      fee: card.fee,
      ctaLabel: card.ctaLabel,
      featured: Boolean(card.featured),
      active: true,
      updatedAt: new Date(0).toISOString(),
    })),
  );
}

function getDefaultArticles(): ArticleRecord[] {
  const now = new Date(0).toISOString();
  return [
    {
      id: "seed-patent-search-before-filing",
      title: "When a patent search should come before the first filing",
      slug: "patent-search-before-first-filing",
      category: "Patent Search",
      excerpt:
        "Use search work to decide whether the invention is ready for a provisional, utility, or design filing path.",
      imageUrl: "/service-technical.svg",
      body:
        "A patent search can help founders decide whether to file immediately, adjust the invention story, or invest more carefully in drafting. Use it when novelty is uncertain, competitors are close, or the filing budget needs stronger confidence.",
      meta: "8 min read",
      status: "published",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "seed-provisional-vs-utility",
      title: "How to decide between a provisional and a non-provisional utility filing",
      slug: "provisional-vs-utility-filing",
      category: "Utility Patent",
      excerpt:
        "A founder-focused guide to timing, disclosure risk, and when full claim drafting becomes worth the investment.",
      imageUrl: "/service-software.svg",
      body:
        "A provisional filing can preserve timing while the product evolves. A utility filing is stronger when the invention is mature enough for claims. The right choice depends on disclosure pressure, product maturity, and fundraising needs.",
      meta: "10 min read",
      status: "published",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "seed-design-patent-protection",
      title: "What design patents actually protect for physical products",
      slug: "what-design-patents-protect",
      category: "Design Patent",
      excerpt:
        "Understand when the look, exterior form, and product silhouette deserve a dedicated protection strategy.",
      imageUrl: "/service-design.svg",
      body:
        "Design patents protect the visual appearance of a product, not how it works. They can be valuable when shape, product identity, or exterior form helps customers recognize the product.",
      meta: "7 min read",
      status: "published",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

async function ensureContentFileStore() {
  await mkdir(join(process.cwd(), ".codex-temp"), { recursive: true });

  try {
    await readFile(CONTENT_STORE_PATH, "utf8");
  } catch {
    const emptyStore: ContentStore = {
      pricing: [],
      articles: [],
    };
    await writeFile(CONTENT_STORE_PATH, JSON.stringify(emptyStore, null, 2), "utf8");
  }
}

async function readContentFileStore() {
  await ensureContentFileStore();
  const raw = await readFile(CONTENT_STORE_PATH, "utf8");
  return JSON.parse(raw) as ContentStore;
}

async function writeContentFileStore(store: ContentStore) {
  await ensureContentFileStore();
  await writeFile(CONTENT_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function ensureContentDatabase() {
  if (!isDatabaseConfigured()) {
    return;
  }

  if (!contentSchemaPromise) {
    contentSchemaPromise = withDatabase(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS patentzoom_service_pricing (
          service_key TEXT NOT NULL,
          package_key TEXT NOT NULL,
          package_name TEXT NOT NULL,
          price TEXT NOT NULL,
          fee TEXT NOT NULL,
          cta_label TEXT NOT NULL,
          featured BOOLEAN NOT NULL DEFAULT false,
          active BOOLEAN NOT NULL DEFAULT true,
          updated_at TIMESTAMPTZ NOT NULL,
          PRIMARY KEY (service_key, package_key)
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS patentzoom_articles (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          category TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          image_url TEXT NOT NULL,
          body TEXT NOT NULL,
          meta TEXT NOT NULL,
          status TEXT NOT NULL,
          published_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        )
      `);
    });
  }

  await contentSchemaPromise;
}

function mapPricingRow(row: PricingRow): PricingRecord {
  return {
    serviceKey: row.service_key as keyof typeof referenceServicePages,
    packageKey: row.package_key,
    packageName: row.package_name,
    price: row.price,
    fee: row.fee,
    ctaLabel: row.cta_label,
    featured: row.featured,
    active: row.active,
    updatedAt: normalizeDate(row.updated_at),
  };
}

function mapArticleRow(row: ArticleRow): ArticleRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    imageUrl: row.image_url,
    body: row.body,
    meta: row.meta,
    status: row.status,
    publishedAt: normalizeDate(row.published_at),
    createdAt: normalizeDate(row.created_at),
    updatedAt: normalizeDate(row.updated_at),
  };
}

async function readSavedPricing() {
  if (!isDatabaseConfigured()) {
    const store = await readContentFileStore();
    return store.pricing;
  }

  await ensureContentDatabase();
  return withDatabase(async (client) => {
    const result = await client.query<PricingRow>(
      `SELECT * FROM patentzoom_service_pricing ORDER BY service_key, package_name`,
    );
    return result.rows.map(mapPricingRow);
  });
}

async function readSavedArticles() {
  if (!isDatabaseConfigured()) {
    const store = await readContentFileStore();
    return store.articles;
  }

  await ensureContentDatabase();
  return withDatabase(async (client) => {
    const result = await client.query<ArticleRow>(
      `SELECT * FROM patentzoom_articles ORDER BY published_at DESC, updated_at DESC`,
    );
    return result.rows.map(mapArticleRow);
  });
}

export async function listPricingRecords() {
  const defaults = getDefaultPricingRecords();
  const saved = await readSavedPricing();
  const savedMap = new Map(saved.map((record) => [`${record.serviceKey}:${record.packageKey}`, record]));

  return defaults.map((record) => savedMap.get(`${record.serviceKey}:${record.packageKey}`) ?? record);
}

export async function savePricingRecord(record: Omit<PricingRecord, "updatedAt">) {
  const nextRecord: PricingRecord = {
    ...record,
    updatedAt: new Date().toISOString(),
  };

  if (!isDatabaseConfigured()) {
    const store = await readContentFileStore();
    const index = store.pricing.findIndex(
      (entry) =>
        entry.serviceKey === nextRecord.serviceKey &&
        entry.packageKey === nextRecord.packageKey,
    );

    if (index >= 0) {
      store.pricing[index] = nextRecord;
    } else {
      store.pricing.push(nextRecord);
    }

    await writeContentFileStore(store);
    return nextRecord;
  }

  await ensureContentDatabase();
  await withDatabase(async (client) => {
    await client.query(
      `
        INSERT INTO patentzoom_service_pricing (
          service_key,
          package_key,
          package_name,
          price,
          fee,
          cta_label,
          featured,
          active,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (service_key, package_key) DO UPDATE SET
          package_name = EXCLUDED.package_name,
          price = EXCLUDED.price,
          fee = EXCLUDED.fee,
          cta_label = EXCLUDED.cta_label,
          featured = EXCLUDED.featured,
          active = EXCLUDED.active,
          updated_at = EXCLUDED.updated_at
      `,
      [
        nextRecord.serviceKey,
        nextRecord.packageKey,
        nextRecord.packageName,
        nextRecord.price,
        nextRecord.fee,
        nextRecord.ctaLabel,
        nextRecord.featured,
        nextRecord.active,
        nextRecord.updatedAt,
      ],
    );
  });

  return nextRecord;
}

export async function getEditableServicePage(serviceKey: keyof typeof referenceServicePages) {
  const page = referenceServicePages[serviceKey];
  const pricingRecords = await listPricingRecords();
  const recordsForService = new Map(
    pricingRecords
      .filter((record) => record.serviceKey === serviceKey)
      .map((record) => [record.packageKey, record]),
  );

  return {
    ...page,
    offers: {
      ...page.offers,
      cards: page.offers.cards
        .map((card) => {
          const packageKey = toPackageKey(card.name);
          const override = recordsForService.get(packageKey);

          if (!override || !override.active) {
            return override?.active === false ? null : card;
          }

          return {
            ...card,
            name: override.packageName,
            price: override.price,
            fee: override.fee,
            ctaLabel: override.ctaLabel,
            featured: override.featured,
          };
        })
        .filter((card): card is ReferenceServicePageData["offers"]["cards"][number] => Boolean(card)),
    },
  } satisfies ReferenceServicePageData;
}

export async function getPricingForService(serviceIntent: ServiceIntent) {
  if (!(serviceIntent in referenceServicePages)) {
    return null;
  }

  return getEditableServicePage(serviceIntent as keyof typeof referenceServicePages);
}

export async function listArticles() {
  const saved = await readSavedArticles();
  return saved.length ? saved : getDefaultArticles();
}

export async function listPublishedArticles() {
  const articles = await listArticles();
  return articles
    .filter((article) => article.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getArticleBySlug(slug: string) {
  const normalizedSlug = normalizeSlug(slug);
  const articles = await listArticles();
  return articles.find((article) => article.slug === normalizedSlug) ?? null;
}

export async function getArticleById(id: string) {
  const articles = await listArticles();
  return articles.find((article) => article.id === id) ?? null;
}

export async function saveArticle(input: Omit<ArticleRecord, "id" | "createdAt" | "updatedAt"> & { id?: string }) {
  const now = new Date().toISOString();
  const nextArticle: ArticleRecord = {
    id: input.id || randomUUID(),
    title: input.title,
    slug: normalizeSlug(input.slug || input.title),
    category: input.category,
    excerpt: input.excerpt,
    imageUrl: input.imageUrl,
    body: input.body,
    meta: input.meta,
    status: input.status,
    publishedAt: input.publishedAt || now,
    createdAt: now,
    updatedAt: now,
  };

  const existing = input.id ? await getArticleById(input.id) : null;
  if (existing) {
    nextArticle.createdAt = existing.createdAt;
  }

  if (!isDatabaseConfigured()) {
    const store = await readContentFileStore();
    const index = store.articles.findIndex((article) => article.id === nextArticle.id);

    if (index >= 0) {
      store.articles[index] = nextArticle;
    } else {
      store.articles.push(nextArticle);
    }

    await writeContentFileStore(store);
    return nextArticle;
  }

  await ensureContentDatabase();
  await withDatabase(async (client) => {
    await client.query(
      `
        INSERT INTO patentzoom_articles (
          id,
          title,
          slug,
          category,
          excerpt,
          image_url,
          body,
          meta,
          status,
          published_at,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          category = EXCLUDED.category,
          excerpt = EXCLUDED.excerpt,
          image_url = EXCLUDED.image_url,
          body = EXCLUDED.body,
          meta = EXCLUDED.meta,
          status = EXCLUDED.status,
          published_at = EXCLUDED.published_at,
          updated_at = EXCLUDED.updated_at
      `,
      [
        nextArticle.id,
        nextArticle.title,
        nextArticle.slug,
        nextArticle.category,
        nextArticle.excerpt,
        nextArticle.imageUrl,
        nextArticle.body,
        nextArticle.meta,
        nextArticle.status,
        nextArticle.publishedAt,
        nextArticle.createdAt,
        nextArticle.updatedAt,
      ],
    );
  });

  return nextArticle;
}
