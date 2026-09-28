type LogoProps = {
  /** Square size of the mark, in px. */
  markSize?: number;
  /** Type size of the wordmark, in px. */
  wordSize?: number;
  /** The accent square that sits in the tittle slot of the dotless ı. */
  dotSize?: number;
  dotRadius?: number;
  /** Optical gap between glyph groups in the wordmark. */
  gap?: number;
};

export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1.25"
        y="1.25"
        width="25.5"
        height="25.5"
        rx="7.5"
        stroke="var(--text)"
        strokeWidth="1.5"
      />
      <path
        d="M7 19.5 L11.5 19.5 L11.5 13 L16.5 13 L16.5 8.5 L20 8.5"
        stroke="var(--text)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="19.5" r="1.9" fill="var(--text)" />
      <rect x="17.6" y="6.1" width="4.8" height="4.8" rx="1.4" fill="var(--accent)" />
    </svg>
  );
}

/**
 * "harnıx" — the i is a dotless ı (U+0131) so the accent square can take the
 * tittle slot. The square is positioned from the glyph box, not the line box,
 * so it tracks the type size.
 */
export function Wordmark({
  wordSize = 20,
  dotSize = 4.5,
  dotRadius = 1.4,
  gap = 0,
}: Omit<LogoProps, "markSize">) {
  return (
    <>
      <span
        aria-hidden="true"
        className="flex items-baseline font-display font-semibold tracking-[-0.02em]"
        style={{ fontSize: wordSize, gap: gap || undefined }}
      >
        harn
        <span className="relative inline-block leading-none">
          ı
          <span
            className="absolute left-1/2 -translate-x-1/2 bg-accent"
            style={{
              top: "0.10em",
              width: dotSize,
              height: dotSize,
              borderRadius: dotRadius,
            }}
          />
        </span>
        x
      </span>
      <span className="sr-only">Harnix</span>
    </>
  );
}

export function Logo({
  markSize = 26,
  wordSize = 20,
  dotSize = 4.5,
  dotRadius = 1.4,
  gap = 0,
}: LogoProps) {
  return (
    <span className="flex items-center gap-[9px]">
      <LogoMark size={markSize} />
      <Wordmark
        wordSize={wordSize}
        dotSize={dotSize}
        dotRadius={dotRadius}
        gap={gap}
      />
    </span>
  );
}
