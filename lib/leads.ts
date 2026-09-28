import "server-only";
import type { Lang } from "@/lib/copy";

export type LeadEventType = "waitlist.submitted" | "partner.submitted";

export type LeadEnvelope = {
  schemaVersion: 1;
  eventId: string;
  eventType: LeadEventType;
  occurredAt: string;
  source: string;
  page: string;
  locale: Lang;
  payload: Record<string, unknown>;
};

const SOURCE = "harnix-landing";
const WEBHOOK_TIMEOUT_MS = 8000;

/** Thrown for every non-success outcome — a timeout, a network error, or a non-2xx response. */
export class LeadDeliveryError extends Error {}

function buildEnvelope(
  eventType: LeadEventType,
  page: string,
  locale: Lang,
  payload: Record<string, unknown>,
): LeadEnvelope {
  return {
    schemaVersion: 1,
    eventId: crypto.randomUUID(),
    eventType,
    occurredAt: new Date().toISOString(),
    source: SOURCE,
    page,
    locale,
    payload,
  };
}

/**
 * Delivers one lead as a JSON envelope.
 *
 * No CRM is wired up yet, so the default is to POST to `LEADS_WEBHOOK_URL`
 * (a Google Apps Script Web App is the expected receiver, but anything that
 * accepts JSON works). `LEADS_WEBHOOK_SECRET`, if set, travels as the
 * `webhookSecret` field in the body rather than a header — an Apps Script
 * Web App reads `e.postData.contents` and has no convenient way to check a
 * custom header, so the shared secret has to live where the script can see
 * it. Without `LEADS_WEBHOOK_URL` the lead is logged server-side and the
 * caller still gets a success — there is nowhere to fail to deliver to yet.
 * With it set, a timeout, a network error or a non-2xx response all throw;
 * the caller is responsible for not reporting success when this rejects.
 */
export async function deliverLead(params: {
  eventType: LeadEventType;
  page: string;
  locale: Lang;
  payload: Record<string, unknown>;
}): Promise<void> {
  const { eventType, page, locale, payload } = params;
  const envelope = buildEnvelope(eventType, page, locale, payload);

  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) {
    console.info("[harnix] lead received (no LEADS_WEBHOOK_URL set)", envelope);
    return;
  }

  const secret = process.env.LEADS_WEBHOOK_SECRET ?? "";
  const body = JSON.stringify({ ...envelope, webhookSecret: secret });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    throw new LeadDeliveryError(
      timedOut ? "Lead webhook timed out" : "Lead webhook request failed",
    );
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new LeadDeliveryError(`Lead webhook responded ${res.status}`);
  }
}
