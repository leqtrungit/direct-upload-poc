"use client";

import { useSite } from "@/components/providers";
import { Section, SectionHeading, StatusPill } from "@/components/ui";
import { getTraceSteps, type TraceKind } from "@/lib/copy";

const KIND_COLOR: Record<TraceKind, string> = {
  ok: "var(--ok)",
  info: "var(--info)",
  warn: "var(--warn)",
  err: "var(--err)",
};

export function RunAnatomy() {
  const { t, lang } = useSite();
  const traceSteps = getTraceSteps(lang);

  return (
    <Section>
      <SectionHeading>{t("anatomyHead")}</SectionHeading>
      <p className="mt-3 mb-0 max-w-[60ch] text-base text-text2">
        {t("anatomySub")}
      </p>
      <div className="mt-2 font-mono text-[11px] text-text3">
        {t("sampleNote")}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
        {traceSteps.map((row, i) => (
          <div
            key={row.step}
            className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] border-b border-line"
          >
            <div
              className={`flex flex-wrap items-center gap-[10px] border-r border-line px-4 py-[14px] ${
                i % 2 ? "bg-surface2" : "bg-surface"
              }`}
            >
              <span className="shrink-0 font-mono text-[11.5px] text-text3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[11.5px] text-text">
                {row.step}
              </span>
              <StatusPill color={KIND_COLOR[row.kind]}>{row.state}</StatusPill>
            </div>
            <div className="bg-bg px-4 py-[14px] text-[14.5px] text-text2">
              {row.note}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
