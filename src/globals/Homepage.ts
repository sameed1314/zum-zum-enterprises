import type { GlobalConfig } from "payload";
import { contentManagersOnly } from "@/src/access";
import { editorialVersions, linkFields, seoFields } from "@/src/fields/shared";
import { createGlobalRevalidation } from "@/src/hooks/revalidate";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  admin: { group: "Website" },
  access: {
    read: () => true,
    update: contentManagersOnly,
  },
  versions: editorialVersions,
  hooks: { afterChange: [createGlobalRevalidation(["/"])] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "heroEyebrow", type: "text", required: true },
            { name: "heroHeading", type: "text", required: true },
            { name: "heroAccent", type: "text" },
            { name: "heroSupportingText", type: "textarea", required: true },
            { name: "heroImage", type: "upload", relationTo: "media", required: true },
            { name: "heroVideo", type: "upload", relationTo: "media" },
            {
              type: "row",
              fields: [
                { name: "primaryCTA", type: "group", fields: linkFields },
                { name: "secondaryCTA", type: "group", fields: linkFields },
              ],
            },
          ],
        },
        {
          label: "Content",
          fields: [
            { name: "introductoryStatement", type: "textarea", required: true },
            {
              name: "featuredProjects",
              type: "relationship",
              relationTo: "projects",
              hasMany: true,
              maxRows: 6,
            },
            {
              name: "featuredServices",
              type: "relationship",
              relationTo: "services",
              hasMany: true,
              maxRows: 8,
            },
            {
              name: "featuredSectors",
              type: "relationship",
              relationTo: "sectors",
              hasMany: true,
            },
            {
              name: "statistics",
              type: "array",
              maxRows: 6,
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
                { name: "verified", type: "checkbox", defaultValue: false },
              ],
            },
            {
              name: "whySection",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text" },
                { name: "heading", type: "text" },
                { name: "introduction", type: "textarea" },
                { name: "image", type: "upload", relationTo: "media" },
                {
                  name: "points",
                  type: "array",
                  fields: [{ name: "label", type: "text", required: true }],
                },
              ],
            },
            {
              name: "constructionProcess",
              type: "array",
              fields: [
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea" },
              ],
            },
            {
              name: "testimonials",
              type: "relationship",
              relationTo: "testimonials",
              hasMany: true,
              maxRows: 4,
            },
            {
              name: "finalCTA",
              type: "group",
              fields: [
                { name: "heading", type: "text" },
                { name: "supportingText", type: "textarea" },
                ...linkFields,
              ],
            },
          ],
        },
        {
          label: "Visibility",
          fields: [
            {
              name: "sectionVisibility",
              type: "group",
              fields: [
                { name: "statistics", type: "checkbox", defaultValue: true },
                { name: "projects", type: "checkbox", defaultValue: true },
                { name: "services", type: "checkbox", defaultValue: true },
                { name: "why", type: "checkbox", defaultValue: true },
                { name: "process", type: "checkbox", defaultValue: true },
                { name: "sectors", type: "checkbox", defaultValue: true },
                { name: "testimonials", type: "checkbox", defaultValue: true },
              ],
            },
          ],
        },
        {
          label: "SEO",
          fields: [seoFields],
        },
      ],
    },
  ],
};
