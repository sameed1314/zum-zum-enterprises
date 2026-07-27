import type { CollectionConfig } from "payload";
import {
  contentManagersOnly,
  publicActiveOrContentManager,
} from "@/src/access";
import { slugField } from "@/src/fields/shared";
import { createCollectionRevalidation } from "@/src/hooks/revalidate";

const revalidation = createCollectionRevalidation(["/", "/projects", "/sitemap.xml"]);

export const ProjectCategories: CollectionConfig = {
  slug: "project-categories",
  labels: { singular: "Project Category", plural: "Project Categories" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "displayOrder", "active", "updatedAt"],
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
    slugField("name"),
    { name: "description", type: "textarea" },
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
