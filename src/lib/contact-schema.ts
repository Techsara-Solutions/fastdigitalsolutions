import { z } from "zod";

/**
 * Contact form field specification and validation rules.
 *
 * The seven API fields mirror the backend contract exactly
 * (API Gateway → Lambda `POST /api/contact-message`). The `website` honeypot
 * is client-side only and is never sent. The backend performs its own
 * independent validation.
 */
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Enter your first name.")
    .max(60, "First names must be 60 characters or fewer."),
  lastName: z
    .string()
    .trim()
    .min(1, "Enter your last name.")
    .max(60, "Last names must be 60 characters or fewer."),
  email: z
    .string()
    .trim()
    .max(254, "Email addresses must be 254 characters or fewer.")
    .email("Enter a valid email address."),
  company: z
    .string()
    .trim()
    .min(2, "Enter your company name (at least 2 characters).")
    .max(150, "Your company name must be 150 characters or fewer."),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Enter a phone number we can reach you on.")
    .max(30, "Phone numbers must be 30 characters or fewer.")
    .regex(/^\+?[0-9()\-.\s]{7,}$/, "Enter a valid phone number, including the country code."),
  discussionTopic: z
    .string()
    .trim()
    .min(3, "Tell us the topic in a few words.")
    .max(120, "Please keep the topic under 120 characters."),
  notes: z
    .string()
    .trim()
    .min(20, "Tell us a little more, at least 20 characters.")
    .max(3000, "Please keep the notes under 3,000 characters."),
  /** Honeypot: must remain empty; not announced to assistive technology. */
  website: z.string().max(0, "Submission rejected.").optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Keys accepted by the API, in the order the backend documents them. */
export const API_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "company",
  "phoneNumber",
  "discussionTopic",
  "notes",
] as const;

export type ContactApiPayload = Pick<ContactFormValues, (typeof API_FIELDS)[number]>;

/** Payload for the external contact API: exactly the seven documented fields. */
export function toApiPayload(values: ContactFormValues): ContactApiPayload {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    company: values.company,
    phoneNumber: values.phoneNumber,
    discussionTopic: values.discussionTopic,
    notes: values.notes,
  };
}
