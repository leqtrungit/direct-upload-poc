import type { ReactNode } from "react";

/** Segmented-control styling: the design's `seg(on)` helper. */
export function segClass(active: boolean) {
  return active ? "bg-surface3 text-text" : "bg-transparent text-text3";
}

/** Every section on the page shares the same rhythm. */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`pt-[72px] ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`m-0 font-display text-[clamp(24px,3.2vw,36px)] font-semibold leading-[1.15] tracking-[-0.025em] text-pretty ${className}`}
    >
      {children}
    </h2>
  );
}

export function MonoLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`font-mono text-[10px] uppercase tracking-[0.1em] text-text3 ${className}`}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-line bg-surface ${className}`}>
      {children}
    </div>
  );
}

/** Outline pill used for milestone / availability tags. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line2 px-[9px] py-[3px] font-mono text-[10px] uppercase tracking-[0.06em] text-text2">
      {children}
    </span>
  );
}

/** Status pill: a coloured dot plus a word, per the console's status system. */
export function StatusPill({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-[5px] rounded-full px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.06em]"
      style={{
        color,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: `color-mix(in oklab, ${color} 40%, transparent)`,
      }}
    >
      <span
        className="h-[5px] w-[5px] rounded-full"
        style={{ background: color }}
      />
      {children}
    </span>
  );
}
