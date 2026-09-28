"use client";

import { useCopy } from "@/components/providers";
import { MonoLabel } from "@/components/ui";
import { siteConfig } from "@/lib/config";

const HERO_TRACE: { time: string; label: string; highlight?: boolean }[] = [
  { time: "00.00s", label: "user_message" },
  { time: "00.14s", label: "tool_call knowledge_search" },
  { time: "00.61s", label: "tool_result · 3 chunks" },
  { time: "00.72s", label: "llm_call · gpt-4o-mini", highlight: true },
  { time: "02.38s", label: "token_usage · 1,240 tokens" },
];

function TokenTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-[11px]">
      <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text3">
        {label}
      </div>
      <div className="mt-[5px] font-mono text-base">{value}</div>
    </div>
  );
}

export function Hero() {
  const t = useCopy();

  return (
    <section className="pt-16">
      <div className="max-w-[760px]">
        <MonoLabel>{t("eyebrow")}</MonoLabel>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-accent-soft py-[5px] pr-3 pl-[10px] text-[13px] text-text">
          <span className="h-[7px] w-[7px] animate-pulse-dot rounded-full bg-accent" />
          <span>
            {t("statusPill")}
            {siteConfig.milestone}
          </span>
        </div>

        <h1 className="mt-5 mb-0 font-display text-[clamp(34px,5.4vw,56px)] leading-[1.04] font-semibold tracking-[-0.03em] text-pretty">
          {t("heroH1")}
        </h1>

        <p className="mt-5 max-w-[62ch] text-[17px] text-text2 text-pretty">
          {t("heroSub")}
        </p>

        <div className="mt-7 flex flex-wrap gap-[10px]">
          <a
            href="#waitlist"
            className="rounded-lg bg-accent px-5 py-3 text-[15px] font-semibold text-accent-ink no-underline"
          >
            {t("ctaJoin")}
          </a>
          <a
            href="#demo"
            className="rounded-lg border border-line2 px-5 py-3 text-[15px] font-semibold text-text no-underline hover:bg-surface2"
          >
            {t("ctaDemo")}
          </a>
        </div>
      </div>

      {/* Recreation of the console's trace viewer. Swap for a real capture. */}
      <figure
        className="mt-11 mb-0 overflow-hidden rounded-xl border border-line bg-surface"
        aria-label={t("heroFrameLabel")}
      >
        <div className="flex items-center gap-[10px] border-b border-line bg-surface2 px-3 py-[9px]">
          <div className="flex gap-[5px]" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-line2" />
            <span className="h-2 w-2 rounded-full bg-line2" />
            <span className="h-2 w-2 rounded-full bg-line2" />
          </div>
          <div className="font-mono text-[11.5px] text-text3">
            console.{siteConfig.domain} / runs / run_8c41f2
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))]">
          <div className="border-r border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-display text-[15px] font-semibold">
                Run trace
              </div>
              <span className="inline-flex items-center gap-[6px] rounded-full border border-[color-mix(in_oklab,var(--ok)_40%,transparent)] px-[9px] py-[3px] font-mono text-[10.5px] tracking-[0.06em] text-ok uppercase">
                <span className="h-[6px] w-[6px] rounded-full bg-ok" />
                completed
              </span>
            </div>

            <div className="mt-[14px] flex flex-col gap-[3px]">
              {HERO_TRACE.map((row) => (
                <div
                  key={row.label}
                  className={`flex items-baseline gap-[10px] rounded-lg border px-[10px] py-[9px] font-mono text-[11.5px] ${
                    row.highlight
                      ? "border-[color-mix(in_oklab,var(--accent)_38%,var(--line))] bg-accent-soft"
                      : "border-line bg-surface2"
                  }`}
                >
                  <span className="w-[42px] shrink-0 text-text3">{row.time}</span>
                  <span className="text-text">{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg p-4">
            <MonoLabel>Step detail</MonoLabel>
            <div className="mt-3 rounded-lg border border-line bg-surface p-3">
              <div className="font-mono text-[11.5px] text-text2">
                tool_result · knowledge_search
              </div>
              <div className="mt-[10px] text-sm text-text">
                {t("heroDocLine")}
              </div>
              <div className="mt-[6px] text-[13.5px] text-text2">
                {t("heroQuote")}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-[10px]">
              <TokenTile label="Tokens in" value="1,024" />
              <TokenTile label="Tokens out" value="216" />
            </div>

            <figcaption className="mt-3 text-[12.5px] text-text3">
              {t("sampleNote")}
            </figcaption>
          </div>
        </div>
      </figure>
    </section>
  );
}
