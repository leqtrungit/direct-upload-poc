import type { Lang } from "@/lib/copy";

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type PartnerField = "name" | "email" | "company" | "app" | "want";

export type PartnerSubmission = {
  name: string;
  email: string;
  company: string;
  size: string;
  app: string;
  want: string;
};

export type FieldErrors = Partial<Record<PartnerField, true>>;

export const emptyPartnerSubmission: PartnerSubmission = {
  name: "",
  email: "",
  company: "",
  size: "",
  app: "",
  want: "",
};

/** Shared by the form and the route handler so both agree on what is valid. */
export function validatePartner(values: PartnerSubmission): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = true;
  if (!EMAIL_RE.test(values.email.trim())) errors.email = true;
  if (!values.company.trim()) errors.company = true;
  if (!values.app) errors.app = true;
  if (!values.want.trim()) errors.want = true;
  return errors;
}

export function isValidEmail(value: string) {
  return EMAIL_RE.test(value.trim());
}

function asRecord(body: unknown): Record<string, unknown> {
  return (body ?? {}) as Record<string, unknown>;
}

function str(raw: Record<string, unknown>, key: string): string {
  return typeof raw[key] === "string" ? (raw[key] as string) : "";
}

/** Narrow an unknown JSON body into the submission shape. */
export function readPartnerSubmission(body: unknown): PartnerSubmission {
  const raw = asRecord(body);
  return {
    name: str(raw, "name"),
    email: str(raw, "email"),
    company: str(raw, "company"),
    size: str(raw, "size"),
    app: str(raw, "app"),
    want: str(raw, "want"),
  };
}

export const APP_VALUES = ["web", "mobile", "both"] as const;

export function isValidAppValue(value: string): boolean {
  return (APP_VALUES as readonly string[]).includes(value);
}

/**
 * Every lead form carries a honeypot field alongside its real fields. It is
 * hidden from sighted and assistive-tech users alike (see the `hp_confirm`
 * input in the form components) — a human never fills it, so any non-empty
 * value marks the submission as automated.
 */
export const HONEYPOT_FIELD = "hp_confirm";

export function isHoneypotTriggered(body: unknown): boolean {
  return str(asRecord(body), HONEYPOT_FIELD).trim().length > 0;
}

/** Max lengths enforced server-side, independent of the client's own UX validation. */
export const LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  want: 2000,
  page: 200,
} as const;

export function exceedsLimits(
  values: Partial<Record<keyof typeof LIMITS, string>>,
): boolean {
  return Object.entries(values).some(([key, value]) => {
    if (value === undefined) return false;
    return value.length > LIMITS[key as keyof typeof LIMITS];
  });
}

export type LeadContext = { locale: Lang; page: string };

/**
 * `locale` and `page` describe where the submission came from — the client
 * reads them off `useSite()` / `window.location` at submit time. Both are
 * clamped/defaulted here rather than trusted, since the request body is
 * attacker-controlled.
 */
export function readLeadContext(body: unknown): LeadContext {
  const raw = asRecord(body);
  const locale: Lang = raw.locale === "en" ? "en" : "vi";
  const rawPage = str(raw, "page").trim().slice(0, LIMITS.page);
  const page = rawPage.startsWith("/") ? rawPage : "/";
  return { locale, page };
}
