import { NextResponse } from "next/server";
import { getMockSession, type MockSession, updateMockSession } from "@/lib/youtube/mock-store";

/** Needs a real request body stream, so this can't run on the edge runtime. */
export const runtime = "nodejs";

type RouteParams = { params: Promise<{ sessionId: string }> };

type ParsedContentRange =
  | { kind: "status"; total: number }
  | { kind: "chunk"; start: number; end: number; total: number };

/** Mirrors the two `Content-Range` shapes YouTube's resumable protocol uses: `bytes start-end/total` for a chunk, `bytes *\/total` to ask "how much do you have?". */
function parseContentRange(header: string | null): ParsedContentRange | null {
  if (!header) return null;

  const statusMatch = /^bytes \*\/(\d+)$/.exec(header.trim());
  if (statusMatch) return { kind: "status", total: Number(statusMatch[1]) };

  const chunkMatch = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(header.trim());
  if (!chunkMatch) return null;
  return { kind: "chunk", start: Number(chunkMatch[1]), end: Number(chunkMatch[2]), total: Number(chunkMatch[3]) };
}

/** Reads the body to completion, counting bytes — never buffering or writing them, so the video never touches this server's filesystem or memory as a whole. */
async function drainBody(request: Request): Promise<number> {
  if (!request.body) return 0;
  const reader = request.body.getReader();
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) bytes += value.byteLength;
  }
  return bytes;
}

/** A 308 with the real YouTube resumable semantics: `Range` header present only once at least one byte has been received. */
function incomplete(receivedBytes: number) {
  const headers: Record<string, string> = { "X-Mock-Upload": "true" };
  if (receivedBytes > 0) headers.Range = `bytes=0-${receivedBytes - 1}`;
  return new NextResponse(null, { status: 308, headers });
}

/** Minimal stand-in for the `Video` resource the real API returns on completion. */
function videoResource(session: MockSession) {
  return {
    kind: "youtube#video (mock)",
    id: session.videoId,
    snippet: { title: session.title },
    status: { uploadStatus: "uploaded", privacyStatus: "unlisted" },
    mock: true,
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { sessionId } = await params;
  const session = getMockSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "session_not_found_or_expired" }, { status: 404 });
  }
  if (session.status === "completed") {
    return NextResponse.json(videoResource(session), { status: 200 });
  }

  const range = parseContentRange(request.headers.get("content-range"));

  // A status probe (empty body, "bytes */total") — the client asking how much this session already has, e.g. before resuming after a reload.
  if (range?.kind === "status") {
    if (range.total !== session.totalBytes) {
      return NextResponse.json({ error: "size_mismatch" }, { status: 400 });
    }
    return incomplete(session.receivedBytes);
  }

  const chunkStart = range ? range.start : 0;
  const declaredTotal = range ? range.total : session.totalBytes;

  if (declaredTotal !== session.totalBytes) {
    return NextResponse.json({ error: "size_mismatch" }, { status: 400 });
  }

  if (chunkStart !== session.receivedBytes) {
    // Out-of-order or already-seen chunk — tell the client the truth rather than trusting its offset, same as the real API.
    return incomplete(session.receivedBytes);
  }

  const chunkBytes = await drainBody(request);
  const receivedBytes = session.receivedBytes + chunkBytes;
  const status = receivedBytes >= session.totalBytes ? "completed" : "uploading";
  const updated = updateMockSession(sessionId, { receivedBytes, status });
  if (!updated) {
    return NextResponse.json({ error: "session_not_found_or_expired" }, { status: 404 });
  }

  if (updated.status === "completed") {
    return NextResponse.json(videoResource(updated), { status: 200 });
  }
  return incomplete(updated.receivedBytes);
}
