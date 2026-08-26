import { z } from "zod";
import { services } from "@/content/services";

/**
 * Contact form field specification and validation rules (PRD §22.1).
 * The same schema powers client validation and unit tests. The backend
 * performs its own independent validation (PRD §26.2).
 */

export const serviceOptions = [
  ...services.map((service) => ({ value: service.slug, label: service.name })),
  { value: "multiple-services", label: "Multiple services" },
  { value: "not-sure-yet", label: "Not sure yet" },
] as const;

export const budgetOptions = [
  { value: "", label: "Select a range (optional)" },
  { value: "under-25k", label: "Under $25,000" },
  { value: "25k-75k", label: "$25,000 – $75,000" },
  { value: "75k-150k", label: "$75,000 – $150,000" },
  { value: "150k-plus", label: "$150,000+" },
  { value: "not-determined", label: "Not determined" },
  { value: "prefer-to-discuss", label: "Prefer to discuss" },
] as const;

export const timelineOptions = [
  { value: "", label: "Select a timeline (optional)" },
  { value: "as-soon-as-practical", label: "As soon as practical" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-plus-months", label: "6+ months" },
  { value: "not-determined", label: "Not determined" },
] as const;

const serviceValues = serviceOptions.map((option) => option.value);

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name (at least 2 characters).")
    .max(100, "Your name must be 100 characters or fewer."),
  workEmail: z
    .string()
    .trim()
    .max(254, "Email addresses must be 254 characters or fewer.")
    .email("Enter a valid work email address."),
  company: z
    .string()
    .trim()
    .min(2, "Enter your company name (at least 2 characters).")
    .max(150, "Your company name must be 150 characters or fewer."),
  country: z.string().trim().min(1, "Select your country or region."),
  service: z
    .string()
    .refine((value) => serviceValues.includes(value), "Select the service you are interested in."),
  projectSummary: z
    .string()
    .trim()
    .min(30, "Tell us a little more — at least 30 characters.")
    .max(3000, "Please keep the summary under 3,000 characters."),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  phone: z
    .string()
    .trim()
    .max(30, "Phone numbers must be 30 characters or fewer.")
    .regex(/^$|^\+?[0-9()\-.\s]{7,}$/, "Enter a valid phone number, or leave this blank.")
    .optional(),
  consent: z.literal(true, {
    message: "Please confirm you have read the Privacy Policy so we can respond to your enquiry.",
  }),
  /** Honeypot — must remain empty; not announced to assistive technology. */
  website: z.string().max(0, "Submission rejected.").optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Payload shape for the external contact API (PRD §22.3). */
export function toApiPayload(values: ContactFormValues, sourcePath: string) {
  return {
    fullName: values.fullName,
    workEmail: values.workEmail,
    company: values.company,
    country: values.country,
    service: values.service,
    projectSummary: values.projectSummary,
    budgetRange: values.budgetRange || undefined,
    timeline: values.timeline || undefined,
    phone: values.phone || undefined,
    consent: values.consent,
    sourcePath,
    website: values.website ?? "",
  };
}
