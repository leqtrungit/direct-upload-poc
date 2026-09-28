import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootShell } from "@/components/root-shell";
import { baseMetadata, siteViewport } from "@/lib/seo";

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "Harnix — Harness every run.",
    template: "%s — Harnix",
  },
};

export const viewport = siteViewport;

export default function EnRootLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
