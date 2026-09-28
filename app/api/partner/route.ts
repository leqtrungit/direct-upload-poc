import { NextResponse } from "next/server";
import { companySizes } from "@/lib/copy";
import { deliverLead } from "@/lib/leads";
import { clientKey, isRateLimited } from "@/lib/rate-limit";
import {
  exceedsLimits,
  isHoneypotTriggered,
  isValidAppValue,
  readLeadContext,
  readPartnerSubmission,
  validatePartner,
} from "@/lib/validation";

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ error: "rejected" }, { status: 400 });
  }

  const submission = readPartnerSubmission(body);

  const errors = validatePartner(submission);
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const oversized = exceedsLimits({
    name: submission.name,
    email: submission.email,
    company: submission.company,
    want: submission.want,
  });
  const validApp = isValidAppValue(submission.app);
  const validSize =
    submission.size === "" ||
    (companySizes as readonly string[]).includes(submission.size);

  if (oversized || !validApp || !validSize) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { locale, page } = readLeadContext(body);

  try {
    await deliverLead({
      eventType: "partner.submitted",
      locale,
      page,
      payload: submission,
    });
  } catch (error) {
    console.error("[harnix] partner lead delivery failed", error);
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
