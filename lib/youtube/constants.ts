/** The only thing an end user ever sees — the real channel name stays server-side. */
export const CHANNEL_ALIAS = "Kênh A";

/** PoC-only cap so a mistaken multi-GB drop doesn't run the mock loop forever. Not env-configurable on purpose — this is a demo limit, not a product one. */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024;

export const ALLOWED_MIME_PREFIX = "video/";

/**
 * How long a *mock* session stays valid. Real YouTube resumable session URLs
 * are reportedly valid much longer (Google does not publish an exact number),
 * but this PoC keeps its own mock window short to demonstrate — and force
 * the client to handle — the "short-lived, single-use" requirement rather
 * than relying on a session that never expires in practice.
 */
export const MOCK_SESSION_TTL_MS = 15 * 60 * 1000;
