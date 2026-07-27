import type { Payload } from "payload";
import type { EnquiryInput } from "@/src/lib/validation/enquiry";
import { env, isSMTPConfigured } from "@/src/lib/env";

function escapeHTML(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendEnquiryEmails({
  payload,
  enquiryID,
  reference,
  input,
}: {
  payload: Payload;
  enquiryID: number | string;
  reference: string;
  input: EnquiryInput;
}): Promise<"failed" | "sent" | "skipped"> {
  if (!isSMTPConfigured()) return "skipped";

  const settings = await payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    overrideAccess: true,
  });
  const recipient =
    process.env.CONTACT_NOTIFICATION_EMAIL || settings.enquiryNotificationEmail;
  if (!recipient) return "skipped";

  const rows = [
    ["Reference", reference],
    ["Name", input.fullName],
    ["Phone", input.phone],
    ["Email", input.email || "Not provided"],
    ["Organisation", input.organisation || "Not provided"],
    ["Project type", input.projectType],
    ["Location", input.projectLocation || "Not provided"],
    ["Budget", input.estimatedBudget || "Not provided"],
    ["Expected start", input.expectedStartDate || "Not provided"],
    ["Source", input.sourcePage],
    ["Message", input.message],
  ];

  try {
    await payload.sendEmail({
      to: recipient,
      subject: `New construction enquiry — ${reference}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
      html: `<h1>New construction enquiry</h1>${rows
        .map(
          ([label, value]) =>
            `<p><strong>${escapeHTML(label)}:</strong> ${escapeHTML(value)}</p>`,
        )
        .join("")}`,
    });

    if (
      process.env.SEND_ENQUIRY_CONFIRMATION === "true" &&
      input.email
    ) {
      await payload.sendEmail({
        to: input.email,
        subject: `We received your enquiry — ${reference}`,
        text: `Thank you for contacting Zum Zum Enterprises. Your enquiry has been received and saved under reference ${reference}.`,
        html: `<p>Thank you for contacting Zum Zum Enterprises.</p><p>Your enquiry has been received and saved under reference <strong>${escapeHTML(reference)}</strong>.</p>`,
      });
    }

    return "sent";
  } catch (error) {
    payload.logger.error({
      message: "Enquiry email delivery failed after the enquiry was saved.",
      enquiryID,
      error: error instanceof Error ? error.message : "Unknown email error",
    });
    return "failed";
  }
}

export async function verifyTurnstile(
  token: string | undefined,
  remoteIP: string,
): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
    remoteip: remoteIP,
  });
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
      cache: "no-store",
    },
  );
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export const emailFromName = env.smtp.fromName;
