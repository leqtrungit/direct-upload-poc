# YouTube direct-from-client upload — PoC

Proof of concept: an end user sees only a branded channel alias, **"Kênh A"**,
picks a video file, and the browser streams the bytes straight to a YouTube
resumable-upload session. The video never touches this server's filesystem,
and the real YouTube account/channel credentials never leave the server.

Try it at `/upload-poc` (`npm run dev`, then open
`http://localhost:3000/upload-poc`). The route is intentionally not linked
from the main nav and is marked `noindex` — it is a demo surface, not a
shipped product page.

## Architecture

```
Browser                          This server (Next.js route handlers)         YouTube / mock target
───────                          ──────────────────────────────────           ─────────────────────
1. POST fileName/size/mime  ───▶ /api/youtube/upload-session
                                  - rate limit, validate input
                                  - mock mode: creates an in-memory session
                                  - integration mode: refreshes an OAuth
                                    token server-side, POSTs the resumable
                                    initiation request to YouTube
                             ◀─── { mode, uploadUrl, sessionId, expiresAt,
                                    channelAlias: "Kênh A" }
                                    (no token, no channel identity — just a
                                    single-purpose URL)

2. PUT video bytes directly ───────────────────────────────────────────▶  mock: /api/youtube/mock-upload/:id
   to `uploadUrl`, chunk by                                               (this server, but bytes are only
   chunk, with progress events                                            counted, never buffered/written)
                                                                            integration: YouTube's own
                                                                            googleapis.com upload host
                             ◀──────────────────────────────────────────  308 (continue) or 200 (Video
                                                                            resource, with the video id)
```

The server is only ever in the loop for step 1 (issuing a session). Step 2 —
the actual bytes — flows directly from the browser to whichever host the
`uploadUrl` points at. This server's own `mock-upload` route reads that
stream only to count bytes (`drainBody` in
`app/api/youtube/mock-upload/[sessionId]/route.ts`); it never buffers or
writes them to disk, so the "video never touches this server's filesystem"
guarantee holds in mock mode too, not just in the real-YouTube case where the
bytes physically go to a different host.

## Code map

| File | Role |
| --- | --- |
| `lib/youtube/constants.ts` | `CHANNEL_ALIAS` ("Kênh A"), PoC upload-size cap, mock session TTL |
| `lib/youtube/validation.ts` | Server-side re-validation of the session-request body |
| `lib/youtube/mock-store.ts` | In-memory session map for mock mode (see caveats below) |
| `lib/youtube/integration.ts` | Real Google OAuth refresh + resumable-initiation call (integration mode only) |
| `lib/youtube/session.ts` | Picks mock vs. integration based on `YOUTUBE_UPLOAD_MODE` |
| `app/api/youtube/upload-session/route.ts` | `POST` creates a session; `GET` reports the active mode for the UI banner |
| `app/api/youtube/mock-upload/[sessionId]/route.ts` | Mock resumable-upload target: implements the `Content-Range`/308/200 protocol |
| `lib/youtube-client/chunking.ts` | Pure helpers: chunk range/header formatting, retryability |
| `lib/youtube-client/upload-controller.ts` | Transport-agnostic resumable-upload loop + resume-by-probing logic |
| `lib/youtube-client/xhr-transport.ts` | `XMLHttpRequest`-based transport (only place that touches the network from the browser) |
| `components/youtube-upload-demo.tsx` | The UI: file picker, "Kênh A" branding, progress, cancel/retry, result |

## Mock mode (default)

`YOUTUBE_UPLOAD_MODE` unset or anything other than `"integration"` → mock
mode. No real credentials are required and no request ever reaches Google.

- `POST /api/youtube/upload-session` creates a session in
  `lib/youtube/mock-store.ts` (an in-memory `Map`, keyed by a random UUID) and
  returns `uploadUrl: <origin>/api/youtube/mock-upload/<sessionId>`.
- The browser then drives `PUT` requests at that same-origin URL exactly as it
  would against a real YouTube resumable session: each chunk carries a
  `Content-Range: bytes <start>-<end>/<total>` header; the route responds
  `308` with a `Range: bytes=0-<received-1>` header while incomplete, or `200`
  with a small JSON body (`{ id: "mock-xxxxxxxx", ... }`) once the byte count
  reaches the declared total. A `Content-Range: bytes */<total>` probe (empty
  body) asks "how much do you have?" without sending data — used to resume
  after an error or a reload.
- Sessions expire after 15 minutes (`MOCK_SESSION_TTL_MS`) and are purged
  lazily; an expired or unknown session id returns `404`.
- **Caveats, stated plainly:** the store is a single process's memory. It
  resets on restart/redeploy and is not shared across instances — fine for a
  demo, not a real persistence layer. The returned "video id" and JSON body
  are fabrications; nothing is ever published anywhere. The UI always labels
  this "Mock · PoC" and, on completion, explicitly states the id is not a
  real YouTube video.

## Integration mode contract

Set `YOUTUBE_UPLOAD_MODE=integration` plus the three env vars below to make
`createIntegrationSession` (`lib/youtube/integration.ts`) issue the real
request. **No secrets are included in this repo** — these are the variable
names the code reads, not values:

| Env var | Purpose |
| --- | --- |
| `YOUTUBE_UPLOAD_MODE=integration` | Switches the session route off mock mode |
| `YOUTUBE_CLIENT_ID` | OAuth client id for the app registered in Google Cloud |
| `YOUTUBE_CLIENT_SECRET` | OAuth client secret — server-only, never sent to the browser |
| `YOUTUBE_REFRESH_TOKEN` | Long-lived refresh token for the account that owns the real channel |

Server-side flow, exactly as implemented:

1. **Token refresh** — `POST https://oauth2.googleapis.com/token` with
   `client_id`, `client_secret`, `refresh_token`, `grant_type=refresh_token`
   as a form body. Yields a short-lived `access_token`, used once and
   discarded (never persisted, never returned to the client).
2. **Resumable initiation** —
   ```
   POST https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status
   Authorization: Bearer <access_token>
   Content-Type: application/json; charset=UTF-8
   X-Upload-Content-Type: <video mime type>
   X-Upload-Content-Length: <file size in bytes>

   { "snippet": { "title": "<file name>", "description": "Uploaded via direct-upload PoC" },
     "status": { "privacyStatus": "unlisted" } }
   ```
3. The response's `Location` header **is** the resumable upload URL. That
   exact URL — nothing else — is what gets returned to the browser as
   `uploadUrl`. From then on the browser talks to
   `googleapis.com` directly with the same `PUT`/`Content-Range`/308 protocol
   described above for mock mode; the client code
   (`lib/youtube-client/upload-controller.ts`) is identical for both modes,
   since it only ever knows a URL, not which mode issued it.

### Verification boundary — read this before trusting integration mode

**Only mock mode has been exercised in this environment.** The integration
code path is written to match Google's published YouTube Data API v3
resumable-upload contract, but there are no test credentials available here,
so it has never actually been run against a live channel or a real OAuth
token. Treat it as "implemented per spec, unverified," not "known working."
Before relying on it: obtain real credentials, set the three env vars above,
and confirm end-to-end with a real (ideally `unlisted`) test upload — do not
assume this PoC's code guarantees a working production integration.

## Threat model — why the real channel stays hidden

- The browser only ever receives: a `mode` string, a `sessionId`, an
  `expiresAt` timestamp, `channelAlias` ("Kênh A"), and the `uploadUrl`
  itself. It never receives `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`,
  `YOUTUBE_REFRESH_TOKEN`, or the OAuth access token minted from them — those
  three env vars are read only inside `lib/youtube/integration.ts`, a
  server-only module (`import "server-only"`), and the access token is used
  once, in-process, then discarded.
- **The browser can, and will, see the `uploadUrl`** — it's a plain HTTP
  request in DevTools' Network tab, same as any other fetch. This is
  intentional and unavoidable in a direct-upload architecture; the design
  goal is not to hide the URL, only the *credential that authorized it*.
- **Blast radius of a leaked `uploadUrl`:** in mock mode, essentially none —
  it points at this app's own in-memory demo record. In integration mode, a
  real Google resumable session URL is scoped to one reserved video upload
  slot; per Google's resumable-upload design, possessing the URL lets someone
  complete or corrupt *that one upload* until it expires — it is not
  equivalent to holding the account's OAuth token and does not grant access
  to the channel, other videos, or account settings.
- **What "Kênh A" hides:** the real channel name/handle is never rendered,
  requested, or embedded anywhere in client-visible responses. An end user
  (or anyone reading network traffic from the browser side) cannot recover
  which real YouTube account is receiving the upload from anything this PoC
  sends them.

## CORS / CSP limitations

- **Mock mode** is same-origin (`<this app>/api/youtube/mock-upload/...`), so
  no CORS configuration is needed and nothing here depends on Google's CORS
  policy.
- **Integration mode** requires the browser to `PUT` cross-origin to
  `*.googleapis.com`. Google's documentation states its resumable upload
  endpoints support direct browser uploads, which implies the necessary CORS
  response headers on their side — but that has not been independently
  confirmed against a live session in this environment (see the verification
  boundary above), so don't treat it as guaranteed until checked with real
  credentials.
- **CSP:** this app does not currently set a `Content-Security-Policy`
  header. If one is added later, its `connect-src` directive must explicitly
  allow the googleapis upload host (and any redirect target Google uses) or
  the browser will block the `PUT` requests client-side even if Google's CORS
  headers would otherwise permit them — a self-inflicted failure mode worth
  testing for before shipping a CSP alongside integration mode.

## Session / token expiration

- **Mock sessions** expire 15 minutes after creation
  (`MOCK_SESSION_TTL_MS` in `lib/youtube/constants.ts`), enforced server-side
  by `getMockSession` refusing (and deleting) anything past its `expiresAt`.
  This is deliberately short, to force the mock path to exercise the same
  "session can go stale" handling a real integration needs, rather than
  quietly relying on a session that in practice rarely expires.
- **Real Google resumable session URLs** do not have a publicly documented
  exact lifetime (informally reported as up to about a week). This code
  surfaces a conservative one-hour `expiresAt` estimate purely so the client
  *could* warn a user proactively — the actual cutoff is whatever Google's
  servers enforce at PUT time, independent of our estimate, and a PUT can
  still fail with an expired-session error from Google before or after our
  guess.
- **OAuth tokens:** the refresh token and client secret are never
  time-limited from this app's perspective (they're long-lived credentials by
  design) but are also never sent anywhere except Google's token endpoint,
  server-side, once per session creation.

## Rate limiting

`POST /api/youtube/upload-session` is guarded by the best-effort limiter in
`lib/rate-limit.ts` (5 requests/minute per first-hop IP, in-memory, resets on
restart). It blunts a naive retry loop; it is not a defense against a
distributed sender.

## Testing status

**No automated tests were added.** This project has no test runner
(`vitest`/`jest`/etc.) in `package.json`'s dependencies, and this environment
does not permit installing new packages, so adding one was not possible
without leaving a `npm test` script that fails on a clean checkout. Rather
than do that, no `test` script was added.

What *was* verified in this environment: `npm run typecheck` and `npm run
build` (see the command output reported alongside this PR/change). Both
exercise every new file's types and the full route/page build, including the
dynamic `app/api/youtube/mock-upload/[sessionId]/route.ts` handler.

To manually verify the mock upload protocol end-to-end without a browser:

```bash
# 1. Create a session (mock mode is the default)
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

If adding a test runner later, the natural first targets are pure functions
that need no server context: `lib/youtube/validation.ts`
(`validateUploadSessionRequest`), `lib/youtube-client/chunking.ts`
(`parseRangeHeader`, `isRetryableStatus`), and
`lib/youtube-client/upload-controller.ts`'s `runResumableUpload` driven by a
fake injected `sendChunk` (it already takes the transport as a parameter for
exactly this reason).

## What this PoC intentionally does not do

- It does not implement resumable-upload retry/backoff beyond a manual
  "Retry" button in the UI — a production integration would likely want
  automatic retry with backoff for `5xx`/network errors.
- It does not persist mock sessions anywhere durable — restart the dev
  server and in-flight mock sessions are gone.
- It makes no claim that the integration code path has been run against a
  real YouTube channel. See "Verification boundary" above.
