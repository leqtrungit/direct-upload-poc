"use client";

import { useCopy } from "@/components/providers";
import { Card, MonoLabel, Section, SectionHeading, Tag } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import type { CopyKey } from "@/lib/copy";

/** Milestone codes pass through; the availability token is translated. */
function resolveTag(tag: string, t: (key: CopyKey) => string) {
  return tag === "available" ? t("tagAvailable") : tag;
}

const STEPS: { title: CopyKey; body: CopyKey }[] = [
  { title: "s1t", body: "s1b" },
  { title: "s2t", body: "s2b" },
  { title: "s3t", body: "s3b" },
];

export function HowItWorks() {
  const t = useCopy();

  return (
    <Section id="how">
      <MonoLabel>{t("labHow")}</MonoLabel>
      <SectionHeading className="mt-3 max-w-[26ch]">
        {t("howHead")}
      </SectionHeading>

      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-[14px]">
        {STEPS.map(({ title, body }, i) => (
          <Card key={title} className="flex flex-col gap-[10px] p-5">
            <div className="flex items-center justify-between gap-[10px]">
              <span className="font-mono text-[11.5px] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Tag>{resolveTag(siteConfig.stepTags[i], t)}</Tag>
            </div>
            <h3 className="m-0 font-display text-xl font-semibold tracking-[-0.015em]">
              {t(title)}
            </h3>
            <p className="m-0 text-[15px] text-text2">{t(body)}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
