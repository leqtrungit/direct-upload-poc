import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[640px] flex-col items-start justify-center gap-4 px-6">
      <h1 className="m-0 font-display text-3xl font-semibold text-text">Direct upload PoC</h1>
      <p className="m-0 max-w-[55ch] text-base text-text2">
        This is a standalone proof of concept for uploading video straight from the browser to a
        YouTube resumable-upload session, bypassing this server for the video bytes themselves.
      </p>
      <Link
        href="/upload-poc"
        className="rounded-lg border-0 bg-accent px-[14px] py-[9px] text-sm font-semibold text-accent-ink no-underline"
      >
        Open the upload PoC
      </Link>
      <p className="m-0 text-sm text-text3">See POC.md in the repo for the full write-up.</p>
    </main>
  );
}
