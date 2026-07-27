import { afterAll, describe, expect, it } from "vitest";

const integration = process.env.RUN_PAYLOAD_INTEGRATION_TESTS === "true";

describe.skipIf(!integration)("Payload publishing integration", () => {
  let createdID: number | undefined;

  afterAll(async () => {
    if (!createdID) return;
    const [{ getPayload }, { default: config }] = await Promise.all([
      import("payload"),
      import("@payload-config"),
    ]);
    const payload = await getPayload({ config });
    await payload.delete({
      collection: "projects",
      id: createdID,
      overrideAccess: true,
      context: { skipRevalidation: true },
    });
  });

  it("keeps drafts private and exposes them only after publication", async () => {
    const [{ getPayload }, { default: config }, { textToLexical }] =
      await Promise.all([
        import("payload"),
        import("@payload-config"),
        import("../src/lib/richtext"),
      ]);
    const payload = await getPayload({ config });
    const [categories, media] = await Promise.all([
      payload.find({
        collection: "project-categories",
        limit: 1,
        overrideAccess: true,
      }),
      payload.find({ collection: "media", limit: 1, overrideAccess: true }),
    ]);
    if (!categories.docs[0] || !media.docs[0]) {
      throw new Error("Run `npm run seed` before integration tests.");
    }

    const slug = `integration-test-${Date.now()}`;
    const draft = await payload.create({
      collection: "projects",
      overrideAccess: true,
      draft: true,
      context: { skipRevalidation: true },
      data: {
        title: "Integration Test Project",
        slug,
        shortSummary: "A temporary test project used to verify publishing access.",
        category: categories.docs[0].id,
        location: "Kashmir",
        status: "upcoming",
        coverImage: media.docs[0].id,
        overview: textToLexical("This project exists only during integration testing."),
        _status: "draft",
      },
    });
    createdID = draft.id;

    const anonymousDraftRead = await payload.find({
      collection: "projects",
      overrideAccess: false,
      where: { slug: { equals: slug } },
    });
    expect(anonymousDraftRead.totalDocs).toBe(0);

    await payload.update({
      collection: "projects",
      id: draft.id,
      overrideAccess: true,
      context: { skipRevalidation: true },
      data: { _status: "published" },
    });

    const anonymousPublishedRead = await payload.find({
      collection: "projects",
      overrideAccess: false,
      where: { slug: { equals: slug } },
    });
    expect(anonymousPublishedRead.totalDocs).toBe(1);
  });
});
