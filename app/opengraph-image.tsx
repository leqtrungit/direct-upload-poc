import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Harnix — Giao việc cho AI. Nắm từng bước.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dark-only, per the design. Tokens are inlined because satori has no CSS vars. */
const INK = "#f2f2f3";
const MUTED = "#90909a";
const BG = "#0c0c0d";
const ACCENT = "#34c799";

const PAD = Math.round(size.width * 0.065);

async function font(file: string) {
  return readFile(path.join(process.cwd(), "assets", "fonts", file));
}

export default async function OpengraphImage() {
  const [display, mono] = await Promise.all([
    font("SpaceGrotesk.ttf"),
    font("JetBrainsMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          color: INK,
          padding: PAD,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Space Grotesk",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 28 28" fill="none">
            <rect
              x="1.25"
              y="1.25"
              width="25.5"
              height="25.5"
              rx="7.5"
              stroke={INK}
              strokeWidth="1.5"
            />
            <path
              d="M7 19.5 L11.5 19.5 L11.5 13 L16.5 13 L16.5 8.5 L20 8.5"
              stroke={INK}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="7" cy="19.5" r="1.9" fill={INK} />
            <rect x="17.6" y="6.1" width="4.8" height="4.8" rx="1.4" fill={ACCENT} />
          </svg>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 42,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            harn
            <div style={{ display: "flex", position: "relative" }}>
              ı
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 9,
                  height: 9,
                  borderRadius: 3,
                  background: ACCENT,
                }}
              />
            </div>
            x
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          <span>Giao việc cho AI.</span>
          <span>Nắm từng bước.</span>
        </div>

        <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 26, color: MUTED }}>
          token_usage · 1,240 tokens · run_8c41f2 · completed
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: display, style: "normal", weight: 600 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
