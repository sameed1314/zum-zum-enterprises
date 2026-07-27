import type { CollectionConfig } from "payload";
import {
  contentManagersOnly,
  publicActiveOrContentManager,
} from "@/src/access";
import { createCollectionRevalidation } from "@/src/hooks/revalidate";

const revalidation = createCollectionRevalidation(["/", "/capabilities"]);

export const Capabilities: CollectionConfig = {
  slug: "capabilities",
  labels: { singular: "Capability", plural: "Capabilities" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "displayOrder", "active", "updatedAt"],
  },
  defaultSort: "displayOrder",
  access: {
    read: publicActiveOrContentManager,
    create: contentManagersOnly,
    update: contentManagersOnly,
    delete: contentManagersOnly,
  },
  hooks: {
    afterChange: [revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "shortDescription", type: "textarea", required: true },
    { name: "detailedDescription", type: "richText" },
    { name: "icon", type: "text" },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "displayOrder",
      type: "number",
      defaultValue: 0,
      index: true,
      admin: { position: "sidebar" },
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      index: true,
      admin: { position: "sidebar" },
    },
  ],
};
