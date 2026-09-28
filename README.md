# Direct upload PoC

Standalone Next.js proof of concept: an end user picks a video file and the
browser streams the bytes straight to a YouTube resumable-upload session. The
video never touches this server's filesystem, and the real YouTube
account/channel credentials never leave the server.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run typecheck
```

Open `http://localhost:3000/upload-poc` to try it. Mock mode is the default —
no credentials are required and no request ever reaches Google. See
[`POC.md`](./POC.md) for the full architecture, threat model, and
verification boundary.

## Layout

| Path | What's in it |
| --- | --- |
| `app/page.tsx` | Minimal index page linking to the PoC |
| `app/upload-poc/` | The PoC route |
| `app/api/youtube/*` | Upload-session and mock-upload route handlers |
| `app/globals.css` | Design tokens and base styles |
| `components/youtube-upload-demo.tsx` | The upload UI: file picker, progress, cancel/retry, result |
| `components/ui.tsx`, `components/icons.tsx`, `components/skip-link.tsx` | Minimal shared UI pieces used by the PoC |
| `lib/youtube/*` | Server-side session creation, mock store, real-integration client, validation |
| `lib/youtube-client/*` | Browser-side resumable-upload transport and control loop |
| `lib/rate-limit.ts` | Best-effort in-memory rate limiter for the session-creation endpoint |

Copy `.env.example` to `.env.local` to configure the YouTube integration mode.

## Scope

This repository intentionally contains nothing beyond what the PoC needs: no
marketing pages, blog, lead forms, or design assets. Do not add real
credentials to any committed file.
