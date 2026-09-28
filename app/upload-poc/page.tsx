import type { Metadata } from "next";
import { UploadPocPage } from "@/components/upload-poc";

export const metadata: Metadata = {
  title: "Tải video lên YouTube — PoC",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <UploadPocPage />;
}
