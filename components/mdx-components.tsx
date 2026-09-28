import type { JSX } from "react";

type Props<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];

/** Typography for a post body, built from the same tokens as the rest of the page. */
export const mdxComponents = {
  h2: (props: Props<"h2">) => (
    <h2
      className="mt-10 font-display text-[22px] font-semibold tracking-[-0.02em] text-text"
      {...props}
    />
  ),
  h3: (props: Props<"h3">) => (
    <h3
      className="mt-8 font-display text-[18px] font-semibold tracking-[-0.015em] text-text"
      {...props}
    />
  ),
  p: (props: Props<"p">) => (
    <p className="mt-4 text-[15.5px] leading-[1.7] text-text2" {...props} />
  ),
  ul: (props: Props<"ul">) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-5 text-[15.5px] leading-[1.7] text-text2"
      {...props}
    />
  ),
  ol: (props: Props<"ol">) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 text-[15.5px] leading-[1.7] text-text2"
      {...props}
    />
  ),
  li: (props: Props<"li">) => <li {...props} />,
  a: (props: Props<"a">) => <a className="link" {...props} />,
  strong: (props: Props<"strong">) => (
    <strong className="font-semibold text-text" {...props} />
  ),
  code: (props: Props<"code">) => (
    <code
      className="rounded bg-surface2 px-[5px] py-[2px] font-mono text-[13px] text-text"
      {...props}
    />
  ),
  blockquote: (props: Props<"blockquote">) => (
    <blockquote
      className="mt-4 border-l-2 border-line2 pl-4 text-[15.5px] italic text-text2"
      {...props}
    />
  ),
};
