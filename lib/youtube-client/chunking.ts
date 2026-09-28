/** 8 MiB — a multiple of the 256 KiB unit YouTube's resumable protocol requires for intermediate chunk sizes. */
export const DEFAULT_CHUNK_SIZE = 8 * 1024 * 1024;

export function formatContentRange(start: number, end: number, totalBytes: number): string {
  return `bytes ${start}-${end}/${totalBytes}`;
}

/** The "how much do you have?" probe the resumable protocol uses to resume after a reload or a dropped connection. */
export function formatStatusProbeRange(totalBytes: number): string {
  return `bytes */${totalBytes}`;
}

/** Parses a resumable endpoint's `Range` response header (`"bytes=0-1048575"`) into the next byte offset to send. No header at all means nothing has been received yet. */
export function parseRangeHeader(value: string | null): number {
  if (!value) return 0;
  const match = /^bytes=0-(\d+)$/.exec(value.trim());
  if (!match) return 0;
  return Number(match[1]) + 1;
}

/** Network errors (status 0), rate limiting, and server errors are worth retrying; a 4xx caused by a bad request is not. */
export function isRetryableStatus(status: number): boolean {
  return status === 0 || status === 429 || status >= 500;
}
