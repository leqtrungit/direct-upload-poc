"use client";

import { useState } from "react";
import { ClockIcon, PlayIcon } from "@/components/icons";
import { useSite } from "@/components/providers";
import { Card, MonoLabel, Section, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { getChapters } from "@/lib/copy";

const isReady = siteConfig.demo.status === "ready";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Low-emphasis frame standing in for the console screenshot. */
function Poster({ opacity }: { opacity: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col bg-surface"
      style={{ opacity }}
    >
      <div className="h-[30px] border-b border-line bg-surface2" />
      <div className="grid flex-1 grid-cols-[34%_1fr]">
        <div className="flex flex-col gap-[9px] border-r border-line p-[14px]">
          {["70%", "55%", "62%", "48%"].map((w) => (
            <div
              key={w}
              className="h-[9px] rounded-[3px] bg-surface3"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-[10px] p-4">
          <div className="h-3 w-[38%] rounded-[3px] bg-surface3" />
          <div className="flex-1 rounded-lg border border-line bg-surface2" />
          <div className="flex-1 rounded-lg border border-line bg-surface2" />
        </div>
      </div>
    </div>
  );
}

export function Demo() {
  const { t, lang } = useSite();
  const chapters = getChapters(lang);
  const [playing, setPlaying] = useState(false);
  const { videoUrl, transcriptUrl, minutes } = siteConfig.demo;

  return (
    <Section id="demo">
      <SectionHeading>
        {t("demoHead").replace("{N}", String(minutes))}
      </SectionHeading>
      <p className="mt-3 mb-0 max-w-[60ch] text-base text-text2">
        {t("demoSub")}
      </p>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-start gap-4">
        <div className="relative grid aspect-video place-items-center overflow-hidden rounded-xl border border-line bg-surface2">
          {playing && videoUrl ? (
            <iframe
              src={videoUrl}
              title={t("demoHead").replace("{N}", String(minutes))}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <>
              <Poster opacity={isReady ? 0.55 : 0.35} />
              {isReady ? (
                <button
                  type="button"
                  aria-label={t("playLabel")}
                  onClick={() => setPlaying(true)}
                  className="relative grid h-16 w-16 cursor-pointer place-items-center rounded-full border-0 bg-accent text-accent-ink"
                >
                  <PlayIcon />
                </button>
              ) : (
                <div className="relative inline-flex items-center gap-2 rounded-full border border-line2 bg-surface px-[14px] py-2 text-sm text-text">
                  <ClockIcon size={15} />
                  <span>{t("demoSoonPill")}</span>
                </div>
              )}
            </>
          )}
        </div>

        <Card className="p-4">
          <MonoLabel>{t("labChapters")}</MonoLabel>

          <ol className="mt-3 flex list-none flex-col gap-[2px] p-0">
            {chapters.map((c, i) => (
              <li
                key={c.label}
                className={`flex items-baseline gap-[10px] rounded-lg px-[9px] py-2 ${
                  i % 2 ? "bg-surface2" : "bg-transparent"
                }`}
              >
                <span className="w-10 shrink-0 font-mono text-[11px] text-text3">
                  {isReady ? formatTime(c.at) : String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-sm text-text">{c.label}</span>
                <span className="shrink-0 font-mono text-[10px] text-text3">
                  {c.needs}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-[14px] flex flex-col gap-2">
            {isReady ? (
              transcriptUrl ? (
                <a href={transcriptUrl} className="link text-[13.5px]">
                  {t("transcriptLink")}
                </a>
              ) : null
            ) : (
              <a
                href="#waitlist"
                className="rounded-lg border border-line2 px-[14px] py-[10px] text-center text-sm font-semibold text-text no-underline hover:bg-surface2"
              >
                {t("notifyCta")}
              </a>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
}
