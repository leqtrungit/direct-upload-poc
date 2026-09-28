import { ALLOWED_MIME_PREFIX, MAX_UPLOAD_BYTES } from "@/lib/youtube/constants";

export type UploadSessionRequestBody = {
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  title: string;
};

const MAX_FILE_NAME = 255;
const MAX_TITLE = 200;

function asRecord(body: unknown): Record<string, unknown> {
  return (body ?? {}) as Record<string, unknown>;
}

/** Narrow an unknown JSON body into the session-request shape — mirrors `readPartnerSubmission` in `lib/validation.ts`. */
export function readUploadSessionRequest(body: unknown): UploadSessionRequestBody {
  const raw = asRecord(body);
  return {
    fileName: typeof raw.fileName === "string" ? raw.fileName : "",
    fileSizeBytes: typeof raw.fileSizeBytes === "number" ? raw.fileSizeBytes : NaN,
    mimeType: typeof raw.mimeType === "string" ? raw.mimeType : "",
    title: typeof raw.title === "string" ? raw.title : "",
  };
}

export type UploadSessionValidationError =
  | "invalid_file_name"
  | "invalid_file_size"
  | "file_too_large"
  | "invalid_mime_type"
  | "invalid_title";

/** Server-side re-check of everything the client already validated — the request body is attacker-controlled. */
export function validateUploadSessionRequest(
  input: UploadSessionRequestBody,
): UploadSessionValidationError | null {
  if (!input.fileName.trim() || input.fileName.length > MAX_FILE_NAME) return "invalid_file_name";
  if (!Number.isFinite(input.fileSizeBytes) || input.fileSizeBytes <= 0) return "invalid_file_size";
  if (input.fileSizeBytes > MAX_UPLOAD_BYTES) return "file_too_large";
  if (!input.mimeType.startsWith(ALLOWED_MIME_PREFIX)) return "invalid_mime_type";
  if (!input.title.trim() || input.title.length > MAX_TITLE) return "invalid_title";
  return null;
}
