import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootShell } from "@/components/root-shell";
import { baseMetadata, siteViewport } from "@/lib/seo";

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "Harnix — Giao việc cho AI. Nắm từng bước.",
    template: "%s — Harnix",
  },
};

export const viewport = siteViewport;

export default function ViRootLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="vi">{children}</RootShell>;
}
