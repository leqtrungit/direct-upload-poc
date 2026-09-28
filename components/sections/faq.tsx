"use client";

import { useId, useState } from "react";
import { useSite } from "@/components/providers";
import { Section, SectionHeading } from "@/components/ui";
import { getFaqs } from "@/lib/copy";

export function Faq() {
  const { t, lang } = useSite();
  const [open, setOpen] = useState(0);
  const baseId = useId();
  const faqs = getFaqs(lang);

  return (
    <Section id="faq">
      <SectionHeading>{t("faqHead")}</SectionHeading>

      <div className="mt-6 max-w-[820px] overflow-hidden rounded-xl border border-line bg-surface">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-line last:border-b-0">
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${baseId}-answer-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-[18px] py-4 text-left font-display text-base font-semibold text-text"
                >
                  <span className="flex-1">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-sm text-text3"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              {/*
                Always rendered, hidden when collapsed. Two reasons: the
                FAQPage markup in <StructuredData /> claims these answers are
                on the page, and `aria-controls` above has to point at an
                element that actually exists.
              */}
              <div
                id={`${baseId}-answer-${i}`}
                hidden={!isOpen}
                className="max-w-[65ch] px-[18px] pb-[18px] text-[15px] text-text2"
              >
                {item.a}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
