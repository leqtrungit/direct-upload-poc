"use client";

import { useId, useState } from "react";
import { useCopy } from "@/components/providers";
import { Card, Section, SectionHeading, Tag, segClass } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { CODE_BACKEND, CODE_FRONTEND, type CopyKey } from "@/lib/copy";

const TABS: { label: CopyKey; code: string }[] = [
  { label: "tab1Label", code: CODE_BACKEND },
  { label: "tab2Label", code: CODE_FRONTEND },
];

const POINTS: CopyKey[] = ["d1", "d2", "d3"];

export function Developer() {
  const t = useCopy();
  const [active, setActive] = useState(0);
  const baseId = useId();

  return (
    <Section id="dev">
      <div className="flex flex-wrap items-center gap-[10px]">
        <SectionHeading>{t("devHead")}</SectionHeading>
        <Tag>{t("devBadge")}</Tag>
      </div>

      <div className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-start gap-4">
        <Card className="overflow-hidden">
          <div
            role="tablist"
            aria-label={t("devHead")}
            className="flex flex-wrap gap-[2px] border-b border-line bg-surface2 p-2"
          >
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={active === i}
                aria-controls={`${baseId}-panel-${i}`}
                onClick={() => setActive(i)}
                className={`cursor-pointer rounded-lg border-0 px-3 py-[7px] text-[13.5px] font-semibold ${segClass(active === i)}`}
              >
                {t(tab.label)}
              </button>
            ))}
          </div>

          <pre
            role="tabpanel"
            id={`${baseId}-panel-${active}`}
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
            className="m-0 overflow-x-auto bg-bg p-4 font-mono text-[11.5px] leading-[1.75] break-words whitespace-pre-wrap text-text2"
          >
            {TABS[active].code}
          </pre>

          <div className="border-t border-line px-4 py-[10px] text-[12.5px] text-text3">
            {t("codeCaption")}
          </div>
        </Card>

        <div className="flex flex-col gap-[10px]">
          {POINTS.map((key) => (
            <Card key={key} className="px-4 py-[14px] text-[14.5px]">
              {t(key)}
            </Card>
          ))}

          {siteConfig.docsUrl ? (
            <a href={siteConfig.docsUrl} className="link py-1 text-sm">
              {t("docsLink")}
            </a>
          ) : (
            <span
              aria-disabled="true"
              title={t("docsSoon")}
              className="cursor-not-allowed py-1 text-sm text-text3"
            >
              {t("docsLink")}
            </span>
          )}
        </div>
      </div>
    </Section>
  );
}
