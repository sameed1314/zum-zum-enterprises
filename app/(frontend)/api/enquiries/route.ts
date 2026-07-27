import config from "@payload-config";
import { createHash, randomBytes } from "node:crypto";
import { getPayload } from "payload";
import { sendEnquiryEmails, verifyTurnstile } from "@/src/lib/email/enquiry";
import { consumeEnquiryLimit } from "@/src/lib/rate-limit";
import { enquirySchema } from "@/src/lib/validation/enquiry";

const duplicates = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

function requestIP(request: Request): string {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function enquiryReference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `ZZE-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request): Promise<Response> {
  const ip = requestIP(request);
  const limit = consumeEnquiryLimit(ip);
  if (!limit.allowed) {
    return Response.json(
      { ok: false, message: "Too many attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "retry-after": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: "The submitted form could not be read." },
      { status: 400 },
    );
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        message: "Please review the highlighted fields.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  if (parsed.data.website) {
    return Response.json({ ok: true, reference: "RECEIVED" });
  }

  const turnstileValid = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!turnstileValid) {
    return Response.json(
      { ok: false, message: "Verification failed. Please try again." },
      { status: 403 },
    );
  }

  const fingerprint = createHash("sha256")
    .update(
      `${parsed.data.fullName.toLowerCase()}|${parsed.data.phone.replace(/\D/g, "")}|${parsed.data.message.toLowerCase()}`,
    )
    .digest("hex");
  const previousSubmission = duplicates.get(fingerprint);
  if (previousSubmission && Date.now() - previousSubmission < DUPLICATE_WINDOW_MS) {
    return Response.json(
      { ok: false, message: "This enquiry was already submitted." },
      { status: 409 },
    );
  }

  const payload = await getPayload({ config });
  const reference = enquiryReference();

  try {
    const enquiry = await payload.create({
      collection: "enquiries",
      overrideAccess: true,
      data: {
        reference,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        organisation: parsed.data.organisation,
        projectType: parsed.data.projectType,
        projectLocation: parsed.data.projectLocation,
        district: parsed.data.district,
        estimatedBudget: parsed.data.estimatedBudget,
        expectedStartDate: parsed.data.expectedStartDate,
        message: parsed.data.message,
        sourcePage: parsed.data.sourcePage,
        relatedProject:
          typeof parsed.data.relatedProject === "number"
            ? parsed.data.relatedProject
            : parsed.data.relatedProject && /^\d+$/.test(parsed.data.relatedProject)
              ? Number(parsed.data.relatedProject)
              : undefined,
        relatedService:
          typeof parsed.data.relatedService === "number"
            ? parsed.data.relatedService
            : parsed.data.relatedService && /^\d+$/.test(parsed.data.relatedService)
              ? Number(parsed.data.relatedService)
              : undefined,
        consentConfirmed: true,
        status: "new",
        priority: "normal",
        tracking: {
          utmSource: parsed.data.utmSource,
          utmMedium: parsed.data.utmMedium,
          utmCampaign: parsed.data.utmCampaign,
          utmTerm: parsed.data.utmTerm,
          utmContent: parsed.data.utmContent,
          referrer: parsed.data.referrer,
        },
        emailNotificationStatus: "pending",
      },
    });
    duplicates.set(fingerprint, Date.now());

    const emailStatus = await sendEnquiryEmails({
      payload,
      enquiryID: enquiry.id,
      reference,
      input: parsed.data,
    });
    await payload.update({
      collection: "enquiries",
      id: enquiry.id,
      overrideAccess: true,
      data: { emailNotificationStatus: emailStatus },
    });

    return Response.json({ ok: true, reference }, { status: 201 });
  } catch (error) {
    payload.logger.error({
      message: "Public enquiry creation failed.",
      error: error instanceof Error ? error.message : "Unknown enquiry error",
    });
    return Response.json(
      {
        ok: false,
        message:
          "We could not save your enquiry right now. Please use WhatsApp or try again.",
      },
      { status: 503 },
    );
  }
}
