"use client";

import { useCopy } from "@/components/providers";

export function BlogIndexHeader() {
  const t = useCopy();

  return (
    <header className="pt-16 pb-2">
      <h1 className="m-0 font-display text-[clamp(28px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em] text-pretty">
        {t("blogIndexTitle")}
      </h1>
      <p className="mt-3 max-w-[60ch] text-base text-text2">
        {t("blogIndexSub")}
      </p>
    </header>
  );
}
