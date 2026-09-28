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
