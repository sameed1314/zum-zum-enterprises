import type { GlobalConfig } from "payload";
import { contentManagersOnly } from "@/src/access";
import { editorialVersions, linkFields, seoFields } from "@/src/fields/shared";
import { createGlobalRevalidation } from "@/src/hooks/revalidate";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Page",
  admin: { group: "Website" },
  access: { read: () => true, update: contentManagersOnly },
  versions: editorialVersions,
  hooks: { afterChange: [createGlobalRevalidation(["/about"])] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", required: true },
                { name: "heading", type: "text", required: true },
                { name: "introduction", type: "textarea", required: true },
                { name: "image", type: "upload", relationTo: "media" },
              ],
            },
            { name: "companyIntroduction", type: "richText", required: true },
            { name: "history", type: "richText" },
            { name: "mission", type: "richText" },
            { name: "vision", type: "richText" },
            {
              name: "values",
              type: "array",
              fields: [
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea", required: true },
              ],
            },
            { name: "leadershipContent", type: "richText" },
            {
              name: "timeline",
              type: "array",
              fields: [
                { name: "year", type: "text", required: true },
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea" },
              ],
            },
            { name: "regionalExperience", type: "richText" },
            { name: "qualityCommitment", type: "richText" },
            { name: "safetyCommitment", type: "richText" },
            {
              name: "teamImages",
              type: "relationship",
              relationTo: "media",
              hasMany: true,
            },
            { name: "cta", type: "group", fields: linkFields },
          ],
        },
        { label: "SEO", fields: [seoFields] },
      ],
    },
  ],
};
