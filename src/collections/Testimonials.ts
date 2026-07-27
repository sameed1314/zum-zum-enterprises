import type { CollectionConfig } from "payload";
import { contentManagersOnly, publicOrContentManager } from "@/src/access";
import { editorialVersions } from "@/src/fields/shared";
import { createCollectionRevalidation } from "@/src/hooks/revalidate";

const revalidation = createCollectionRevalidation(["/"]);

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  admin: {
    group: "Content",
    useAsTitle: "personName",
    defaultColumns: [
      "personName",
      "organisation",
      "isPlaceholder",
      "featured",
      "active",
      "_status",
    ],
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
    { name: "text", label: "Testimonial", type: "textarea", required: true },
    { name: "personName", type: "text" },
    { name: "designation", type: "text" },
    { name: "organisation", type: "text" },
    { name: "clientType", type: "text" },
    { name: "image", label: "Image or logo", type: "upload", relationTo: "media" },
    {
      name: "relatedProject",
      type: "relationship",
      relationTo: "projects",
    },
    {
      name: "isPlaceholder",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Keep enabled until the testimonial and client attribution are approved.",
      },
    },
    {
      type: "row",
      fields: [
        { name: "featured", type: "checkbox", defaultValue: false, index: true },
        { name: "displayOrder", type: "number", defaultValue: 0, index: true },
        { name: "active", type: "checkbox", defaultValue: true, index: true },
      ],
    },
  ],
};
