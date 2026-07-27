import type { GlobalConfig } from "payload";
import { contentManagersOnly } from "@/src/access";
import { editorialVersions, linkFields, seoFields } from "@/src/fields/shared";
import { createGlobalRevalidation } from "@/src/hooks/revalidate";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact Page",
  admin: { group: "Website" },
  access: { read: () => true, update: contentManagersOnly },
  versions: editorialVersions,
  hooks: { afterChange: [createGlobalRevalidation(["/contact"])] },
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
            { name: "officeHeading", type: "text" },
            { name: "officeInformation", type: "richText" },
            { name: "mapEmbedURL", type: "text" },
            {
              name: "enquiryCategories",
              type: "array",
              fields: [{ name: "label", type: "text", required: true }],
            },
            { name: "formSupportingText", type: "textarea" },
            {
              name: "whatsappCTA",
              type: "group",
              fields: [
                ...linkFields,
                { name: "message", type: "textarea" },
              ],
            },
            {
              name: "faqs",
              type: "array",
              fields: [
                { name: "question", type: "text", required: true },
                { name: "answer", type: "textarea", required: true },
              ],
            },
          ],
        },
        { label: "SEO", fields: [seoFields] },
      ],
    },
  ],
};
