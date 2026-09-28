"use client";

import { useId, useState, type FormEvent } from "react";
import { AlertCircleIcon, CheckIcon, SpinnerIcon } from "@/components/icons";
import { useSite } from "@/components/providers";
import {
  Card,
  MonoLabel,
  Section,
  SectionHeading,
  segClass,
} from "@/components/ui";
import { getAppOptions, companySizes, type CopyKey } from "@/lib/copy";
import {
  emptyPartnerSubmission,
  validatePartner,
  type FieldErrors,
  type PartnerField,
  type PartnerSubmission,
} from "@/lib/validation";

type FormState = "idle" | "sending" | "success" | "server-error";

const GETS: CopyKey[] = ["g1", "g2", "g3"];
const ASKS: CopyKey[] = ["a1", "a2"];

const inputClass =
  "h-[38px] rounded-lg border bg-bg px-[11px] text-[14.5px] text-text";

function BulletCard({
  label,
  items,
  dashColor,
  t,
}: {
  label: string;
  items: CopyKey[];
  dashColor: string;
  t: (key: CopyKey) => string;
}) {
  return (
    <Card className="p-[18px]">
      <MonoLabel>{label}</MonoLabel>
      <ul className="mt-3 flex list-none flex-col gap-[9px] p-0">
        {items.map((key) => (
          <li key={key} className="flex gap-[9px] text-[14.5px]">
            <span aria-hidden="true" style={{ color: dashColor }}>
              —
            </span>
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function Partner() {
  const { t, lang } = useSite();
  const appOptions = getAppOptions(lang);
  const fieldId = useId();
  const [values, setValues] = useState<PartnerSubmission>(
    emptyPartnerSubmission,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>("idle");

  const set = (key: keyof PartnerSubmission, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const borderFor = (key: PartnerField) =>
    errors[key] ? "var(--err)" : "var(--line-input)";

  const describedBy = (key: PartnerField) =>
    errors[key] ? `${fieldId}-${key}-error` : undefined;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const found = validatePartner(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setState("idle");
      return;
    }

    setErrors({});
    setState("sending");
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("success");
    } catch {
      setState("server-error");
    }
  }

  const sending = state === "sending";

  return (
    <Section id="partner">
      <SectionHeading>{t("partnerHead")}</SectionHeading>
      <p className="mt-3 mb-0 max-w-[60ch] text-base text-text2">
        {t("partnerSub")}
      </p>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-4">
        <div className="flex flex-col gap-[14px]">
          <BulletCard
            label={t("youGetLabel")}
            items={GETS}
            dashColor="var(--accent)"
            t={t}
          />
          <BulletCard
            label={t("weAskLabel")}
            items={ASKS}
            dashColor="var(--text3)"
            t={t}
          />
        </div>

        <Card className="p-5">
          {state === "success" ? (
            <div className="flex flex-col items-start gap-[10px] px-1 py-5">
              <div className="grid h-[34px] w-[34px] place-items-center rounded-full bg-accent-soft text-accent">
                <CheckIcon size={18} />
              </div>
              <div className="font-display text-lg font-semibold">
                {t("formSuccess")}
              </div>
              <button
                type="button"
                onClick={() => {
                  setValues(emptyPartnerSubmission);
                  setState("idle");
                }}
                className="cursor-pointer rounded-lg border border-line2 bg-transparent px-[13px] py-2 text-[13.5px] font-semibold text-text"
              >
                {t("formAgain")}
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="flex flex-col gap-[14px]">
              {state === "server-error" && (
                <div
                  role="alert"
                  className="flex items-start gap-[9px] rounded-lg border border-[color-mix(in_oklab,var(--err)_45%,var(--line))] bg-[color-mix(in_oklab,var(--err)_10%,transparent)] px-3 py-[11px] text-[13.5px] text-text"
                >
                  <span className="mt-[2px] shrink-0">
                    <AlertCircleIcon size={16} stroke="var(--err)" />
                  </span>
                  <span>{t("serverErrorText")}</span>
                </div>
              )}

              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(190px,100%),1fr))] gap-3">
                <label className="flex flex-col gap-[6px] text-[13px] text-text2">
                  <span>{t("fName")}</span>
                  <input
                    name="name"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder={t("namePlaceholder")}
                    aria-invalid={!!errors.name}
                    aria-describedby={describedBy("name")}
                    className={inputClass}
                    style={{ borderColor: borderFor("name") }}
                  />
                  {errors.name && (
                    <span
                      id={`${fieldId}-name-error`}
                      className="text-[12.5px] text-err"
                    >
                      {t("eNameText")}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-[6px] text-[13px] text-text2">
                  <span>{t("fEmail")}</span>
                  <input
                    name="email"
                    type="email"
                    inputMode="email"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    aria-invalid={!!errors.email}
                    aria-describedby={describedBy("email")}
                    className={inputClass}
                    style={{ borderColor: borderFor("email") }}
                  />
                  {errors.email && (
                    <span
                      id={`${fieldId}-email-error`}
                      className="text-[12.5px] text-err"
                    >
                      {t("eEmailText")}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-[6px] text-[13px] text-text2">
                  <span>{t("fCompany")}</span>
                  <input
                    name="company"
                    value={values.company}
                    onChange={(e) => set("company", e.target.value)}
                    aria-invalid={!!errors.company}
                    aria-describedby={describedBy("company")}
                    className={inputClass}
                    style={{ borderColor: borderFor("company") }}
                  />
                  {errors.company && (
                    <span
                      id={`${fieldId}-company-error`}
                      className="text-[12.5px] text-err"
                    >
                      {t("eCompanyText")}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-[6px] text-[13px] text-text2">
                  <span>{t("fSize")}</span>
                  <select
                    name="size"
                    value={values.size}
                    onChange={(e) => set("size", e.target.value)}
                    className="h-[38px] rounded-lg border border-line-input bg-bg px-[9px] text-[14.5px] text-text"
                  >
                    <option value="">{t("sizeUnset")}</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size.replace("-", "–")}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <fieldset className="m-0 flex flex-col gap-[7px] border-0 p-0">
                <legend className="p-0 text-[13px] text-text2">
                  {t("fApp")}
                </legend>
                <div
                  className="flex max-w-full flex-wrap gap-[2px] rounded-lg border p-[2px]"
                  style={{ borderColor: borderFor("app"), width: "fit-content" }}
                >
                  {appOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={values.app === option.value}
                      onClick={() => set("app", option.value)}
                      className={`cursor-pointer rounded-md border-0 px-[13px] py-[7px] text-[13.5px] font-semibold ${segClass(values.app === option.value)}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.app && (
                  <span className="text-[12.5px] text-err">{t("eAppText")}</span>
                )}
              </fieldset>

              <label className="flex flex-col gap-[6px] text-[13px] text-text2">
                <span>{t("fWant")}</span>
                <textarea
                  name="want"
                  rows={3}
                  value={values.want}
                  onChange={(e) => set("want", e.target.value)}
                  aria-invalid={!!errors.want}
                  aria-describedby={describedBy("want")}
                  className="resize-y rounded-lg border bg-bg px-[11px] py-[9px] text-[14.5px] text-text"
                  style={{ borderColor: borderFor("want") }}
                />
                {errors.want && (
                  <span
                    id={`${fieldId}-want-error`}
                    className="text-[12.5px] text-err"
                  >
                    {t("eWantText")}
                  </span>
                )}
              </label>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex cursor-pointer items-center gap-2 self-start rounded-lg border-0 bg-accent px-[18px] py-[11px] text-[14.5px] font-semibold text-accent-ink disabled:cursor-default disabled:opacity-70"
              >
                {sending && <SpinnerIcon />}
                <span>{sending ? t("submitSending") : t("submitLabel")}</span>
              </button>
            </form>
          )}
        </Card>
      </div>
    </Section>
  );
}
