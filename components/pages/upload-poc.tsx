import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SkipLink } from "@/components/skip-link";
import { YoutubeUploadDemo } from "@/components/sections/youtube-upload-demo";

/** Standalone PoC route — not linked from the main nav, kept out of search results (see the page's own metadata). */
export function UploadPocPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="top" className="mx-auto max-w-[1160px] px-6">
        <div className="pt-[72px] pb-20">
          <YoutubeUploadDemo />
        </div>
        <Footer />
      </main>
    </>
  );
}
