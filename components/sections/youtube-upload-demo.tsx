"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertCircleIcon, CheckIcon, SpinnerIcon } from "@/components/icons";
import { Card, MonoLabel, Section, SectionHeading, StatusPill, Tag } from "@/components/ui";
import { DEFAULT_CHUNK_SIZE } from "@/lib/youtube-client/chunking";
import { formatBytes, formatPercent } from "@/lib/youtube-client/format";
import {
  runResumableUpload,
  queryUploadedBytes,
  UploadAbortedError,
  UploadFailedError,
  type UploadResult,
} from "@/lib/youtube-client/upload-controller";
import { xhrSendChunk } from "@/lib/youtube-client/xhr-transport";

type Phase = "idle" | "creating-session" | "uploading" | "resuming" | "error" | "done" | "cancelled";

type UploadMode = "mock" | "integration";

type SessionInfo = {
  mode: UploadMode;
  uploadUrl: string;
  sessionId: string;
  channelAlias: string;
};

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Chọn một video để bắt đầu.",
  "creating-session": "Đang tạo phiên tải lên…",
  resuming: "Đang kiểm tra tiến độ trước đó…",
  uploading: "Đang tải lên…",
  error: "Tải lên gặp lỗi.",
  done: "Đã tải lên xong.",
  cancelled: "Đã hủy tải lên.",
};

function mimeTypeOf(file: File): string {
  return file.type || "video/mp4";
}

/**
 * The end-user-facing PoC surface: pick a video, watch it stream straight to
 * a resumable upload session, never through this server. The only YouTube
 * identity ever shown here is the branded alias — the real channel and its
 * OAuth credentials live entirely in `lib/youtube/*` on the server. See
 * POC.md for the full threat model.
 */
export function YoutubeUploadDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorRetryable, setErrorRetryable] = useState(true);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [appMode, setAppMode] = useState<UploadMode | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const inputId = useId();
  const statusId = useId();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/youtube/upload-session")
      .then((res) => res.json())
      .then((data: { mode?: UploadMode }) => {
        if (!cancelled && data.mode) setAppMode(data.mode);
      })
      .catch(() => {
        // Banner just stays blank — this is a convenience preview, not load-bearing.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function resetForNewFile(nextFile: File | null) {
    abortRef.current?.abort();
    setFile(nextFile);
    setPhase("idle");
    setUploadedBytes(0);
    setTotalBytes(nextFile?.size ?? 0);
    setErrorMessage(null);
    setResult(null);
    setSession(null);
  }

  async function runUpload(info: SessionInfo, targetFile: File, startAtBytes: number) {
    setPhase("uploading");
    setTotalBytes(targetFile.size);
    setUploadedBytes(startAtBytes);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const uploadResult = await runResumableUpload({
        file: targetFile,
        uploadUrl: info.uploadUrl,
        chunkSize: DEFAULT_CHUNK_SIZE,
        sendChunk: xhrSendChunk,
        mimeType: mimeTypeOf(targetFile),
        signal: controller.signal,
        onProgress: (loaded, total) => {
          setUploadedBytes(loaded);
          setTotalBytes(total);
        },
        startAtBytes,
      });
      setResult(uploadResult);
      setPhase("done");
    } catch (error) {
      if (error instanceof UploadAbortedError) {
        setPhase("cancelled");
        return;
      }
      setPhase("error");
      setErrorMessage(error instanceof Error ? error.message : "Tải lên thất bại.");
      setErrorRetryable(error instanceof UploadFailedError ? error.retryable : true);
    }
  }

  async function startUpload() {
    if (!file) return;
    setPhase("creating-session");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/youtube/upload-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileSizeBytes: file.size,
          mimeType: mimeTypeOf(file),
          title: file.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : `Không thể tạo phiên (HTTP ${res.status}).`);
      }

      const info: SessionInfo = {
        mode: data.mode,
        uploadUrl: data.uploadUrl,
        sessionId: data.sessionId,
        channelAlias: data.channelAlias,
      };
      setSession(info);
      setAppMode(info.mode);
      await runUpload(info, file, 0);
    } catch (error) {
      setPhase("error");
      setErrorMessage(error instanceof Error ? error.message : "Không thể tạo phiên tải lên.");
      setErrorRetryable(true);
    }
  }

  function cancelUpload() {
    abortRef.current?.abort();
  }

  async function retryUpload() {
    if (!file || !session) return;
    setPhase("resuming");
    setErrorMessage(null);

    try {
      const probe = await queryUploadedBytes({
        uploadUrl: session.uploadUrl,
        totalBytes: file.size,
        sendChunk: xhrSendChunk,
      });
      if (probe.status === "complete") {
        setResult(probe.result);
        setPhase("done");
        return;
      }
      await runUpload(session, file, probe.receivedBytes);
    } catch (error) {
      setPhase("error");
      setErrorMessage(error instanceof Error ? error.message : "Không thể tiếp tục tải lên.");
      setErrorRetryable(true);
    }
  }

  const isBusy = phase === "creating-session" || phase === "uploading" || phase === "resuming";
  const percent = formatPercent(uploadedBytes, totalBytes || file?.size || 0);

  return (
    <Section id="youtube-upload-poc">
      <div className="flex flex-wrap items-center gap-3">
        <SectionHeading>Tải video lên YouTube — PoC</SectionHeading>
        <StatusPill color={appMode === "integration" ? "var(--accent)" : "#e0a030"}>
          {appMode === "integration" ? "Tích hợp thật" : "Mock · PoC"}
        </StatusPill>
      </div>
      <p className="mt-3 mb-0 max-w-[60ch] text-base text-text2">
        Trình duyệt gửi thẳng byte video tới phiên tải lên khả tiếp diễn (resumable) của YouTube — video không đi
        qua, và không được ghi vào, máy chủ này.
      </p>

      <Card className="mt-6 flex max-w-[560px] flex-col gap-5 p-6">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface3 font-display text-base font-semibold text-text"
          >
            A
          </div>
          <div>
            <MonoLabel>Kênh đăng tải</MonoLabel>
            <div className="text-[15px] font-semibold text-text">Kênh A</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={inputId} className="text-sm font-medium text-text">
            Chọn video
          </label>
          <input
            id={inputId}
            type="file"
            accept="video/*"
            disabled={isBusy}
            onChange={(event) => resetForNewFile(event.target.files?.[0] ?? null)}
            className="text-sm text-text2 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-surface2 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-text disabled:cursor-not-allowed disabled:opacity-60"
          />
          {file ? (
            <div className="font-mono text-[12.5px] text-text3">
              {file.name} · {formatBytes(file.size)}
            </div>
          ) : null}
        </div>

        {totalBytes > 0 && phase !== "idle" ? (
          <div className="flex flex-col gap-2">
            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 overflow-hidden rounded-full bg-surface2"
            >
              <div
                className="h-full rounded-full bg-accent transition-[width]"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[11px] text-text3">
              <span>{formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}</span>
              <span>{percent}%</span>
            </div>
          </div>
        ) : null}

        <div id={statusId} role="status" className="flex items-center gap-2 text-sm text-text2">
          {isBusy ? <SpinnerIcon /> : null}
          {phase === "error" ? <AlertCircleIcon stroke="var(--err)" /> : null}
          {phase === "done" ? <CheckIcon stroke="var(--accent)" /> : null}
          <span style={phase === "error" ? { color: "var(--err)" } : undefined}>
            {PHASE_LABEL[phase]}
            {phase === "error" && errorMessage ? ` ${errorMessage}` : ""}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {phase === "uploading" ? (
            <button
              type="button"
              onClick={cancelUpload}
              className="cursor-pointer rounded-lg border border-line2 px-[14px] py-[9px] text-sm font-semibold text-text"
            >
              Hủy
            </button>
          ) : phase === "error" && errorRetryable ? (
            <button
              type="button"
              onClick={retryUpload}
              className="cursor-pointer rounded-lg border-0 bg-accent px-[14px] py-[9px] text-sm font-semibold text-accent-ink"
            >
              Thử lại
            </button>
          ) : (
            <button
              type="button"
              disabled={!file || isBusy}
              onClick={startUpload}
              className="cursor-pointer rounded-lg border-0 bg-accent px-[14px] py-[9px] text-sm font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tải lên
            </button>
          )}
          {file && (phase === "done" || phase === "error" || phase === "cancelled") ? (
            <button
              type="button"
              onClick={() => resetForNewFile(null)}
              className="cursor-pointer rounded-lg border border-line2 px-[14px] py-[9px] text-sm font-semibold text-text"
            >
              Chọn video khác
            </button>
          ) : null}
        </div>

        {phase === "done" && result ? (
          <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface2 p-3">
            <MonoLabel>Kết quả ({session?.mode === "integration" ? "tích hợp thật" : "mock"})</MonoLabel>
            <div className="font-mono text-[12.5px] break-all text-text">ID: {result.id}</div>
            {session?.mode !== "integration" ? (
              <div className="text-[12.5px] text-text3">
                Đây là ID giả lập — không có video thật nào được tạo trên YouTube.
              </div>
            ) : null}
          </div>
        ) : null}

        <Tag>{appMode === "integration" ? "Chế độ: tích hợp thật" : "Chế độ: mock / PoC"}</Tag>
      </Card>
    </Section>
  );
}
