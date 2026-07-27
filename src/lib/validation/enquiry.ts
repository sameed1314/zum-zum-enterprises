import { z } from "zod";

const optionalText = (max: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() ? value.trim() : undefined,
    z.string().max(max).optional(),
  );

const optionalEmail = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() ? value.trim().toLowerCase() : undefined,
  z.string().email("Enter a valid email address.").max(254).optional(),
);

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(24)
    .regex(/^[+\d][\d\s()-]+$/, "Enter a valid phone number."),
  email: optionalEmail,
  organisation: optionalText(140),
  projectType: z.string().trim().min(2).max(120),
  projectLocation: optionalText(160),
  district: optionalText(100),
  estimatedBudget: optionalText(80),
  expectedStartDate: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() ? value.trim() : undefined,
    z.string().date("Enter a valid expected start date.").optional(),
  ),
  message: z
    .string()
    .trim()
    .min(20, "Please share a little more about the project.")
    .max(4_000),
  sourcePage: z
    .string()
    .trim()
    .max(300)
    .refine(
      (value) => value.startsWith("/") && !value.startsWith("//"),
      "Invalid source page.",
    )
    .optional()
    .default("/contact"),
  relatedProject: z.union([z.string(), z.number()]).optional(),
  relatedService: z.union([z.string(), z.number()]).optional(),
  consent: z.literal(true, {
    error: "Consent is required before submitting.",
  }),
  website: optionalText(200),
  referrer: optionalText(500),
  utmSource: optionalText(160),
  utmMedium: optionalText(160),
  utmCampaign: optionalText(160),
  utmTerm: optionalText(160),
  utmContent: optionalText(160),
  turnstileToken: optionalText(2_500),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
