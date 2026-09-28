# CLAUDE.md

Guidance for Claude Code (or any agent) working in this repository.

## What this repository is

A **standalone proof of concept** demonstrating direct-from-browser video
uploads to YouTube's resumable-upload API. It exists to answer one question:
*can a browser stream a file straight to YouTube while the real channel's
OAuth credentials stay server-side?*

**Scope boundaries — read before doing anything else:**

- This is **not** a product feature and is **not** wired into any larger
  application. There is no "Harnix" or other host-product context here — do
  not assume this code will be imported into, or shares conventions with,
  any other repository.
- It intentionally contains nothing beyond what the PoC needs: no marketing
  pages, no blog, no lead forms, no design system, no shared component
  library.
- The task for the team using this repo is typically **run it and verify the
  real YouTube integration path**, which has not been exercised end-to-end
  in the environment that produced this code (see "Known limitations"
  below). Treat the integration code as "implemented per spec, unverified,"
  not "known working."

For full architecture, request/response shapes, and the threat model, read
[`POC.md`](./POC.md) — this file summarizes what's needed to run and verify
it; POC.md is the source of truth for details.

## Stack

- Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4.
- No backend database, no ORM, no auth system — the only state is an
  in-memory mock-session map.
- No test runner is configured (see "Known limitations").

## Directory / file map

| Path | Role |
| --- | --- |
| `app/upload-poc/page.tsx` | The PoC route (not linked from any nav, marked `noindex`) |
| `app/page.tsx` | Minimal index linking to the PoC |
| `app/api/youtube/upload-session/route.ts` | `POST` creates an upload session (mock or integration); `GET` reports active mode |
| `app/api/youtube/mock-upload/[sessionId]/route.ts` | Mock resumable-upload target implementing the `Content-Range`/308/200 protocol |
| `lib/youtube/constants.ts` | `CHANNEL_ALIAS`, upload-size cap, mock session TTL |
| `lib/youtube/validation.ts` | Server-side validation of the session-request body |
| `lib/youtube/mock-store.ts` | In-memory session map for mock mode |
| `lib/youtube/integration.ts` | Real Google OAuth refresh + resumable-initiation call — **the code path this repo exists to verify** |
| `lib/youtube/session.ts` | Picks mock vs. integration based on `YOUTUBE_UPLOAD_MODE` |
| `lib/youtube-client/upload-controller.ts` | Transport-agnostic resumable-upload loop + resume-by-probing logic |
| `lib/youtube-client/xhr-transport.ts` | The only browser-side module that touches the network |
| `lib/youtube-client/chunking.ts` | Pure helpers: chunk range/header formatting, retryability |
| `lib/rate-limit.ts` | Best-effort in-memory rate limiter on session creation (5 req/min/IP) |
| `components/youtube-upload-demo.tsx` | The upload UI: file picker, progress, cancel/retry, result |
| `.env.example` | Names of the integration-mode env vars (no values — never fill this in with real secrets) |
| `POC.md` | Full architecture, threat model, CORS/CSP notes, session/token expiration details |

## Prerequisites

- Node.js compatible with Next.js 16 / React 19 (Node 20+ recommended).
- npm (the repo ships `package-lock.json`).
- For integration-mode verification only: a Google Cloud OAuth client and a
  refresh token for a **test** Google/YouTube account — see below.

## Setup

```bash
npm ci
cp .env.example .env.local   # leave values blank to stay in mock mode
```

## Mock mode — run and verify

Mock mode is the default: `YOUTUBE_UPLOAD_MODE` unset (or anything other
than `"integration"`) means no credentials are required and **no request
ever reaches Google**.

```bash
npm run dev
# open http://localhost:3000/upload-poc
```

In the browser: pick any small video file, watch progress advance, and
confirm the UI labels the result "Mock · PoC" with an explicit note that the
returned id is not a real YouTube video.

To verify the mock protocol without a browser:

```bash
# 1. Create a session
curl -s -X POST http://localhost:3000/api/youtube/upload-session \
  -H "Content-Type: application/json" \
  -d '{"fileName":"clip.mp4","fileSizeBytes":10,"mimeType":"video/mp4","title":"clip.mp4"}'
# → { "mode": "mock", "uploadUrl": ".../api/youtube/mock-upload/<id>", ... }

# 2. Send the 10 bytes in two chunks, using the uploadUrl from step 1
curl -s -X PUT "<uploadUrl>" -H "Content-Range: bytes 0-4/10" --data-binary "AAAAA" -i
# → HTTP/1.1 308, Range: bytes=0-4

curl -s -X PUT "<uploadUrl>" -H "Content-Range: bytes 5-9/10" --data-binary "BBBBB" -i
# → HTTP/1.1 200, { "id": "mock-xxxxxxxx", ... }
```

## Integration mode — environment and credentials

Integration mode makes real calls to Google's OAuth token endpoint and the
YouTube Data API v3. Set these in `.env.local` (never commit this file — it
is already in `.gitignore`):

| Env var | Purpose |
| --- | --- |
| `YOUTUBE_UPLOAD_MODE=integration` | Switches the session route off mock mode |
| `YOUTUBE_CLIENT_ID` | OAuth client id for an app registered in Google Cloud |
| `YOUTUBE_CLIENT_SECRET` | OAuth client secret — server-only, never sent to the browser |
| `YOUTUBE_REFRESH_TOKEN` | Long-lived refresh token for the account that owns the target channel |

**Obtaining test credentials safely:**

- Use a **dedicated test Google account / test YouTube channel**, not a
  production or personal channel. A leaked or misused refresh token in this
  flow can create or corrupt uploads on whatever channel it authorizes.
- Register an OAuth client (type: Desktop app or Web, per your team's Google
  Cloud project conventions) with the YouTube Data API v3 enabled, and
  generate a refresh token via the standard OAuth consent flow for that
  client, scoped to `https://www.googleapis.com/auth/youtube.upload`.
- **Never commit secrets.** `.env.local` is git-ignored; keep it that way.
  Do not paste client secrets or refresh tokens into commit messages, PR
  descriptions, issue trackers, or this file.
- **Prefer unlisted test uploads.** The code already requests
  `status.privacyStatus: "unlisted"` for every upload (see
  `lib/youtube/integration.ts`) — do not change this to `public` while
  testing. Delete or leave-unlisted any test videos created during
  verification; they are real, persistent YouTube uploads.

## Request flow and security boundary

```
Browser ──POST fileName/size/mime──▶ /api/youtube/upload-session (this server)
                                        - integration mode: refreshes OAuth token
                                          server-side, POSTs resumable-initiation
                                          request to YouTube
        ◀── { mode, uploadUrl, sessionId, expiresAt, channelAlias } ──
                                        (no token, no channel identity)

Browser ──PUT video bytes, chunk by chunk, directly to uploadUrl──▶ googleapis.com
        ◀── 308 (continue) or 200 (Video resource with video id) ──
```

The server is only in the loop for session creation. The actual bytes flow
directly from the browser to whichever host `uploadUrl` points at — this
server never sees or buffers them.

**Security boundary:** `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, and
`YOUTUBE_REFRESH_TOKEN` are read only inside `lib/youtube/integration.ts`
(`import "server-only"`) and the OAuth access token derived from them is
used once, in-process, then discarded — none of the three ever reach the
browser. The browser does, necessarily, see the resulting `uploadUrl` (it's
a plain network request, visible in DevTools) — that is by design in a
direct-upload architecture. A leaked `uploadUrl` in integration mode is
scoped to one reserved upload slot; it does not grant the account's OAuth
token, channel access, or access to other videos. See "Threat model" in
`POC.md` for the full argument.

## Manual integration verification checklist

1. Set the three env vars in `.env.local` with test-account credentials.
2. `npm run dev`, open `http://localhost:3000/upload-poc`.
3. Confirm the UI mode banner reads something other than "Mock · PoC" (check
   `GET /api/youtube/upload-session` reports `"integration"`).
4. Upload a small real video file end-to-end.

   **Expected outcome:** upload completes, response contains a real YouTube
   video id, and the video appears on the test channel's Studio dashboard as
   **unlisted**.

5. Reload mid-upload (or use dev tools to throttle/interrupt the network)
   and confirm the client resumes via a `Content-Range: bytes */<total>`
   probe rather than restarting from byte 0.
6. Check the browser's Network tab: confirm no request ever carries
   `YOUTUBE_CLIENT_SECRET` or `YOUTUBE_REFRESH_TOKEN`, and that the only
   YouTube-related URL visible client-side is the resumable `uploadUrl`.

**Failure diagnostics:**

- `401`/`403` from the token-refresh step → refresh token revoked/expired,
  wrong client id/secret pairing, or the OAuth scope doesn't include
  `youtube.upload`.
- `CORS` error in the browser console on the `PUT` to `googleapis.com` →
  see "CORS / CSP limitations" in `POC.md`; if a `Content-Security-Policy`
  header exists anywhere in front of this app, its `connect-src` must allow
  the googleapis upload host.
- `404`/expired-session error from Google mid-upload → resumable session
  URLs are not documented as permanent; this app's `expiresAt` is only a
  conservative one-hour estimate, not authoritative (see "Known
  limitations").
- Session-creation requests silently stop succeeding → the in-memory rate
  limiter (`lib/rate-limit.ts`, 5 req/min/IP) may be triggering; restart the
  dev server to reset it.

**Cleanup after verification:**

- Delete or leave-unlisted any test videos created on the test channel.
- Do not leave real credentials in `.env.local` on a shared machine; remove
  them or revoke the refresh token when done if the environment is not
  yours alone.

## Commands

```bash
npm ci             # install exact locked dependencies
npm run typecheck  # tsc --noEmit
npm run build      # next build (also exercises route/page compilation)
npm run dev        # local dev server at http://localhost:3000
```

## Known limitations

- **Live integration has not been verified in this environment.** The code
  in `lib/youtube/integration.ts` matches Google's published YouTube Data
  API v3 resumable-upload contract, but no test credentials were available
  when it was written, so it has never actually run against a live channel
  or a real OAuth token. Verifying it is the primary reason this repo is
  being handed to another team.
- **Mock sessions are in-memory only** (`lib/youtube/mock-store.ts`): they
  reset on restart/redeploy and are not shared across instances/processes.
- **No automated test runner** is configured in `package.json`; there is no
  `npm test` script. Verification relies on `npm run typecheck`, `npm run
  build`, and the manual steps above.
- **No automatic retry/backoff.** The client offers a manual "Retry" button
  in the UI only; production use would likely want automatic retry with
  backoff for `5xx`/network errors during chunk upload.
- **`expiresAt` for real Google sessions is an estimate, not a guarantee.**
  Google does not publicly document an exact resumable-session lifetime
  (informally reported as up to about a week); this app surfaces a
  conservative one-hour estimate purely so the UI can warn proactively — the
  actual cutoff is whatever Google enforces at `PUT` time, independent of
  this guess.
