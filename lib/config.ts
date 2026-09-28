/**
 * The knobs the design exposed as editable props. They are configuration, not
 * state — flip them with env vars at build time rather than in the UI.
 */

export type DemoStatus = "coming-soon" | "ready";

/**
 * Reads an env var, treating blank values as unset.
 *
 * Deployment platforms hand back empty strings for variables that exist but
 * were never filled in — Vercel seeds them from `.env.example` on import — and
 * `??` does not catch those, so every default below has to go through here.
 */
function env(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function withScheme(host: string | undefined): string | undefined {
  return host ? `https://${host}` : undefined;
}

/**
 * Falls back to the deployment's own origin, then to the canonical domain.
 * Only read on the server (metadata); the Vercel host vars are not public.
 */
function resolveSiteUrl(): string {
  const candidates = [
    env(process.env.NEXT_PUBLIC_SITE_URL),
    withScheme(env(process.env.VERCEL_PROJECT_PRODUCTION_URL)),
    withScheme(env(process.env.VERCEL_URL)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return new URL(candidate).toString().replace(/\/$/, "");
    } catch {
      // Malformed value — try the next candidate rather than failing the build.
    }
  }

  return "https://harnix.vn";
}

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(env(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const demoStatus: DemoStatus =
  env(process.env.NEXT_PUBLIC_DEMO_STATUS) === "ready" ? "ready" : "coming-soon";

export const siteConfig = {
  name: "Harnix",
  domain: "harnix.vn",
  url: resolveSiteUrl(),
  email: "hello@harnix.vn",

  /** Shown in the hero status pill: "Đang xây dựng · M1". */
  milestone: env(process.env.NEXT_PUBLIC_MILESTONE) ?? "M1",

  /**
   * Availability tags on the three "how it works" steps. The literal
   * `available` resolves to translated copy; anything else renders verbatim,
   * which is what milestone codes like "M2" want.
   */
  stepTags: ["available", "available", "M2"] as const,

  demo: {
    status: demoStatus,
    /** Runtime claim in the demo heading — "Xem cả quy trình trong {N} phút". */
    minutes: positiveInt(process.env.NEXT_PUBLIC_DEMO_MINUTES, 3),
    /** Only used once `status` is "ready". */
    videoUrl: env(process.env.NEXT_PUBLIC_DEMO_VIDEO_URL) ?? "",
    transcriptUrl: env(process.env.NEXT_PUBLIC_DEMO_TRANSCRIPT_URL) ?? "",
  },

  social: {
    linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN_URL) ?? "",
    facebook: env(process.env.NEXT_PUBLIC_FACEBOOK_URL) ?? "",
    github: env(process.env.NEXT_PUBLIC_GITHUB_URL) ?? "",
  },

  /** Integration docs are not written yet — the link stays inert until they are. */
  docsUrl: env(process.env.NEXT_PUBLIC_DOCS_URL) ?? "",
} as const;
