"use client";

import { useCopy } from "@/components/providers";

export function SkipLink() {
  const t = useCopy();

  return (
    <a
      href="#top"
      className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100"
    >
      {t("skipToContent")}
    </a>
  );
}
