import "server-only";
import { MOCK_SESSION_TTL_MS } from "@/lib/youtube/constants";

export type MockSessionStatus = "pending" | "uploading" | "completed";

export type MockSession = {
  id: string;
  fileName: string;
  totalBytes: number;
  mimeType: string;
  title: string;
  receivedBytes: number;
  status: MockSessionStatus;
  createdAt: number;
  expiresAt: number;
  videoId: string;
};

/**
 * Best-effort, no DB — same shape as `lib/rate-limit.ts`'s hit map. This lives
 * in the memory of a single server instance, resets on cold start/restart,
 * and does not share state across instances. Good enough for a PoC that never
 * writes the video itself anywhere; there is no data here worth persisting.
 */
const sessions = new Map<string, MockSession>();

const MAX_TRACKED_SESSIONS = 500;

function purgeExpired(now: number) {
  for (const [id, session] of sessions) {
    if (session.expiresAt < now) sessions.delete(id);
  }
}

export function createMockSession(input: {
  fileName: string;
  totalBytes: number;
  mimeType: string;
  title: string;
}): MockSession {
  const now = Date.now();
  purgeExpired(now);
  if (sessions.size > MAX_TRACKED_SESSIONS) sessions.clear();

  const id = crypto.randomUUID();
  const session: MockSession = {
    id,
    fileName: input.fileName,
    totalBytes: input.totalBytes,
    mimeType: input.mimeType,
    title: input.title,
    receivedBytes: 0,
    status: "pending",
    createdAt: now,
    expiresAt: now + MOCK_SESSION_TTL_MS,
    videoId: `mock-${id.slice(0, 8)}`,
  };
  sessions.set(id, session);
  return session;
}

/** Returns `null` for both "never existed" and "expired" — callers should treat them the same (404). */
export function getMockSession(id: string): MockSession | null {
  const session = sessions.get(id);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(id);
    return null;
  }
  return session;
}

export function updateMockSession(id: string, patch: Partial<MockSession>): MockSession | null {
  const session = getMockSession(id);
  if (!session) return null;
  Object.assign(session, patch);
  return session;
}

/** Test-only escape hatch — the module-level map otherwise leaks session state across test cases. */
export function __clearMockSessionsForTests() {
  sessions.clear();
}
