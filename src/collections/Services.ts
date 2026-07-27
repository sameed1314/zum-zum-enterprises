import type { CollectionConfig } from "payload";
import { contentManagersOnly, publicOrContentManager } from "@/src/access";
import { editorialVersions, seoFields, slugField } from "@/src/fields/shared";
import { createCollectionRevalidation } from "@/src/hooks/revalidate";

const revalidation = createCollectionRevalidation(
  ["/", "/services", "/projects", "/sitemap.xml"],
  "/services",
);

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Service", plural: "Services" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "featured", "displayOrder", "active", "_status"],
    preview: ({ slug }) =>
      slug
        ? `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/services`
        : null,
  },
  defaultSort: "displayOrder",
  access: {
    read: publicOrContentManager,
    create: contentManagersOnly,
    update: contentManagersOnly,
    delete: contentManagersOnly,
  },
  versions: editorialVersions,
  hooks: {
    afterChange: [revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    { name: "shortDescription", type: "textarea", required: true, maxLength: 240 },
    { name: "fullDescription", type: "richText" },
    {
      name: "icon",
      label: "Icon identifier",
      type: "text",
      admin: { description: "Use a supported Lucide icon name, e.g. Building2." },
    },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "capabilities",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
    { name: "typicalScope", type: "richText" },
    {
      name: "relevantProjectTypes",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "relatedProjects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
    },
    {
      type: "row",
      fields: [
        { name: "featured", type: "checkbox", defaultValue: false, index: true },
        { name: "displayOrder", type: "number", defaultValue: 0, index: true },
        { name: "active", type: "checkbox", defaultValue: true, index: true },
      ],
    },
    seoFields,
  ],
};
