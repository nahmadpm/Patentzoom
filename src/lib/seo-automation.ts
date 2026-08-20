import { createSign, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { revalidatePath } from "next/cache";

import {
  listArticles,
  normalizeSlug,
  saveArticle,
  type ArticleRecord,
} from "@/lib/admin-content";
import { isDatabaseConfigured, withDatabase } from "@/lib/postgres";
import { referenceServicePages } from "@/lib/site-data";

const SEO_STORE_PATH = join(process.cwd(), ".codex-temp", "seo-automation-store.json");
const EASTERN_TIME_ZONE = "America/New_York";
const PUBLISH_HOUR_EASTERN = 9;

export const seoCategories = [
  "Patent Search",
  "Provisional Patent",
  "Utility Patent",
  "Design Patent",
  "Patent Filing & Strategy",
  "Patent Basics",
] as const;

export type SeoCategory = (typeof seoCategories)[number];

export type SeoJobStatus =
  | "keyword-candidate"
  | "researching"
  | "research-brief-ready"
  | "draft"
  | "seo-review"
  | "legal-review-required"
  | "changes-requested"
  | "approved"
  | "scheduled"
  | "published"
  | "failed"
  | "skipped"
  | "update-required";

type IntegrationName = "OpenAI" | "SerpAPI" | "Google Search Console" | "Google Ads Keyword Planner" | "Google Analytics";
type IntegrationStatus = "connected" | "not-connected" | "failed";

export type SeoIntegrationState = {
  name: IntegrationName;
  status: IntegrationStatus;
  message: string;
};

export type KeywordCandidate = {
  keyword: string;
  source: "search-console" | "seed" | "openai";
  score: number;
  scoreBreakdown: Record<string, number>;
  reason: string;
  searchConsole?: SearchConsoleOpportunity;
  serp?: SerpAnalysis;
};

type SearchConsoleOpportunity = {
  query: string;
  landingPage: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  country?: string;
  device?: string;
};

type SerpAnalysis = {
  organicResults: { title: string; link: string; snippet: string }[];
  ads: { title: string; link: string; snippet: string }[];
  peopleAlsoAsk: string[];
  relatedSearches: string[];
  intent: "Informational" | "Commercial investigation" | "Transactional" | "Comparison" | "Problem-aware" | "Navigational";
  servicePageExpected: boolean;
  contentGaps: string[];
};

export type ResearchBrief = {
  category: SeoCategory;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  targetReader: string;
  readerProblem: string;
  desiredAction: string;
  searchConsoleData: SearchConsoleOpportunity[];
  keywordPlannerData: { status: "not-connected"; message: string };
  serpFindings: SerpAnalysis | null;
  competitorUrls: string[];
  peopleAlsoAsk: string[];
  contentGaps: string[];
  officialSources: { label: string; url: string }[];
  internalLinks: { label: string; href: string }[];
  relevantServicePage: string;
  recommendedCta: string;
  opportunityScore: number;
  reasonForSelection: string;
  legalReviewRequirement: string;
};

export type SeoAutomationSettings = {
  enabled: boolean;
  autoPublish: boolean;
  publishHourEastern: number;
  minimumScore: number;
  publishBestAnyway: boolean;
  updatedAt: string;
};

export type SeoAutomationJob = {
  id: string;
  runDate: string;
  category: SeoCategory;
  status: SeoJobStatus;
  selectedKeyword?: string;
  opportunityScore?: number;
  articleId?: string;
  articleSlug?: string;
  publishedUrl?: string;
  brief?: ResearchBrief;
  candidates: KeywordCandidate[];
  integrations: SeoIntegrationState[];
  warnings: string[];
  errors: string[];
  startedAt: string;
  completedAt?: string;
};

type SeoAutomationStore = {
  settings: SeoAutomationSettings;
  jobs: SeoAutomationJob[];
};

type SeoJobRow = {
  id: string;
  run_date: string;
  category: SeoCategory;
  status: SeoJobStatus;
  selected_keyword: string | null;
  opportunity_score: number | null;
  article_id: string | null;
  article_slug: string | null;
  published_url: string | null;
  brief: unknown;
  candidates: unknown;
  integrations: unknown;
  warnings: unknown;
  errors: unknown;
  started_at: string | Date;
  completed_at: string | Date | null;
};

type SeoSettingsRow = {
  id: string;
  enabled: boolean;
  auto_publish: boolean;
  publish_hour_eastern: number;
  minimum_score: number;
  publish_best_anyway: boolean;
  updated_at: string | Date;
};

type GeneratedArticle = {
  title: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  shortAnswer: string;
  keyTakeaways: string[];
  tableOfContents: string[];
  body: string;
  faqs: { question: string; answer: string }[];
  secondaryKeywords: string[];
};

let seoSchemaPromise: Promise<void> | null = null;

const categoryByWeekday: Record<number, SeoCategory | null> = {
  0: null,
  1: "Patent Search",
  2: "Provisional Patent",
  3: "Utility Patent",
  4: "Design Patent",
  5: "Patent Filing & Strategy",
  6: "Patent Basics",
};

const categorySeeds: Record<SeoCategory, string[]> = {
  "Patent Search": [
    "professional patent search cost",
    "patent search before filing",
    "how much does a patent search cost",
  ],
  "Provisional Patent": [
    "how much does a provisional patent cost",
    "provisional patent application requirements",
    "provisional patent before pitching investors",
  ],
  "Utility Patent": [
    "utility patent application process",
    "utility patent filing cost",
    "non provisional utility patent requirements",
  ],
  "Design Patent": [
    "design patent attorney cost",
    "design patent application requirements",
    "what does a design patent protect",
  ],
  "Patent Filing & Strategy": [
    "patent filing strategy for startups",
    "when should a startup file a patent",
    "patent strategy before product launch",
  ],
  "Patent Basics": [
    "can my invention be patented",
    "patent basics for startups",
    "how to protect my invention online",
  ],
};

const categoryCtas: Record<SeoCategory, { label: string; href: string }> = {
  "Patent Search": { label: "Request a Professional Patent Search", href: "/patent-search#consultation" },
  "Provisional Patent": { label: "Start Your Provisional Patent Application", href: "/provisional-patent#consultation" },
  "Utility Patent": { label: "Discuss Your Utility Patent Application", href: "/utility-patent#consultation" },
  "Design Patent": { label: "Get Help With a Design Patent", href: "/design-patent#consultation" },
  "Patent Filing & Strategy": { label: "Schedule a Patent Strategy Consultation", href: "/ip-portfolio-strategy" },
  "Patent Basics": { label: "Ask an IP Question", href: "/patent-search#consultation" },
};

const officialSourcesByCategory: Record<SeoCategory, { label: string; url: string }[]> = {
  "Patent Search": [
    { label: "USPTO patent search resources", url: "https://www.uspto.gov/patents/search" },
    { label: "WIPO PATENTSCOPE", url: "https://patentscope.wipo.int/" },
  ],
  "Provisional Patent": [
    { label: "USPTO provisional application overview", url: "https://www.uspto.gov/patents/basics/apply/provisional-application" },
    { label: "USPTO fee schedule", url: "https://www.uspto.gov/learning-and-resources/fees-and-payment/uspto-fee-schedule" },
  ],
  "Utility Patent": [
    { label: "USPTO utility patent application guide", url: "https://www.uspto.gov/patents/basics/types-patent-applications/utility-patent" },
    { label: "USPTO patent process overview", url: "https://www.uspto.gov/patents/basics/patent-process-overview" },
  ],
  "Design Patent": [
    { label: "USPTO design patent application guide", url: "https://www.uspto.gov/patents/basics/types-patent-applications/design-patent" },
    { label: "USPTO design patent application filing guide", url: "https://www.uspto.gov/patents/basics/apply/design-patent-application-guide" },
  ],
  "Patent Filing & Strategy": [
    { label: "USPTO patent process overview", url: "https://www.uspto.gov/patents/basics/patent-process-overview" },
    { label: "USPTO patent basics", url: "https://www.uspto.gov/patents/basics" },
  ],
  "Patent Basics": [
    { label: "USPTO patent basics", url: "https://www.uspto.gov/patents/basics" },
    { label: "WIPO patents overview", url: "https://www.wipo.int/patents/en/" },
  ],
};

function defaultSettings(): SeoAutomationSettings {
  return {
    enabled: true,
    autoPublish: true,
    publishHourEastern: PUBLISH_HOUR_EASTERN,
    minimumScore: 70,
    publishBestAnyway: true,
    updatedAt: new Date(0).toISOString(),
  };
}

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://patentzoom.us").replace(/\/$/, "");
}

function normalizeDate(value: string | Date) {
  return new Date(value).toISOString();
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function mapSettingsRow(row: SeoSettingsRow): SeoAutomationSettings {
  return {
    enabled: row.enabled,
    autoPublish: row.auto_publish,
    publishHourEastern: row.publish_hour_eastern,
    minimumScore: row.minimum_score,
    publishBestAnyway: row.publish_best_anyway,
    updatedAt: normalizeDate(row.updated_at),
  };
}

function mapJobRow(row: SeoJobRow): SeoAutomationJob {
  return {
    id: row.id,
    runDate: row.run_date,
    category: row.category,
    status: row.status,
    selectedKeyword: row.selected_keyword ?? undefined,
    opportunityScore: row.opportunity_score ?? undefined,
    articleId: row.article_id ?? undefined,
    articleSlug: row.article_slug ?? undefined,
    publishedUrl: row.published_url ?? undefined,
    brief: row.brief && typeof row.brief === "object" ? (row.brief as ResearchBrief) : undefined,
    candidates: asArray<KeywordCandidate>(row.candidates),
    integrations: asArray<SeoIntegrationState>(row.integrations),
    warnings: asArray<string>(row.warnings),
    errors: asArray<string>(row.errors),
    startedAt: normalizeDate(row.started_at),
    completedAt: row.completed_at ? normalizeDate(row.completed_at) : undefined,
  };
}

async function ensureSeoFileStore() {
  await mkdir(join(process.cwd(), ".codex-temp"), { recursive: true });

  try {
    await readFile(SEO_STORE_PATH, "utf8");
  } catch {
    await writeFile(
      SEO_STORE_PATH,
      JSON.stringify({ settings: defaultSettings(), jobs: [] } satisfies SeoAutomationStore, null, 2),
      "utf8",
    );
  }
}

async function readSeoFileStore() {
  await ensureSeoFileStore();
  return JSON.parse(await readFile(SEO_STORE_PATH, "utf8")) as SeoAutomationStore;
}

async function writeSeoFileStore(store: SeoAutomationStore) {
  await ensureSeoFileStore();
  await writeFile(SEO_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function ensureSeoDatabase() {
  if (!isDatabaseConfigured()) {
    return;
  }

  if (!seoSchemaPromise) {
    seoSchemaPromise = withDatabase(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS patentzoom_seo_automation_settings (
          id TEXT PRIMARY KEY,
          enabled BOOLEAN NOT NULL,
          auto_publish BOOLEAN NOT NULL,
          publish_hour_eastern INTEGER NOT NULL,
          minimum_score INTEGER NOT NULL,
          publish_best_anyway BOOLEAN NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS patentzoom_seo_automation_jobs (
          id TEXT PRIMARY KEY,
          run_date TEXT NOT NULL,
          category TEXT NOT NULL,
          status TEXT NOT NULL,
          selected_keyword TEXT,
          opportunity_score INTEGER,
          article_id TEXT,
          article_slug TEXT,
          published_url TEXT,
          brief JSONB,
          candidates JSONB NOT NULL DEFAULT '[]'::jsonb,
          integrations JSONB NOT NULL DEFAULT '[]'::jsonb,
          warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
          errors JSONB NOT NULL DEFAULT '[]'::jsonb,
          started_at TIMESTAMPTZ NOT NULL,
          completed_at TIMESTAMPTZ
        )
      `);

      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS patentzoom_seo_automation_jobs_run_date_idx
          ON patentzoom_seo_automation_jobs (run_date)
      `);

      await client.query(
        `
          INSERT INTO patentzoom_seo_automation_settings (
            id,
            enabled,
            auto_publish,
            publish_hour_eastern,
            minimum_score,
            publish_best_anyway,
            updated_at
          )
          VALUES ('default', true, true, $1, 70, true, NOW())
          ON CONFLICT (id) DO NOTHING
        `,
        [PUBLISH_HOUR_EASTERN],
      );
    });
  }

  await seoSchemaPromise;
}

export function getEasternParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIME_ZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: weekdayMap[parts.weekday] ?? 0,
    hour: Number(parts.hour),
  };
}

export function getCategoryForEasternDate(date = new Date()) {
  return categoryByWeekday[getEasternParts(date).weekday];
}

export function getNextSeoRunLabel(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIME_ZONE,
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  for (let offset = 0; offset < 8; offset += 1) {
    const candidate = new Date(date);
    candidate.setUTCDate(candidate.getUTCDate() + offset);
    const category = getCategoryForEasternDate(candidate);
    if (category) {
      return `${formatter.format(candidate)} - ${category}`;
    }
  }

  return "Next Monday at 9:00 AM Eastern";
}

export async function getSeoAutomationSettings() {
  if (!isDatabaseConfigured()) {
    return (await readSeoFileStore()).settings;
  }

  await ensureSeoDatabase();
  return withDatabase(async (client) => {
    const result = await client.query<SeoSettingsRow>(
      `SELECT * FROM patentzoom_seo_automation_settings WHERE id = 'default' LIMIT 1`,
    );
    return result.rows[0] ? mapSettingsRow(result.rows[0]) : defaultSettings();
  });
}

async function upsertSeoJob(job: SeoAutomationJob) {
  if (!isDatabaseConfigured()) {
    const store = await readSeoFileStore();
    const index = store.jobs.findIndex((entry) => entry.id === job.id);
    if (index >= 0) {
      store.jobs[index] = job;
    } else {
      store.jobs.push(job);
    }
    await writeSeoFileStore(store);
    return job;
  }

  await ensureSeoDatabase();
  await withDatabase(async (client) => {
    await client.query(
      `
        INSERT INTO patentzoom_seo_automation_jobs (
          id,
          run_date,
          category,
          status,
          selected_keyword,
          opportunity_score,
          article_id,
          article_slug,
          published_url,
          brief,
          candidates,
          integrations,
          warnings,
          errors,
          started_at,
          completed_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          selected_keyword = EXCLUDED.selected_keyword,
          opportunity_score = EXCLUDED.opportunity_score,
          article_id = EXCLUDED.article_id,
          article_slug = EXCLUDED.article_slug,
          published_url = EXCLUDED.published_url,
          brief = EXCLUDED.brief,
          candidates = EXCLUDED.candidates,
          integrations = EXCLUDED.integrations,
          warnings = EXCLUDED.warnings,
          errors = EXCLUDED.errors,
          completed_at = EXCLUDED.completed_at
      `,
      [
        job.id,
        job.runDate,
        job.category,
        job.status,
        job.selectedKeyword ?? null,
        job.opportunityScore ?? null,
        job.articleId ?? null,
        job.articleSlug ?? null,
        job.publishedUrl ?? null,
        JSON.stringify(job.brief ?? null),
        JSON.stringify(job.candidates),
        JSON.stringify(job.integrations),
        JSON.stringify(job.warnings),
        JSON.stringify(job.errors),
        job.startedAt,
        job.completedAt ?? null,
      ],
    );
  });

  return job;
}

async function createSeoJob(runDate: string, category: SeoCategory) {
  const now = new Date().toISOString();
  const job: SeoAutomationJob = {
    id: randomUUID(),
    runDate,
    category,
    status: "keyword-candidate",
    candidates: [],
    integrations: getIntegrationStates(),
    warnings: [],
    errors: [],
    startedAt: now,
  };

  if (!isDatabaseConfigured()) {
    const store = await readSeoFileStore();
    const existing = store.jobs.find((entry) => entry.runDate === runDate);
    if (existing) {
      return { job: existing, created: false };
    }

    store.jobs.push(job);
    await writeSeoFileStore(store);
    return { job, created: true };
  }

  await ensureSeoDatabase();
  return withDatabase(async (client) => {
    const result = await client.query<SeoJobRow>(
      `
        INSERT INTO patentzoom_seo_automation_jobs (
          id,
          run_date,
          category,
          status,
          candidates,
          integrations,
          warnings,
          errors,
          started_at
        )
        VALUES ($1, $2, $3, $4, '[]'::jsonb, $5, '[]'::jsonb, '[]'::jsonb, $6)
        ON CONFLICT (run_date) DO NOTHING
        RETURNING *
      `,
      [job.id, job.runDate, job.category, job.status, JSON.stringify(job.integrations), job.startedAt],
    );

    if (result.rows[0]) {
      return { job: mapJobRow(result.rows[0]), created: true };
    }

    const existing = await client.query<SeoJobRow>(
      `SELECT * FROM patentzoom_seo_automation_jobs WHERE run_date = $1 LIMIT 1`,
      [runDate],
    );

    return { job: mapJobRow(existing.rows[0]), created: false };
  });
}

export async function listSeoAutomationJobs(limit = 20) {
  if (!isDatabaseConfigured()) {
    const store = await readSeoFileStore();
    return [...store.jobs]
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  }

  await ensureSeoDatabase();
  return withDatabase(async (client) => {
    const result = await client.query<SeoJobRow>(
      `SELECT * FROM patentzoom_seo_automation_jobs ORDER BY started_at DESC LIMIT $1`,
      [limit],
    );
    return result.rows.map(mapJobRow);
  });
}

export function getIntegrationStates(): SeoIntegrationState[] {
  return [
    {
      name: "OpenAI",
      status: process.env.OPENAI_API_KEY ? "connected" : "not-connected",
      message: process.env.OPENAI_API_KEY ? "Ready for article generation." : "OPENAI_API_KEY is missing.",
    },
    {
      name: "SerpAPI",
      status: process.env.SERPAPI_API_KEY ? "connected" : "not-connected",
      message: process.env.SERPAPI_API_KEY ? "Ready for Google SERP analysis." : "SERPAPI_API_KEY is missing.",
    },
    {
      name: "Google Search Console",
      status:
        process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL &&
        process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY
          ? "connected"
          : "not-connected",
      message:
        process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL &&
        process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY
          ? "Ready for query opportunity checks."
          : "Search Console service account credentials are missing.",
    },
    {
      name: "Google Ads Keyword Planner",
      status: "not-connected",
      message: "Google Ads API credentials are not configured for v1.",
    },
    {
      name: "Google Analytics",
      status:
        process.env.GA4_PROPERTY_ID &&
        process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL &&
        process.env.GOOGLE_ANALYTICS_PRIVATE_KEY
          ? "connected"
          : "not-connected",
      message:
        process.env.GA4_PROPERTY_ID &&
        process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL &&
        process.env.GOOGLE_ANALYTICS_PRIVATE_KEY
          ? "Ready for performance snapshots."
          : "GA4 reporting credentials are missing.",
    },
  ];
}

export async function getSeoAutomationOverview() {
  const [settings, jobs] = await Promise.all([
    getSeoAutomationSettings(),
    listSeoAutomationJobs(8),
  ]);
  const todayCategory = getCategoryForEasternDate();

  return {
    settings,
    jobs,
    latestJob: jobs[0] ?? null,
    todayCategory,
    integrations: getIntegrationStates(),
    nextRunLabel: getNextSeoRunLabel(),
  };
}

function scoreKeyword(keyword: string, category: SeoCategory, searchConsole?: SearchConsoleOpportunity) {
  const buyingTerms = [
    "cost",
    "price",
    "fees",
    "how much",
    "service",
    "attorney",
    "patent agent",
    "professional",
    "filing",
    "application",
    "requirements",
    "deadline",
    "timeline",
    "eligibility",
    "consultation",
    "help",
    "online",
    "startup",
    "software",
    "ai invention",
    "protect my invention",
  ];
  const categoryTerms = category.toLowerCase().split(/\s|&/).filter(Boolean);
  const lowerKeyword = keyword.toLowerCase();
  const buyingIntent = Math.min(20, buyingTerms.filter((term) => lowerKeyword.includes(term)).length * 4 + 8);
  const serviceRelevance = Math.min(20, categoryTerms.filter((term) => lowerKeyword.includes(term)).length * 7 + 8);
  const searchConsoleOpportunity = searchConsole
    ? Math.min(15, Math.round(searchConsole.impressions / 20) + (searchConsole.position >= 8 && searchConsole.position <= 30 ? 6 : 0))
    : 6;
  const leadPotential = Math.min(15, buyingIntent >= 12 ? 13 : 8);
  const demand = searchConsole ? Math.min(10, Math.round(searchConsole.impressions / 50)) : 6;
  const cpc = buyingIntent >= 12 ? 4 : 2;
  const feasibility = 8;
  const trend = 4;
  const scoreBreakdown = {
    serviceRelevance,
    buyingIntent,
    searchConsoleOpportunity,
    leadPotential,
    demand,
    cpc,
    feasibility,
    trend,
  };

  return {
    score: Object.values(scoreBreakdown).reduce((sum, value) => sum + value, 0),
    scoreBreakdown,
  };
}

function inferServicePage(category: SeoCategory) {
  const mapping: Record<SeoCategory, string> = {
    "Patent Search": "/patent-search",
    "Provisional Patent": "/provisional-patent",
    "Utility Patent": "/utility-patent",
    "Design Patent": "/design-patent",
    "Patent Filing & Strategy": "/ip-portfolio-strategy",
    "Patent Basics": "/patent-search#consultation",
  };
  return mapping[category];
}

function getInternalLinks(category: SeoCategory) {
  const servicePage = inferServicePage(category);
  const links = [
    { label: category, href: servicePage },
    { label: "PatentZoom Knowledge Center", href: "/knowledge-center" },
  ];

  if (category !== "Patent Search") {
    links.push({ label: "Patent Search", href: "/patent-search" });
  }

  return links;
}

async function getSearchConsoleAccessToken() {
  const email = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL?.trim();
  const key = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!email || !key) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key, "base64url");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as { access_token?: string };
  return json.access_token ?? null;
}

function base64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

async function fetchSearchConsoleOpportunities(category: SeoCategory, warnings: string[]) {
  const token = await getSearchConsoleAccessToken();
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim() || getAppUrl();
  if (!token) {
    warnings.push("Google Search Console is Not Connected; continuing with seed keywords.");
    return [];
  }

  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - 2);
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 28);

  const response = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        dimensions: ["query", "page", "country", "device"],
        rowLimit: 50,
      }),
    },
  );

  if (!response.ok) {
    warnings.push("Google Search Console request failed; continuing with seed keywords.");
    return [];
  }

  const json = (await response.json()) as {
    rows?: {
      keys?: string[];
      clicks?: number;
      impressions?: number;
      ctr?: number;
      position?: number;
    }[];
  };
  const categoryWords = category.toLowerCase().split(/\s|&/).filter((word) => word.length > 2);

  return (json.rows ?? [])
    .map<SearchConsoleOpportunity>((row) => ({
      query: row.keys?.[0] ?? "",
      landingPage: row.keys?.[1] ?? "",
      country: row.keys?.[2],
      device: row.keys?.[3],
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }))
    .filter((row) => categoryWords.some((word) => row.query.toLowerCase().includes(word)))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 8);
}

async function fetchSerpAnalysis(keyword: string, warnings: string[]) {
  const apiKey = process.env.SERPAPI_API_KEY?.trim();
  if (!apiKey) {
    warnings.push("SerpAPI is Not Connected; publishing with no live SERP data.");
    return null;
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("google_domain", "google.com");
  url.searchParams.set("gl", "us");
  url.searchParams.set("hl", "en");
  url.searchParams.set("num", "10");
  url.searchParams.set("q", keyword);
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    warnings.push("SerpAPI request failed; publishing with no live SERP data.");
    return null;
  }

  const json = (await response.json()) as {
    organic_results?: { title?: string; link?: string; snippet?: string }[];
    ads?: { title?: string; link?: string; snippet?: string }[];
    related_questions?: { question?: string }[];
    related_searches?: { query?: string }[];
  };
  const organicResults = (json.organic_results ?? []).slice(0, 10).map((item) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    snippet: item.snippet ?? "",
  }));
  const ads = (json.ads ?? []).slice(0, 4).map((item) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    snippet: item.snippet ?? "",
  }));
  const peopleAlsoAsk = (json.related_questions ?? [])
    .map((item) => item.question)
    .filter((item): item is string => Boolean(item))
    .slice(0, 6);
  const relatedSearches = (json.related_searches ?? [])
    .map((item) => item.query)
    .filter((item): item is string => Boolean(item))
    .slice(0, 8);
  const servicePageExpected = organicResults
    .slice(0, 5)
    .some((result) => /service|attorney|law firm|pricing|apply|file/i.test(`${result.title} ${result.snippet}`));

  return {
    organicResults,
    ads,
    peopleAlsoAsk,
    relatedSearches,
    intent: servicePageExpected ? "Commercial investigation" : "Informational",
    servicePageExpected,
    contentGaps: peopleAlsoAsk.length
      ? peopleAlsoAsk.map((question) => `Answer clearly: ${question}`)
      : ["Include pricing context, process steps, common mistakes, and official-source citations."],
  } satisfies SerpAnalysis;
}

function getDuplicateWarnings(keyword: string, articles: ArticleRecord[]) {
  const warnings: string[] = [];
  const normalizedKeyword = normalizeSlug(keyword);
  const existingTarget = articles.find(
    (article) =>
      normalizeSlug(article.primaryKeyword ?? "") === normalizedKeyword ||
      normalizeSlug(article.title).includes(normalizedKeyword) ||
      normalizedKeyword.includes(normalizeSlug(article.title)),
  );

  if (existingTarget) {
    warnings.push(`Potential duplicate intent with existing article: ${existingTarget.title}`);
  }

  for (const [serviceKey, page] of Object.entries(referenceServicePages)) {
    const serviceText = `${serviceKey} ${page.hero.title} ${page.hero.summary}`.toLowerCase();
    if (keyword.toLowerCase().split(/\s+/).filter((word) => word.length > 4 && serviceText.includes(word)).length >= 3) {
      warnings.push(`Potential overlap with service page: /${serviceKey}`);
      break;
    }
  }

  return warnings;
}

function buildCandidates(category: SeoCategory, opportunities: SearchConsoleOpportunity[]) {
  const candidates: KeywordCandidate[] = [];
  for (const opportunity of opportunities) {
    const { score, scoreBreakdown } = scoreKeyword(opportunity.query, category, opportunity);
    candidates.push({
      keyword: opportunity.query,
      source: "search-console",
      score,
      scoreBreakdown,
      reason: "Search Console query with category relevance.",
      searchConsole: opportunity,
    });
  }

  for (const keyword of categorySeeds[category]) {
    const { score, scoreBreakdown } = scoreKeyword(keyword, category);
    candidates.push({
      keyword,
      source: "seed",
      score,
      scoreBreakdown,
      reason: "PatentZoom seed keyword for daily category.",
    });
  }

  return candidates.sort((a, b) => b.score - a.score);
}

function buildBrief(category: SeoCategory, candidate: KeywordCandidate, searchConsoleData: SearchConsoleOpportunity[], serp: SerpAnalysis | null, warnings: string[]) {
  const cta = categoryCtas[category];
  const score = candidate.score;
  if (score < 70) {
    warnings.push(`Selected keyword score is ${score}/100, below the configured quality threshold. Publishing best available candidate by admin preference.`);
  }
  if (serp?.servicePageExpected) {
    warnings.push("SERP suggests Google may expect service-page content; article is still being published by admin preference.");
  }

  return {
    category,
    primaryKeyword: candidate.keyword,
    secondaryKeywords: serp?.relatedSearches.slice(0, 6) ?? categorySeeds[category].filter((keyword) => keyword !== candidate.keyword),
    searchIntent: serp?.intent ?? "Commercial investigation",
    targetReader: "A U.S. founder or startup operator comparing patent protection options.",
    readerProblem: `The reader wants practical guidance for ${candidate.keyword} before speaking with an IP professional.`,
    desiredAction: cta.label,
    searchConsoleData,
    keywordPlannerData: {
      status: "not-connected",
      message: "Google Ads Keyword Planner is not connected in v1, so no fake volume or CPC data was used.",
    },
    serpFindings: serp,
    competitorUrls: serp?.organicResults.map((result) => result.link).filter(Boolean).slice(0, 10) ?? [],
    peopleAlsoAsk: serp?.peopleAlsoAsk ?? [],
    contentGaps: serp?.contentGaps ?? ["Provide a direct answer, practical examples, and official-source citations."],
    officialSources: officialSourcesByCategory[category],
    internalLinks: getInternalLinks(category),
    relevantServicePage: inferServicePage(category),
    recommendedCta: cta.label,
    opportunityScore: score,
    reasonForSelection: candidate.reason,
    legalReviewRequirement: "Auto-publish is enabled by admin preference. High-risk legal topics are logged as warnings instead of blocking publication.",
  } satisfies ResearchBrief;
}

async function generateArticleWithOpenAI(brief: ResearchBrief) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_SEO_MODEL || "gpt-5-mini",
      input: [
        {
          role: "system",
          content:
            "You write accurate, commercially useful SEO articles for a U.S. patent services website. Use only the supplied official source URLs as factual anchors. Do not invent fees, deadlines, procedures, law, statistics, or citations. Return valid JSON only.",
        },
        {
          role: "user",
          content: `Create a PatentZoom Knowledge Center article from this research brief. Use a helpful founder-facing voice, include citations as source labels in the body where useful, and avoid legal advice language.\n\nBrief:\n${JSON.stringify(brief, null, 2)}\n\nReturn JSON with keys: title, slug, seoTitle, metaDescription, excerpt, shortAnswer, keyTakeaways array, tableOfContents array, body markdown string, faqs array of {question,answer}, secondaryKeywords array.`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "patentzoom_seo_article",
          schema: {
            type: "object",
            additionalProperties: false,
            required: [
              "title",
              "slug",
              "seoTitle",
              "metaDescription",
              "excerpt",
              "shortAnswer",
              "keyTakeaways",
              "tableOfContents",
              "body",
              "faqs",
              "secondaryKeywords",
            ],
            properties: {
              title: { type: "string" },
              slug: { type: "string" },
              seoTitle: { type: "string" },
              metaDescription: { type: "string" },
              excerpt: { type: "string" },
              shortAnswer: { type: "string" },
              keyTakeaways: { type: "array", items: { type: "string" } },
              tableOfContents: { type: "array", items: { type: "string" } },
              body: { type: "string" },
              faqs: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["question", "answer"],
                  properties: {
                    question: { type: "string" },
                    answer: { type: "string" },
                  },
                },
              },
              secondaryKeywords: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI article generation failed with status ${response.status}.`);
  }

  const json = (await response.json()) as { output_text?: string; output?: { content?: { text?: string }[] }[] };
  const text = json.output_text ?? json.output?.flatMap((item) => item.content ?? []).map((item) => item.text).find(Boolean);
  if (!text) {
    throw new Error("OpenAI did not return article JSON.");
  }

  return JSON.parse(text) as GeneratedArticle;
}

function validateGeneratedArticle(article: GeneratedArticle, brief: ResearchBrief) {
  const warnings: string[] = [];
  if (!article.title || !article.body || article.body.length < 1200) {
    warnings.push("Generated article is shorter than expected for SEO quality.");
  }
  if (!article.metaDescription || article.metaDescription.length > 165) {
    warnings.push("Meta description is missing or longer than typical SEO limits.");
  }
  if (!article.body.toLowerCase().includes(brief.primaryKeyword.toLowerCase().split(" ")[0])) {
    warnings.push("Primary keyword is not clearly represented in the article body.");
  }
  if (!article.faqs.length) {
    warnings.push("Generated article did not include FAQs.");
  }
  return warnings;
}

async function ensureUniqueSlug(baseSlug: string, articles: ArticleRecord[], runDate: string) {
  const normalized = normalizeSlug(baseSlug);
  if (!articles.some((article) => article.slug === normalized)) {
    return normalized;
  }

  const dated = normalizeSlug(`${normalized}-${runDate}`);
  if (!articles.some((article) => article.slug === dated)) {
    return dated;
  }

  return normalizeSlug(`${normalized}-${randomUUID().slice(0, 8)}`);
}

export async function runSeoAutomation(options: { manual?: boolean; retry?: boolean } = {}) {
  const eastern = getEasternParts();
  const category = categoryByWeekday[eastern.weekday];
  const settings = await getSeoAutomationSettings();

  if (!settings.enabled) {
    return {
      status: "skipped" as const,
      message: "SEO automation is disabled.",
    };
  }

  if (!category) {
    return {
      status: "skipped" as const,
      message: "Sunday is a no-publishing day.",
    };
  }

  if (!options.manual && eastern.hour !== settings.publishHourEastern) {
    return {
      status: "skipped" as const,
      message: `Current Eastern hour is ${eastern.hour}; automation only runs at ${settings.publishHourEastern}:00.`,
    };
  }

  const { job, created } = await createSeoJob(eastern.dateKey, category);
  if (!created && job.status === "published") {
    return {
      status: "skipped" as const,
      message: "An article has already been published for today.",
      job,
    };
  }
  if (!created && !["failed", "skipped"].includes(job.status) && !options.retry) {
    return {
      status: "skipped" as const,
      message: "A job already exists for today.",
      job,
    };
  }

  const activeJob: SeoAutomationJob = {
    ...job,
    status: "researching",
    integrations: getIntegrationStates(),
    warnings: [...job.warnings],
    errors: [],
  };
  await upsertSeoJob(activeJob);

  try {
    const searchConsoleData = await fetchSearchConsoleOpportunities(category, activeJob.warnings);
    const candidates = buildCandidates(category, searchConsoleData);
    const selected = candidates[0];
    if (!selected) {
      throw new Error("No keyword candidates could be created.");
    }

    const serp = await fetchSerpAnalysis(selected.keyword, activeJob.warnings);
    selected.serp = serp ?? undefined;
    const articles = await listArticles();
    activeJob.warnings.push(...getDuplicateWarnings(selected.keyword, articles));
    const brief = buildBrief(category, selected, searchConsoleData, serp, activeJob.warnings);

    activeJob.status = "draft";
    activeJob.candidates = candidates;
    activeJob.selectedKeyword = selected.keyword;
    activeJob.opportunityScore = selected.score;
    activeJob.brief = brief;
    await upsertSeoJob(activeJob);

    const generated = await generateArticleWithOpenAI(brief);
    activeJob.warnings.push(...validateGeneratedArticle(generated, brief));
    const slug = await ensureUniqueSlug(generated.slug || generated.title, articles, activeJob.runDate);
    const cta = categoryCtas[category];
    const publishedAt = new Date().toISOString();
    const article = await saveArticle({
      title: generated.title,
      slug,
      category,
      excerpt: generated.excerpt,
      imageUrl: category === "Patent Basics" ? "/globe.svg" : officialImageForCategory(category),
      body: generated.body,
      meta: estimateReadTime(generated.body),
      status: settings.autoPublish ? "published" : "draft",
      publishedAt,
      seoTitle: generated.seoTitle,
      metaDescription: generated.metaDescription,
      primaryKeyword: brief.primaryKeyword,
      secondaryKeywords: generated.secondaryKeywords.length ? generated.secondaryKeywords : brief.secondaryKeywords,
      shortAnswer: generated.shortAnswer,
      keyTakeaways: generated.keyTakeaways,
      tableOfContents: generated.tableOfContents,
      faqs: generated.faqs,
      officialSources: brief.officialSources,
      internalLinks: brief.internalLinks,
      ctaLabel: cta.label,
      ctaHref: cta.href,
      author: "PatentZoom Editorial Team",
      reviewer: "PatentZoom",
      lastReviewedAt: publishedAt,
      canonicalUrl: `${getAppUrl()}/knowledge-center/${slug}`,
      openGraphTitle: generated.seoTitle,
      openGraphDescription: generated.metaDescription,
      structuredData: {},
      automationJobId: activeJob.id,
    });

    activeJob.status = article.status === "published" ? "published" : "draft";
    activeJob.articleId = article.id;
    activeJob.articleSlug = article.slug;
    activeJob.publishedUrl = `${getAppUrl()}/knowledge-center/${article.slug}`;
    activeJob.completedAt = new Date().toISOString();
    await upsertSeoJob(activeJob);

    revalidatePath("/knowledge-center");
    revalidatePath(`/knowledge-center/${article.slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/admin");
    revalidatePath("/admin/seo-automation");

    return {
      status: activeJob.status,
      message: article.status === "published" ? "SEO article published." : "SEO article drafted.",
      job: activeJob,
    };
  } catch (error) {
    activeJob.status = "failed";
    activeJob.errors.push(error instanceof Error ? error.message : "Unknown SEO automation error.");
    activeJob.completedAt = new Date().toISOString();
    await upsertSeoJob(activeJob);

    return {
      status: "failed" as const,
      message: activeJob.errors[activeJob.errors.length - 1],
      job: activeJob,
    };
  }
}

function officialImageForCategory(category: SeoCategory) {
  const mapping: Record<SeoCategory, string> = {
    "Patent Search": "/service-technical.svg",
    "Provisional Patent": "/file.svg",
    "Utility Patent": "/service-software.svg",
    "Design Patent": "/service-design.svg",
    "Patent Filing & Strategy": "/service-strategy.svg",
    "Patent Basics": "/globe.svg",
  };
  return mapping[category];
}

function estimateReadTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(4, Math.ceil(words / 220))} min read`;
}
