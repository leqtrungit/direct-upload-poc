import type { ReactNode } from "react";

/** The route already picked the right-language MDX before compiling it, so this just lays it out. */
export function PostBody({ children }: { children: ReactNode }) {
  return <article className="mt-8">{children}</article>;
}
