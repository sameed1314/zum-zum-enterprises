import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  canManageContentUser,
  canManageEnquiriesUser,
  contentManagersOnly,
  enquiryManagersOnly,
  publicOrContentManager,
  superAdminOnly,
} from "../src/access";
import { collectionRevalidationPaths } from "../src/hooks/revalidate";
import { consumeEnquiryLimit, resetRateLimitsForTests } from "../src/lib/rate-limit";
import { slugify } from "../src/lib/slug";
import { enquirySchema } from "../src/lib/validation/enquiry";

const accessArgs = (role?: "super-admin" | "editor" | "enquiry-manager") =>
  ({
    req: { user: role ? { id: 1, role } : null },
  }) as never;

describe("role-based access", () => {
  it("grants full administration only to super administrators", () => {
    expect(superAdminOnly(accessArgs("super-admin"))).toBe(true);
    expect(superAdminOnly(accessArgs("editor"))).toBe(false);
  });

  it("allows editors to manage content but not enquiries", () => {
    expect(contentManagersOnly(accessArgs("editor"))).toBe(true);
    expect(enquiryManagersOnly(accessArgs("editor"))).toBe(false);
    expect(canManageContentUser({ role: "editor" })).toBe(true);
  });

  it("allows enquiry managers to manage enquiries but not content", () => {
    expect(enquiryManagersOnly(accessArgs("enquiry-manager"))).toBe(true);
    expect(contentManagersOnly(accessArgs("enquiry-manager"))).toBe(false);
    expect(canManageEnquiriesUser({ role: "enquiry-manager" })).toBe(true);
  });

  it("restricts anonymous editorial reads to published content", () => {
    expect(publicOrContentManager(accessArgs())).toEqual({
      _status: { equals: "published" },
    });
    expect(publicOrContentManager(accessArgs("editor"))).toBe(true);
  });
});

describe("content utilities", () => {
  it("generates stable URL slugs", () => {
    expect(slugify("Premium Residence — Pulwama")).toBe(
      "premium-residence-pulwama",
    );
    expect(slugify("Civil & Structural Works")).toBe(
      "civil-and-structural-works",
    );
  });

  it("revalidates both old and new project paths after a slug change", () => {
    expect(
      collectionRevalidationPaths(
        ["/", "/projects"],
        "/projects",
        { slug: "new-slug", _status: "published" },
        { slug: "old-slug", _status: "published" },
      ),
    ).toEqual(["/", "/projects", "/projects/new-slug", "/projects/old-slug"]);
  });
});

describe("enquiry validation and abuse controls", () => {
  const valid = {
    fullName: "Example User",
    phone: "+1 202-555-0142",
    email: "sameed@example.com",
    projectType: "Residential project",
    projectLocation: "Pulwama",
    message:
      "I would like to discuss a new residential construction project in Pulwama.",
    sourcePage: "/contact",
    consent: true,
  };

  it("accepts a valid enquiry", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects malformed and non-consensual submissions", () => {
    const result = enquirySchema.safeParse({
      ...valid,
      phone: "abc",
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rate limits repeated submissions", () => {
    resetRateLimitsForTests();
    for (let index = 0; index < 5; index += 1) {
      expect(consumeEnquiryLimit("test-ip").allowed).toBe(true);
    }
    expect(consumeEnquiryLimit("test-ip").allowed).toBe(false);
  });
});

describe("route preservation", () => {
  for (const route of [
    "page.tsx",
    "about/page.tsx",
    "projects/page.tsx",
    "projects/[slug]/page.tsx",
    "services/page.tsx",
    "capabilities/page.tsx",
    "quality-safety/page.tsx",
    "contact/page.tsx",
  ]) {
    it(`keeps /${route.replace(/\/page\.tsx$|page\.tsx$/, "") || ""}`, () => {
      expect(
        existsSync(path.join(process.cwd(), "app/(frontend)", route)),
      ).toBe(true);
    });
  }

  it("includes a production health endpoint", () => {
    expect(
      existsSync(
        path.join(process.cwd(), "app/(frontend)/api/health/route.ts"),
      ),
    ).toBe(true);
  });
});
