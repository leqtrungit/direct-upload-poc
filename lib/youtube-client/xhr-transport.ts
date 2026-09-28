import { parseRangeHeader } from "@/lib/youtube-client/chunking";
import type { SendChunk } from "@/lib/youtube-client/upload-controller";

/**
 * Browser transport for `runResumableUpload`/`queryUploadedBytes`. Uses
 * `XMLHttpRequest` rather than `fetch` because only `xhr.upload.onprogress`
 * reports upload byte progress — `fetch` has no equivalent for request
 * bodies. This is the only file that talks to the network; everything it
 * calls (`uploadUrl`) came from the server's session-creation response, and
 * this function never sees an OAuth token or account credential.
 */
export const xhrSendChunk: SendChunk = ({ uploadUrl, chunk, contentRange, mimeType, onProgress, signal }) => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Upload cancelled", "AbortError"));
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Range", contentRange);
    if (mimeType) xhr.setRequestHeader("Content-Type", mimeType);

    const onAbort = () => xhr.abort();
    signal?.addEventListener("abort", onAbort, { once: true });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded);
    };

    xhr.onabort = () => {
      signal?.removeEventListener("abort", onAbort);
      reject(new DOMException("Upload cancelled", "AbortError"));
    };

    xhr.onerror = () => {
      signal?.removeEventListener("abort", onAbort);
      resolve({ kind: "error", status: 0, message: "Network error while uploading" });
    };

    xhr.onload = () => {
      signal?.removeEventListener("abort", onAbort);

      if (xhr.status === 308) {
        resolve({ kind: "incomplete", receivedBytes: parseRangeHeader(xhr.getResponseHeader("Range")) });
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        let parsed: unknown = null;
        try {
          parsed = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        } catch {
          // Non-JSON success body — surface it as an unknown id rather than failing the upload.
        }
        const id =
          parsed && typeof parsed === "object" && "id" in parsed
            ? String((parsed as { id: unknown }).id)
            : "unknown";
        resolve({ kind: "complete", result: { id, raw: parsed } });
        return;
      }

      resolve({ kind: "error", status: xhr.status, message: xhr.responseText || `HTTP ${xhr.status}` });
    };

    xhr.send(chunk as Blob);
  });
};
