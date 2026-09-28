import type { OpIcon } from "@/lib/copy";

const OP_PATHS: Record<OpIcon, string[]> = {
  eye: [
    "M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z",
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  ],
  stop: ["M6 6h12v12H6z"],
  coin: [
    "M12 3v18",
    "M17 7.5c0-1.7-2.2-2.5-5-2.5s-5 .8-5 2.5S9.2 10 12 10s5 .8 5 2.5-2.2 2.5-5 2.5-5-.8-5-2.5",
  ],
  plug: ["M9 2v6M15 2v6", "M7 8h10v4a5 5 0 0 1-10 0V8Z", "M12 17v5"],
  shield: ["M12 3l8 3v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3Z"],
  check: ["M20 6 9 17l-5-5"],
};

type SvgProps = {
  size?: number;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
};

function Svg({
  size = 16,
  className,
  stroke = "currentColor",
  strokeWidth = 1.8,
  children,
}: SvgProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function OpIconGlyph({ name, size = 17 }: { name: OpIcon; size?: number }) {
  return (
    <Svg size={size} strokeWidth={1.7}>
      {OP_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </Svg>
  );
}

export function AlertTriangleIcon(props: SvgProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.7}>
      <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </Svg>
  );
}

export function TrendIcon(props: SvgProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.7}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 8h6v6" />
    </Svg>
  );
}

export function LockIcon(props: SvgProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.7}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Svg>
  );
}

export function ClockIcon(props: SvgProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function AlertCircleIcon(props: SvgProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </Svg>
  );
}

export function CheckIcon(props: SvgProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 2}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

export function SunIcon(props: SvgProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </Svg>
  );
}

export function MoonIcon(props: SvgProps) {
  return (
    <Svg {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </Svg>
  );
}

export function PlayIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export function SpinnerIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      className="animate-spin-slow"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </svg>
  );
}
