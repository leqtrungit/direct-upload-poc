"use client";

import { AlertTriangleIcon, LockIcon, TrendIcon } from "@/components/icons";
import { useCopy } from "@/components/providers";
import { Card, Section, SectionHeading } from "@/components/ui";
import type { CopyKey } from "@/lib/copy";

const WORRIES: {
  icon: typeof AlertTriangleIcon;
  title: CopyKey;
  body: CopyKey;
}[] = [
  { icon: AlertTriangleIcon, title: "w1t", body: "w1b" },
  { icon: TrendIcon, title: "w2t", body: "w2b" },
  { icon: LockIcon, title: "w3t", body: "w3b" },
];

export function Why() {
  const t = useCopy();

  return (
    <Section>
      <SectionHeading className="max-w-[24ch]">{t("worryHead")}</SectionHeading>

      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-[14px]">
        {WORRIES.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="p-5">
            <Icon size={20} stroke="var(--text3)" />
            <h3 className="mt-3 mb-0 font-display text-xl font-semibold tracking-[-0.015em]">
              {t(title)}
            </h3>
            <p className="mt-2 mb-0 text-[15px] text-text2">{t(body)}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
