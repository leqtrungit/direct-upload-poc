import "server-only";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Best-effort, no DB. This map lives in the memory of a single server
 * instance, so it resets on cold start/restart and does not share state
 * across instances — enough to blunt a naive retry loop or a script hitting
 * the endpoint in a tight loop, not a defense against a distributed sender.
 */
const hits = new Map<string, number[]>();

/** Caps memory if an instance stays warm long enough to see many unique keys. */
const MAX_TRACKED_KEYS = 5000;

export function isRateLimited(key: string): boolean {
  if (hits.size > MAX_TRACKED_KEYS) hits.clear();

  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

/** The first hop in `x-forwarded-for`, or "unknown" if the platform does not set it. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
