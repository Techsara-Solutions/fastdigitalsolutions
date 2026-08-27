"use client";

import { useId, useRef, useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, toApiPayload, type ContactFormValues } from "@/lib/contact-schema";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * Contact form. Implements every required state: idle, client validation
 * error, submitting, accepted, rate-limited, network timeout, and server
 * error, with focus management and live-region announcements. Non-sensitive
 * values are preserved after recoverable failures.
 *
 * Response handling: any 2xx is success (observed contract, 2026-08-27:
 * `200 { success, contactId, message, email }`); a 4xx body with
 * `fieldErrors` maps onto fields; 429 is the throttle state; everything else
 * is the generic failure with the phone fallback.
 *
 * The JSON body is sent as `text/plain` on purpose: API Gateway has no OPTIONS
 * route, so a JSON content type would trigger a CORS preflight that 404s. A
 * text/plain POST is a "simple request" and needs no preflight; the Lambda
 * parses the body as JSON regardless.
 */

type SubmissionState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "accepted"; reference?: string }
  | { kind: "rate_limited" }
  | { kind: "timeout" }
  | { kind: "server_error" };

type FieldName = Exclude<keyof ContactFormValues, "website">;

const inputClasses =
  "mt-1.5 w-full rounded-[10px] border border-stone bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-muted/60 focus-visible:border-accent-dark aria-[invalid=true]:border-accent-dark";
const labelClasses = "block text-sm font-semibold text-ink";
const fieldHintClasses = "mt-1 text-xs text-muted";
const errorClasses = "mt-1.5 text-sm font-medium text-accent-dark";

const FIELD_LABELS: Record<FieldName, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  company: "Company",
  phoneNumber: "Phone number",
  discussionTopic: "Discussion topic",
  notes: "Notes",
};

function isFieldName(value: string): value is FieldName {
  return value in FIELD_LABELS;
}

export function ContactForm({ apiUrl, timeoutMs }: { apiUrl: string; timeoutMs: number }) {
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

  const errorEntries = Object.entries(errors).filter(([key]) => key !== "website") as [
    string,
    FieldError | undefined,
  ][];

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
        headers: { "Content-Type": "text/plain;charset=UTF-8", Accept: "application/json" },
        body: JSON.stringify(toApiPayload(values)),
        signal: controller.signal,
      });

      if (response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          contactId?: unknown;
          requestId?: unknown;
        };
        const reference = [data.contactId, data.requestId].find(
          (value): value is string => typeof value === "string" && value.length > 0,
        );
        setSubmission({ kind: "accepted", reference });
        requestAnimationFrame(() => successHeadingRef.current?.focus());
        return;
      }

      if (response.status === 429) {
        setSubmission({ kind: "rate_limited" });
        focusFailure();
        return;
      }

      if (response.status >= 400 && response.status < 500) {
        const data = (await response.json().catch(() => ({}))) as {
          fieldErrors?: Record<string, string>;
        };
        const fieldErrors = Object.entries(data.fieldErrors ?? {}).filter(([field]) =>
          isFieldName(field),
        );
        if (fieldErrors.length > 0) {
          setSubmission({ kind: "idle" });
          for (const [field, message] of fieldErrors) {
            setError(field as FieldName, { type: "server", message });
          }
          requestAnimationFrame(() => errorSummaryRef.current?.focus());
          return;
        }
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
          We will review it and respond {siteConfig.responseCommitment}.
          {submission.reference ? (
            <>
              {" "}
              Reference: <strong>{submission.reference}</strong>
            </>
          ) : null}
        </p>
      </div>
    );
  }

  const requiredMark = (
    <>
      {" "}
      <span aria-hidden="true">*</span>
      <span className="sr-only">(required)</span>
    </>
  );

  const textField = (
    name: Exclude<FieldName, "notes">,
    options: { type?: string; autoComplete?: string; hint?: string } = {},
  ) => {
    const error = errors[name];
    const hintId = options.hint ? `${fieldId(name)}-hint` : undefined;
    const errorId = error ? `${fieldId(name)}-error` : undefined;
    return (
      <div>
        <label htmlFor={fieldId(name)} className={labelClasses}>
          {FIELD_LABELS[name]}
          {requiredMark}
        </label>
        {options.hint ? (
          <p id={hintId} className={fieldHintClasses}>
            {options.hint}
          </p>
        ) : null}
        <input
          id={fieldId(name)}
          type={options.type ?? "text"}
          autoComplete={options.autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
          className={inputClasses}
          {...register(name)}
        />
        {error ? (
          <p id={errorId} className={errorClasses}>
            {error.message}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(onValid, onInvalid)(event)}
      className="space-y-6"
    >
      {/* Live region announcing the submitting/result states */}
      <p aria-live="polite" className="sr-only">
        {submission.kind === "submitting" ? "Sending your enquiry." : ""}
        {submission.kind === "rate_limited"
          ? "Too many requests. Please wait before trying again."
          : ""}
        {submission.kind === "timeout" || submission.kind === "server_error"
          ? "Your enquiry could not be sent."
          : ""}
      </p>

      {/* Error summary, focused after failed validation */}
      <div
        ref={errorSummaryRef}
        tabIndex={-1}
        aria-labelledby={errorEntries.length > 0 ? `${formId}-error-summary-title` : undefined}
        className={
          errorEntries.length > 0
            ? "rounded-[12px] border-2 border-accent-dark bg-white p-5"
            : "sr-only"
        }
      >
        {errorEntries.length > 0 ? (
          <>
            <h2
              id={`${formId}-error-summary-title`}
              className="text-base font-bold text-accent-dark"
            >
              Review the highlighted fields
            </h2>
            <ul className="mt-3 space-y-1.5">
              {errorEntries.map(([name, error]) => (
                <li key={name}>
                  <a
                    href={`#${fieldId(name)}`}
                    className="text-sm font-medium text-accent-dark underline"
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(fieldId(name))?.focus();
                    }}
                  >
                    {isFieldName(name) ? FIELD_LABELS[name] : name}: {error?.message}
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
          className="rounded-[12px] border-2 border-accent-dark bg-white p-5"
        >
          <h2 className="text-base font-bold text-accent-dark">
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
        {textField("firstName", { autoComplete: "given-name" })}
        {textField("lastName", { autoComplete: "family-name" })}
        {textField("email", { type: "email", autoComplete: "email" })}
        {textField("company", { autoComplete: "organization" })}
        {textField("phoneNumber", {
          type: "tel",
          autoComplete: "tel",
          hint: "Include the country code, for example +1 302 555 0100.",
        })}
        {textField("discussionTopic", {
          hint: "A few words, for example cloud migration readiness, QA automation, or a modernization roadmap.",
        })}
      </div>

      <div>
        <label htmlFor={fieldId("notes")} className={labelClasses}>
          {FIELD_LABELS.notes}
          {requiredMark}
        </label>
        <p id={`${fieldId("notes")}-hint`} className={fieldHintClasses}>
          The business goal, current challenge, or delivery gap, in 20 to 3,000 characters. Please
          do not include passwords, credentials, or sensitive personal data.
        </p>
        <textarea
          id={fieldId("notes")}
          rows={6}
          aria-invalid={errors.notes ? true : undefined}
          aria-describedby={
            errors.notes
              ? `${fieldId("notes")}-error ${fieldId("notes")}-hint`
              : `${fieldId("notes")}-hint`
          }
          className={inputClasses}
          {...register("notes")}
        />
        {errors.notes ? (
          <p id={`${fieldId("notes")}-error`} className={errorClasses}>
            {errors.notes.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: visually hidden and hidden from assistive technology */}
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

      <div>
        <Button type="submit" disabled={isSubmitting || submission.kind === "submitting"}>
          {submission.kind === "submitting" ? "Sending" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
