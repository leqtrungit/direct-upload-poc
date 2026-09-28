import "server-only";

export class IntegrationNotConfiguredError extends Error {}
export class IntegrationRequestError extends Error {}

const REQUIRED_ENV_VARS = ["YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET", "YOUTUBE_REFRESH_TOKEN"] as const;

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

/**
 * Exchanges the server-held refresh token for a short-lived access token.
 * Client ID/secret/refresh token never leave this function — only the
 * resulting resumable session URL (below) is ever handed to the browser.
 */
async function fetchAccessToken(): Promise<string> {
  const clientId = readEnv("YOUTUBE_CLIENT_ID")!;
  const clientSecret = readEnv("YOUTUBE_CLIENT_SECRET")!;
  const refreshToken = readEnv("YOUTUBE_REFRESH_TOKEN")!;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new IntegrationRequestError(`Token refresh failed: HTTP ${res.status}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new IntegrationRequestError("Token refresh response missing access_token");
  }
  return data.access_token;
}

/**
 * The exact server-side request documented in `POC.md` under "Integration
 * mode contract": initiate a resumable upload with a server-held OAuth
 * access token, then hand the browser only the `Location` header YouTube
 * returns. That URL is what the browser PUTs video bytes to directly — it is
 * scoped to this one video and carries no account credential.
 *
 * This path is implemented against Google's documented API contract but has
 * not been exercised against a live channel in this environment (no test
 * credentials exist here) — see POC.md's "Mock vs. integration" section
 * before treating it as verified.
 */
export async function createIntegrationSession(input: {
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  title: string;
}): Promise<{ sessionId: string; uploadUrl: string; expiresAt: string }> {
  for (const name of REQUIRED_ENV_VARS) {
    if (!readEnv(name)) {
      throw new IntegrationNotConfiguredError(
        `Missing ${name}. See POC.md "Integration mode contract" for the full env var list.`,
      );
    }
  }

  const accessToken = await fetchAccessToken();

  const res = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": input.mimeType,
        "X-Upload-Content-Length": String(input.fileSizeBytes),
      },
      body: JSON.stringify({
        snippet: { title: input.title, description: "Uploaded via Harnix YouTube upload PoC" },
        status: { privacyStatus: "unlisted" },
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new IntegrationRequestError(`YouTube resumable initiation failed: HTTP ${res.status} ${detail}`.trim());
  }

  const uploadUrl = res.headers.get("location");
  if (!uploadUrl) {
    throw new IntegrationRequestError("YouTube did not return a resumable session Location header");
  }

  // Google does not publish an exact TTL for resumable session URLs. This is
  // a conservative estimate purely so the client can warn before it likely
  // expires — the real deadline is whatever Google's servers enforce.
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  return { sessionId: crypto.randomUUID(), uploadUrl, expiresAt };
}
