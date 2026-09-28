import { formatContentRange, formatStatusProbeRange, isRetryableStatus } from "@/lib/youtube-client/chunking";

export type UploadResult = { id: string; raw: unknown };

export type ChunkOutcome =
  | { kind: "incomplete"; receivedBytes: number }
  | { kind: "complete"; result: UploadResult }
  | { kind: "error"; status: number; message: string };

/**
 * The one seam between this file's pure control flow and an actual network
 * call. The browser build (`xhr-transport.ts`) implements this with
 * `XMLHttpRequest` for real upload-progress events; tests implement it with
 * an in-memory fake. Either way, the loop below can't tell the difference —
 * which is also true of a mock vs. a real YouTube session at the HTTP level.
 */
export type SendChunk = (args: {
  uploadUrl: string;
  chunk: Blob | Uint8Array;
  contentRange: string;
  mimeType?: string;
  onProgress?: (loadedInChunk: number) => void;
  signal?: AbortSignal;
}) => Promise<ChunkOutcome>;

export class UploadAbortedError extends Error {}

export class UploadFailedError extends Error {
  retryable: boolean;
  constructor(message: string, retryable: boolean) {
    super(message);
    this.retryable = retryable;
  }
}

type UploadFile = { size: number; slice: (start: number, end: number) => Blob | Uint8Array };

/**
 * Drives one resumable upload from `startAtBytes` to completion, one chunk at
 * a time. The server is treated as authoritative about how many bytes it has
 * — after every chunk, the loop advances to whatever `receivedBytes` the
 * response reports rather than assuming the chunk it just sent landed in
 * full, which is what makes resuming after a dropped response safe.
 */
export async function runResumableUpload(params: {
  file: UploadFile;
  uploadUrl: string;
  chunkSize: number;
  sendChunk: SendChunk;
  mimeType?: string;
  signal?: AbortSignal;
  onProgress?: (uploadedBytes: number, totalBytes: number) => void;
  startAtBytes?: number;
}): Promise<UploadResult> {
  const { file, uploadUrl, chunkSize, sendChunk, mimeType, signal, onProgress } = params;
  let uploaded = params.startAtBytes ?? 0;

  if (file.size === 0) {
    throw new UploadFailedError("Cannot upload an empty file", false);
  }

  while (uploaded < file.size) {
    if (signal?.aborted) throw new UploadAbortedError("Upload cancelled");

    const end = Math.min(uploaded + chunkSize, file.size) - 1;
    const chunk = file.slice(uploaded, end + 1);
    const contentRange = formatContentRange(uploaded, end, file.size);
    const chunkStart = uploaded;

    const outcome = await sendChunk({
      uploadUrl,
      chunk,
      contentRange,
      mimeType,
      signal,
      onProgress: (loadedInChunk) => onProgress?.(chunkStart + loadedInChunk, file.size),
    });

    if (outcome.kind === "complete") {
      onProgress?.(file.size, file.size);
      return outcome.result;
    }
    if (outcome.kind === "error") {
      throw new UploadFailedError(outcome.message, isRetryableStatus(outcome.status));
    }
    if (outcome.receivedBytes <= uploaded) {
      throw new UploadFailedError("Server did not acknowledge any progress on this chunk", true);
    }
    uploaded = outcome.receivedBytes;
    onProgress?.(uploaded, file.size);
  }

  throw new UploadFailedError("Upload loop exited without a completed response", false);
}

export type UploadedBytesQuery =
  | { status: "complete"; result: UploadResult }
  | { status: "incomplete"; receivedBytes: number };

/**
 * Queries how many bytes a resumable session already has — used to resume
 * after an error or a page reload without resending bytes the server already
 * got. `status: "complete"` covers the case where a chunk actually finished
 * server-side but the response never reached the browser (e.g. the
 * connection dropped after the server wrote it) — the real reason this probe
 * exists in the resumable protocol.
 */
export async function queryUploadedBytes(params: {
  uploadUrl: string;
  totalBytes: number;
  sendChunk: SendChunk;
}): Promise<UploadedBytesQuery> {
  const outcome = await params.sendChunk({
    uploadUrl: params.uploadUrl,
    chunk: new Uint8Array(0),
    contentRange: formatStatusProbeRange(params.totalBytes),
  });
  if (outcome.kind === "complete") return { status: "complete", result: outcome.result };
  if (outcome.kind === "error") throw new UploadFailedError(outcome.message, isRetryableStatus(outcome.status));
  return { status: "incomplete", receivedBytes: outcome.receivedBytes };
}
