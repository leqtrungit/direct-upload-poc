import { SkipLink } from "@/components/skip-link";
import { YoutubeUploadDemo } from "@/components/youtube-upload-demo";

/** The one route this app serves — see POC.md for the full write-up. */
export function UploadPocPage() {
  return (
    <>
      <SkipLink />
      <main id="top" className="mx-auto max-w-[1160px] px-6">
        <div className="pt-[72px] pb-20">
          <YoutubeUploadDemo />
        </div>
      </main>
    </>
  );
}
