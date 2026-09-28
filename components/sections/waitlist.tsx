"use client";

import { useId, useState, type FormEvent } from "react";
import { useCopy } from "@/components/providers";
import { Section } from "@/components/ui";
import type { CopyKey } from "@/lib/copy";
import { isValidEmail } from "@/lib/validation";

type WaitState = "idle" | "invalid" | "sending" | "ok" | "error";

const MESSAGE: Record<WaitState, { key: CopyKey; color: string }> = {
  idle: { key: "waitIdle", color: "var(--text3)" },
  invalid: { key: "waitBad", color: "var(--err)" },
  sending: { key: "waitSending", color: "var(--text3)" },
  ok: { key: "waitOk", color: "var(--accent)" },
  error: { key: "waitError", color: "var(--err)" },
};

export function Waitlist() {
  const t = useCopy();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<WaitState>("idle");
  const messageId = useId();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    if (!isValidEmail(email)) {
      setState("invalid");
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("ok");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  const message = MESSAGE[state];

  return (
    <Section id="waitlist">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-line bg-surface p-8">
        <h2 className="m-0 max-w-[24ch] font-display text-[clamp(22px,2.6vw,30px)] leading-[1.15] font-semibold tracking-[-0.025em] text-pretty">
          {t("finalHead")}
        </h2>

        <form
          noValidate
          onSubmit={onSubmit}
          className="flex max-w-[420px] flex-1 basis-[300px] flex-col gap-2"
        >
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor={`${messageId}-email`}>
              {t("fEmail")}
            </label>
            <input
              id={`${messageId}-email`}
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setState("idle");
              }}
              placeholder={t("emailPlaceholder")}
              aria-invalid={state === "invalid"}
              aria-describedby={messageId}
              className="h-[42px] flex-1 basis-[170px] rounded-lg border bg-bg px-3 text-[15px] text-text"
              style={{
                borderColor:
                  state === "invalid" ? "var(--err)" : "var(--line-input)",
              }}
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="h-[42px] cursor-pointer rounded-lg border-0 bg-accent px-[18px] text-[14.5px] font-semibold whitespace-nowrap text-accent-ink disabled:cursor-default disabled:opacity-70"
            >
              {t("ctaJoin")}
            </button>
          </div>

          <div
            id={messageId}
            role="status"
            className="text-[12.5px]"
            style={{ color: message.color }}
          >
            {t(message.key)}
          </div>
        </form>
      </div>
    </Section>
  );
}
