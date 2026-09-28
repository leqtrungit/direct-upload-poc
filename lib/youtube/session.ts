import "server-only";
import { CHANNEL_ALIAS } from "@/lib/youtube/constants";
import { createIntegrationSession } from "@/lib/youtube/integration";
import { createMockSession } from "@/lib/youtube/mock-store";
import type { CreateUploadSessionInput, CreateUploadSessionResult, UploadMode } from "@/lib/youtube/types";

/** Default is mock — a real upload is opt-in via env, never the accidental default. */
export function resolveUploadMode(): UploadMode {
  return process.env.YOUTUBE_UPLOAD_MODE === "integration" ? "integration" : "mock";
}

/**
 * The one function the route handler calls. `origin` builds the mock upload
 * URL as same-origin (so no CORS is involved for the default PoC path); the
 * integration branch returns Google's own cross-origin URL untouched.
 */
export async function createUploadSession(
  input: CreateUploadSessionInput,
  origin: string,
): Promise<CreateUploadSessionResult> {
  const mode = resolveUploadMode();

  if (mode === "integration") {
    const integration = await createIntegrationSession(input);
    return {
      mode: "integration",
      sessionId: integration.sessionId,
      uploadUrl: integration.uploadUrl,
      expiresAt: integration.expiresAt,
      channelAlias: CHANNEL_ALIAS,
    };
  }

  const session = createMockSession({
    fileName: input.fileName,
    totalBytes: input.fileSizeBytes,
    mimeType: input.mimeType,
    title: input.title,
  });

  return {
    mode: "mock",
    sessionId: session.id,
    uploadUrl: `${origin}/api/youtube/mock-upload/${session.id}`,
    expiresAt: new Date(session.expiresAt).toISOString(),
    channelAlias: CHANNEL_ALIAS,
  };
}
