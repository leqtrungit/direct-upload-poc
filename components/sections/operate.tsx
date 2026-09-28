"use client";

import { OpIconGlyph } from "@/components/icons";
import { useSite } from "@/components/providers";
import { Section, SectionHeading } from "@/components/ui";
import { getOpItems } from "@/lib/copy";

export function Operate() {
  const { t, lang } = useSite();
  const opItems = getOpItems(lang);

  return (
    <Section>
      <SectionHeading>{t("opHead")}</SectionHeading>

      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-[14px]">
        {opItems.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line2 text-text2">
              <OpIconGlyph name={item.icon} />
            </div>
            <div className="min-w-0">
              <div className="font-display text-[15px] font-semibold">
                {item.title}
              </div>
              <div className="mt-1 text-sm text-text2">{item.body}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
