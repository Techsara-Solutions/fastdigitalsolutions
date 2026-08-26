"use client";

import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import {
  budgetOptions,
  contactFormSchema,
  serviceOptions,
  timelineOptions,
  toApiPayload,
  type ContactFormValues,
} from "@/lib/contact-schema";
import { OTHER_OPTION, otherCountries, primaryCountries } from "@/lib/countries";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * Contact form (PRD §22). Implements every required state: idle, client
 * validation error, submitting, accepted, rate-limited, network timeout, and
 * server error — with the focus management and live-region announcements of
 * PRD §22.2. Non-sensitive values are preserved after recoverable failures.
 */

type SubmissionState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "accepted"; requestId: string }
  | { kind: "rate_limited" }
  | { kind: "timeout" }
  | { kind: "server_error" };

const inputClasses =
  "mt-1.5 w-full rounded-[10px] border border-stone bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-muted/60 focus-visible:border-clay-dark aria-[invalid=true]:border-clay-dark";
const labelClasses = "block text-sm font-semibold text-ink";
const fieldHintClasses = "mt-1 text-xs text-muted";

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  workEmail: "Work email",
  company: "Company",
  country: "Country or region",
  service: "Service required",
  projectSummary: "Project summary",
  budgetRange: "Budget range",
  timeline: "Desired timeline",
  phone: "Phone",
  consent: "Consent",
};

export function ContactForm({ apiUrl, timeoutMs }: { apiUrl: string; timeoutMs: number }) {
  const pathname = usePathname();
  const formId = useId();
  const [submission, setSubmission] = useState<SubmissionState>({ kind: "idle" });
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const failureRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { website: "" },
  });

  const errorEntries = Object.entries(errors).filter(([key]) => key !== "website");

  const fieldId = (name: string) => `${formId}-${name}`;

  const focusFailure = () => {
    requestAnimationFrame(() => failureRef.current?.focus());
  };

  const onValid = async (values: ContactFormValues) => {
    setSubmission({ kind: "submitting" });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(toApiPayload(values, pathname)),
        signal: controller.signal,
      });

      if (response.status === 202) {
        const data = (await response.json().catch(() => ({}))) as { requestId?: string };
        setSubmission({ kind: "accepted", requestId: data.requestId ?? "received" });
        requestAnimationFrame(() => successHeadingRef.current?.focus());
        return;
      }

      if (response.status === 422) {
        const data = (await response.json().catch(() => ({}))) as {
          fieldErrors?: Record<string, string>;
        };
        setSubmission({ kind: "idle" });
        const fieldErrors = data.fieldErrors ?? {};
        for (const [field, message] of Object.entries(fieldErrors)) {
          if (field in FIELD_LABELS) {
            setError(field as keyof ContactFormValues, { type: "server", message });
          }
        }
        requestAnimationFrame(() => errorSummaryRef.current?.focus());
        return;
      }

      if (response.status === 429) {
        setSubmission({ kind: "rate_limited" });
        focusFailure();
        return;
      }

      setSubmission({ kind: "server_error" });
      focusFailure();
    } catch (error) {
      setSubmission(
        error instanceof DOMException && error.name === "AbortError"
          ? { kind: "timeout" }
          : { kind: "server_error" },
      );
      focusFailure();
    } finally {
      clearTimeout(timer);
    }
  };

  const onInvalid = () => {
    requestAnimationFrame(() => errorSummaryRef.current?.focus());
  };

  if (submission.kind === "accepted") {
    return (
      <div className="rounded-[12px] border border-olive/40 bg-olive/10 p-8" role="status">
        <h2 ref={successHeadingRef} tabIndex={-1} className="text-h3 font-semibold text-ink">
          Thank you. Your enquiry has been received.
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/85">
          We will review it and respond {siteConfig.responseCommitment}. Reference:{" "}
          <strong>{submission.requestId}</strong>
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(onValid, onInvalid)(event)}
      className="space-y-6"
    >
      {/* Live region announcing the submitting/result states (PRD §22.2) */}
      <p aria-live="polite" className="sr-only">
        {submission.kind === "submitting" ? "Sending your enquiry." : ""}
        {submission.kind === "rate_limited"
          ? "Too many requests. Please wait before trying again."
          : ""}
        {submission.kind === "timeout" || submission.kind === "server_error"
          ? "Your enquiry could not be sent."
          : ""}
      </p>

      {/* Error summary — focused after failed validation (PRD §19.3) */}
      <div
        ref={errorSummaryRef}
        tabIndex={-1}
        aria-labelledby={errorEntries.length > 0 ? `${formId}-error-summary-title` : undefined}
        className={
          errorEntries.length > 0
            ? "rounded-[12px] border-2 border-clay-dark bg-white p-5"
            : "sr-only"
        }
      >
        {errorEntries.length > 0 ? (
          <>
            <h2 id={`${formId}-error-summary-title`} className="text-base font-bold text-clay-dark">
              Review the highlighted fields
            </h2>
            <ul className="mt-3 space-y-1.5">
              {errorEntries.map(([name, error]) => (
                <li key={name}>
                  <a
                    href={`#${fieldId(name)}`}
                    className="text-sm font-medium text-clay-dark underline"
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(fieldId(name))?.focus();
                    }}
                  >
                    {FIELD_LABELS[name] ?? name}: {error?.message as string}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      {/* Failure notices (rate limit / timeout / server error) */}
      {submission.kind === "rate_limited" ||
      submission.kind === "timeout" ||
      submission.kind === "server_error" ? (
        <div
          ref={failureRef}
          tabIndex={-1}
          role="alert"
          className="rounded-[12px] border-2 border-clay-dark bg-white p-5"
        >
          <h2 className="text-base font-bold text-clay-dark">
            {submission.kind === "rate_limited"
              ? "Too many requests"
              : "We could not send your enquiry"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">
            {submission.kind === "rate_limited"
              ? "Too many requests were received from this connection. Please wait before trying again or contact us by phone."
              : `We could not send your enquiry. Please try again or contact us by phone at ${siteConfig.phoneDisplay}.`}
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("fullName")} className={labelClasses}>
            Full name <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id={fieldId("fullName")}
            type="text"
            autoComplete="name"
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? `${fieldId("fullName")}-error` : undefined}
            className={inputClasses}
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p
              id={`${fieldId("fullName")}-error`}
              className="mt-1.5 text-sm font-medium text-clay-dark"
            >
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("workEmail")} className={labelClasses}>
            Work email <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id={fieldId("workEmail")}
            type="email"
            autoComplete="email"
            aria-invalid={errors.workEmail ? true : undefined}
            aria-describedby={errors.workEmail ? `${fieldId("workEmail")}-error` : undefined}
            className={inputClasses}
            {...register("workEmail")}
          />
          {errors.workEmail ? (
            <p
              id={`${fieldId("workEmail")}-error`}
              className="mt-1.5 text-sm font-medium text-clay-dark"
            >
              {errors.workEmail.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("company")} className={labelClasses}>
            Company <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id={fieldId("company")}
            type="text"
            autoComplete="organization"
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={errors.company ? `${fieldId("company")}-error` : undefined}
            className={inputClasses}
            {...register("company")}
          />
          {errors.company ? (
            <p
              id={`${fieldId("company")}-error`}
              className="mt-1.5 text-sm font-medium text-clay-dark"
            >
              {errors.company.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("country")} className={labelClasses}>
            Country or region <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <select
            id={fieldId("country")}
            autoComplete="country-name"
            aria-invalid={errors.country ? true : undefined}
            aria-describedby={errors.country ? `${fieldId("country")}-error` : undefined}
            className={inputClasses}
            defaultValue=""
            {...register("country")}
          >
            <option value="" disabled>
              Select your country or region
            </option>
            {primaryCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
            <option value="" disabled>
              ──────────
            </option>
            {otherCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
            <option value={OTHER_OPTION}>{OTHER_OPTION}</option>
          </select>
          {errors.country ? (
            <p
              id={`${fieldId("country")}-error`}
              className="mt-1.5 text-sm font-medium text-clay-dark"
            >
              {errors.country.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("service")} className={labelClasses}>
          Service required <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <select
          id={fieldId("service")}
          aria-invalid={errors.service ? true : undefined}
          aria-describedby={errors.service ? `${fieldId("service")}-error` : undefined}
          className={inputClasses}
          defaultValue=""
          {...register("service")}
        >
          <option value="" disabled>
            Select a service
          </option>
          {serviceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.service ? (
          <p
            id={`${fieldId("service")}-error`}
            className="mt-1.5 text-sm font-medium text-clay-dark"
          >
            {errors.service.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={fieldId("projectSummary")} className={labelClasses}>
          Project summary <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <p id={`${fieldId("projectSummary")}-hint`} className={fieldHintClasses}>
          The business goal, current challenge, or delivery gap — 30 to 3,000 characters. Please do
          not include passwords, credentials, or sensitive personal data.
        </p>
        <textarea
          id={fieldId("projectSummary")}
          rows={6}
          aria-invalid={errors.projectSummary ? true : undefined}
          aria-describedby={
            errors.projectSummary
              ? `${fieldId("projectSummary")}-error ${fieldId("projectSummary")}-hint`
              : `${fieldId("projectSummary")}-hint`
          }
          className={inputClasses}
          {...register("projectSummary")}
        />
        {errors.projectSummary ? (
          <p
            id={`${fieldId("projectSummary")}-error`}
            className="mt-1.5 text-sm font-medium text-clay-dark"
          >
            {errors.projectSummary.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("budgetRange")} className={labelClasses}>
            Budget range
          </label>
          <select id={fieldId("budgetRange")} className={inputClasses} {...register("budgetRange")}>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={fieldId("timeline")} className={labelClasses}>
            Desired timeline
          </label>
          <select id={fieldId("timeline")} className={inputClasses} {...register("timeline")}>
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sm:max-w-[50%]">
        <label htmlFor={fieldId("phone")} className={labelClasses}>
          Phone
        </label>
        <input
          id={fieldId("phone")}
          type="tel"
          autoComplete="tel"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? `${fieldId("phone")}-error` : undefined}
          className={inputClasses}
          {...register("phone")}
        />
        {errors.phone ? (
          <p id={`${fieldId("phone")}-error`} className="mt-1.5 text-sm font-medium text-clay-dark">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — visually hidden and hidden from assistive technology (PRD §22.1) */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId("website")}>Website</label>
        <input
          id={fieldId("website")}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id={fieldId("consent")}
          type="checkbox"
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? `${fieldId("consent")}-error` : undefined}
          className="mt-1 h-5 w-5 rounded border-stone accent-[var(--color-clay-dark)]"
          {...register("consent")}
        />
        <div>
          <label htmlFor={fieldId("consent")} className="text-sm leading-relaxed text-ink/85">
            I have read the{" "}
            <a href="/privacy/" className="font-semibold text-clay-dark underline">
              Privacy Policy
            </a>{" "}
            and agree that Fast Digital Solutions may process the information I have provided to
            respond to this enquiry. <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          {errors.consent ? (
            <p
              id={`${fieldId("consent")}-error`}
              className="mt-1.5 text-sm font-medium text-clay-dark"
            >
              {errors.consent.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <Button type="submit" disabled={isSubmitting || submission.kind === "submitting"}>
          {submission.kind === "submitting" ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
