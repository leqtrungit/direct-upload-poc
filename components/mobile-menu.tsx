"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSite } from "@/components/providers";
import { LangToggle, ThemeToggle } from "@/components/toggles";
import type { CopyKey } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Keep in step with --breakpoint-nav in globals.css. */
const NAV_BREAKPOINT = "(min-width: 940px)";

export function MobileMenu({
  items,
}: {
  items: { href: string; key: CopyKey }[];
}) {
  const { t, lang } = useSite();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);

  // Close if the viewport grows past the breakpoint — otherwise the panel stays
  // open behind the desktop header, with the page scroll still locked.
  useEffect(() => {
    const mq = window.matchMedia(NAV_BREAKPOINT);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /** Dismiss and hand focus back to the bar, for items that navigate. */
  const follow = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const overlay = (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[color-mix(in_oklab,var(--bg)_72%,transparent)] backdrop-blur-[2px] transition-opacity duration-200 nav:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label={t("menuTitle")}
        inert={!open}
        className={`fixed top-0 right-0 z-50 flex h-dvh w-[min(86vw,360px)] flex-col border-l border-line bg-surface transition-transform duration-200 ease-out nav:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[63px] shrink-0 items-center justify-between border-b border-line pr-3 pl-5">
          <span className="font-mono text-[10px] tracking-[0.1em] text-text3 uppercase">
            {t("menuTitle")}
          </span>
          <button
            type="button"
            onClick={follow}
            aria-label={t("menuClose")}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-text2 hover:text-text"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-2">
          {items.map(({ href, key }) => (
            <a
              key={href}
              href={href}
              onClick={follow}
              className="flex min-h-12 items-center border-b border-line text-[17px] text-text no-underline last:border-b-0"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 flex-col gap-3 border-t border-line px-5 py-4">
          <div className="flex items-center justify-between">
            <LangToggle />
            <ThemeToggle size={38} />
          </div>
          <a
            href={localizeHref(lang, "/#waitlist")}
            onClick={follow}
            className="rounded-lg bg-accent px-4 py-3 text-center text-[15px] font-semibold text-accent-ink no-underline"
          >
            {t("ctaJoin")}
          </a>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? t("menuClose") : t("menuOpen")}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-line2 bg-transparent text-text nav:hidden"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
        </svg>
      </button>

      {/*
        Portalled to <body> deliberately. The header sets `backdrop-filter`,
        which makes it a containing block for fixed-position descendants — when
        rendered inside it, the scrim's `inset-0` covered only the 63px bar, so
        clicking outside the panel did nothing.
      */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
