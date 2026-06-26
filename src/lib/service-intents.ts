export const serviceIntentMap = {
  "provisional-patent": {
    label: "Provisional Patent",
    intakeTitle: "Provisional Patent Intake",
  },
  "utility-patent": {
    label: "Utility Patent",
    intakeTitle: "Utility Patent Intake",
  },
  "design-patent": {
    label: "Design Patent",
    intakeTitle: "Design Patent Intake",
  },
  "patent-search": {
    label: "Patent Search",
    intakeTitle: "Patent Search Intake",
  },
  trademark: {
    label: "Trademark",
    intakeTitle: "Trademark Intake",
  },
  "pct-international": {
    label: "PCT / International",
    intakeTitle: "PCT / International Intake",
  },
  "office-action-responses": {
    label: "Office Action Responses",
    intakeTitle: "Office Action Response Intake",
  },
  "ip-portfolio-strategy": {
    label: "IP Portfolio Strategy",
    intakeTitle: "IP Portfolio Strategy Intake",
  },
} as const;

export type ServiceIntent = keyof typeof serviceIntentMap;

export function normalizeServiceIntent(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  return value in serviceIntentMap ? (value as ServiceIntent) : null;
}

export function getServiceIntentLabel(serviceIntent: ServiceIntent) {
  return serviceIntentMap[serviceIntent].label;
}

export function getIntakeHref(serviceIntent: ServiceIntent, packageKey?: string | null) {
  if (packageKey) {
    return `/intake/${serviceIntent}?package=${encodeURIComponent(packageKey)}`;
  }

  return `/intake/${serviceIntent}`;
}
