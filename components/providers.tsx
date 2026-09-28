"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translate, type CopyKey, type Lang } from "@/lib/copy";
import { THEME_STORAGE_KEY } from "@/lib/storage";

export type Theme = "dark" | "light";

type SiteContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  lang: Lang;
  t: (key: CopyKey) => string;
};

const SiteContext = createContext<SiteContextValue | null>(null);

/**
 * `lang` comes from the root layout that rendered this tree (one per locale
 * route, see `components/root-shell.tsx`) and never changes client-side —
 * switching language is a real navigation to the other locale's URL, so the
 * server always renders the right language on first paint. Theme is the only
 * thing that is genuinely client state: the inline bootstrap script in <head>
 * applies the visitor's stored choice before paint, and we read it back here
 * on mount rather than guessing during render, which keeps hydration clean.
 */
export function SiteProviders({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    if (document.documentElement.dataset.theme === "light") setThemeState("light");
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage — the choice just won't persist.
    }
  }, []);

  const value = useMemo<SiteContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
      lang,
      t: (key: CopyKey) => translate(lang, key),
    }),
    [theme, setTheme, lang],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProviders>");
  return ctx;
}

/** Shorthand for the common case: `const t = useCopy();` */
export function useCopy() {
  return useSite().t;
}
