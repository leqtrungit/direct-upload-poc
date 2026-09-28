import { NextResponse } from "next/server";
import { clientKey, isRateLimited } from "@/lib/rate-limit";
import { CHANNEL_ALIAS } from "@/lib/youtube/constants";
import { IntegrationNotConfiguredError, IntegrationRequestError } from "@/lib/youtube/integration";
import { createUploadSession, resolveUploadMode } from "@/lib/youtube/session";
import { readUploadSessionRequest, validateUploadSessionRequest } from "@/lib/youtube/validation";

/**
 * Creates (or mocks) a YouTube resumable upload session and hands the
 * browser only the resulting upload URL — never the OAuth token, refresh
 * token, or client secret that authorized it. See POC.md for the full
 * contract and threat model.
 */
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

  const input = readUploadSessionRequest(body);
  const validationError = validateUploadSessionRequest(input);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  try {
    const session = await createUploadSession(input, origin);
    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof IntegrationNotConfiguredError) {
      return NextResponse.json({ error: "integration_not_configured", message: error.message }, { status: 501 });
    }
    if (error instanceof IntegrationRequestError) {
      console.error("[harnix] youtube integration session failed", error);
      return NextResponse.json({ error: "integration_request_failed", message: error.message }, { status: 502 });
    }
    console.error("[harnix] youtube upload session failed", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

/** Lets the client show a "Mock/PoC" vs "Integration" banner before the user picks a file. */
export function GET() {
  return NextResponse.json({ mode: resolveUploadMode(), channelAlias: CHANNEL_ALIAS });
}
