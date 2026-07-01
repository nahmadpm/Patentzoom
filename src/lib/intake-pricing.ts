import { referenceServicePages } from "@/lib/site-data";
import {
  getServiceIntentLabel,
  type ServiceIntent,
} from "@/lib/service-intents";

const SEARCH_REPORT_PRICE_CENTS = 29_500;

type SearchOption =
  | "none"
  | "patent-search-report"
  | "review-existing-search-report"
  | null;

type ResolvedPackage = {
  key: string;
  label: string;
  priceLabel: string;
  feeLabel: string;
};

export type IntakeOrderSummary = {
  packageKey: string | null;
  packageLabel: string;
  searchOptionLabel: string;
  orderLines: readonly {
    label: string;
    value: string;
  }[];
  subtotalLabel: string;
  totalLabel: string;
  ccFeeLabel: string;
  amountSubtotalCents: number;
  amountTotalCents: number;
  currency: "usd" | Lowercase<string>;
  stripeLineItems: readonly {
    label: string;
    unitAmountCents: number;
  }[];
};

export type IntakeOrderSummaryResult =
  | {
      ok: false;
      message: string;
    }
  | ({
      ok: true;
    } & IntakeOrderSummary);

function toPackageKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parsePriceLabelToCents(value: string) {
  const match = value.match(/\$([\d,]+(?:\.\d{1,2})?)/);

  if (!match) {
    return null;
  }

  const amount = Number.parseFloat(match[1].replace(/,/g, ""));

  if (!Number.isFinite(amount)) {
    return null;
  }

  return Math.round(amount * 100);
}

function formatUsdFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getSearchOptionLabel(searchOption: SearchOption) {
  if (searchOption === "patent-search-report") {
    return "Patent Search Report";
  }

  if (searchOption === "review-existing-search-report") {
    return "Review Existing Search Report";
  }

  return "No Patent Search Report";
}

function resolvePackage(
  serviceIntent: ServiceIntent,
  packageKey: string | null,
  packageLabel: string | null,
) {
  if (serviceIntent === "patent-search") {
    return {
      key: "patent-search-report",
      label: "Patent Search Report",
      priceLabel: "$295",
      feeLabel: "Search report",
    } satisfies ResolvedPackage;
  }

  if (!(serviceIntent in referenceServicePages)) {
    return null;
  }

  const page =
    referenceServicePages[serviceIntent as keyof typeof referenceServicePages];
  const cards = page.offers.cards.map((card) => ({
    key: toPackageKey(card.name),
    label: card.name,
    priceLabel: card.price,
    feeLabel: card.fee,
  }));

  if (!cards.length) {
    return null;
  }

  if (packageKey) {
    const packageByKey = cards.find((card) => card.key === packageKey);

    if (packageByKey) {
      return packageByKey;
    }
  }

  if (packageLabel) {
    const packageByLabel = cards.find((card) => card.label === packageLabel);

    if (packageByLabel) {
      return packageByLabel;
    }
  }

  if (cards.length === 1) {
    return cards[0];
  }

  return null;
}

export function buildIntakeOrderSummary(input: {
  serviceIntent: ServiceIntent;
  packageKey: string | null;
  packageLabel: string | null;
  searchOption: SearchOption;
  currency?: "usd" | Lowercase<string>;
}): IntakeOrderSummaryResult {
  const resolvedPackage = resolvePackage(
    input.serviceIntent,
    input.packageKey,
    input.packageLabel,
  );

  if (!resolvedPackage) {
    return {
      ok: false as const,
      message: `We could not resolve pricing for ${getServiceIntentLabel(
        input.serviceIntent,
      )}. Please go back and reselect the package.`,
    };
  }

  const packageAmountCents = parsePriceLabelToCents(resolvedPackage.priceLabel);

  if (packageAmountCents === null) {
    return {
      ok: false as const,
      message: `Package pricing for ${resolvedPackage.label} is not in a Stripe-ready format yet.`,
    };
  }

  const searchOptionLabel = getSearchOptionLabel(input.searchOption);
  const stripeLineItems = [
    {
      label: resolvedPackage.label,
      unitAmountCents: packageAmountCents,
    },
  ] as {
    label: string;
    unitAmountCents: number;
  }[];

  if (
    input.searchOption === "patent-search-report" &&
    input.serviceIntent !== "patent-search"
  ) {
    stripeLineItems.push({
      label: "Patent Search Report",
      unitAmountCents: SEARCH_REPORT_PRICE_CENTS,
    });
  }

  const amountSubtotalCents = stripeLineItems.reduce(
    (sum, item) => sum + item.unitAmountCents,
    0,
  );
  const currency = input.currency ?? "usd";

  return {
    ok: true as const,
    packageKey: resolvedPackage.key,
    packageLabel: resolvedPackage.label,
    searchOptionLabel,
    orderLines: stripeLineItems.map((item) => ({
      label: item.label,
      value: formatUsdFromCents(item.unitAmountCents),
    })),
    subtotalLabel: formatUsdFromCents(amountSubtotalCents),
    totalLabel: formatUsdFromCents(amountSubtotalCents),
    ccFeeLabel: "$0.00",
    amountSubtotalCents,
    amountTotalCents: amountSubtotalCents,
    currency,
    stripeLineItems,
  };
}
