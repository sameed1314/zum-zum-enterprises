import type { GlobalConfig } from "payload";
import {
  authenticatedField,
  isSuperAdminUser,
} from "@/src/access";
import { editorialVersions, linkFields, seoFields } from "@/src/fields/shared";
import { createGlobalRevalidation } from "@/src/hooks/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: { group: "Website" },
  access: {
    read: () => true,
    update: ({ req }) => isSuperAdminUser(req.user),
  },
  versions: editorialVersions,
  hooks: {
    afterChange: [
      createGlobalRevalidation([
        "/",
        "/about",
        "/projects",
        "/services",
        "/capabilities",
        "/quality-safety",
        "/contact",
        "/sitemap.xml",
        "/robots.txt",
      ]),
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Company",
          fields: [
            {
              type: "row",
              fields: [
                { name: "fullCompanyName", type: "text", required: true },
                { name: "shortCompanyName", type: "text", required: true },
              ],
            },
            { name: "tagline", type: "text", required: true },
            { name: "companyDescription", type: "textarea", required: true },
            { name: "contractorClassification", type: "text", required: true },
            {
              type: "row",
              fields: [
                { name: "logo", type: "upload", relationTo: "media" },
                { name: "alternateLogo", type: "upload", relationTo: "media" },
                { name: "favicon", type: "upload", relationTo: "media" },
              ],
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "phoneNumbers",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "number", type: "text", required: true },
              ],
            },
            { name: "whatsappNumber", type: "text" },
            {
              name: "emailAddresses",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "email", type: "email", required: true },
              ],
            },
            { name: "officeAddress", type: "textarea" },
            { name: "googleMapsURL", type: "text" },
            { name: "businessHours", type: "text" },
            {
              name: "socialLinks",
              type: "array",
              fields: [
                { name: "platform", type: "text", required: true },
                { name: "url", type: "text", required: true },
              ],
            },
            {
              name: "enquiryNotificationEmail",
              type: "email",
              access: {
                read: authenticatedField,
                update: authenticatedField,
              },
            },
          ],
        },
        {
          label: "Registration",
          fields: [
            {
              name: "registrationDetails",
              type: "group",
              fields: [
                { name: "contractorRegistration", type: "text" },
                { name: "gstNumber", type: "text" },
                {
                  name: "displayPublicly",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    description: "Enable only after details have been verified and approved.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Navigation",
          fields: [
            {
              name: "navigation",
              type: "array",
              maxRows: 10,
              fields: [
                ...linkFields,
                { name: "visible", type: "checkbox", defaultValue: true },
              ],
            },
            {
              name: "primaryCTA",
              type: "group",
              fields: linkFields,
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            { name: "footerDescription", type: "textarea" },
            {
              name: "footerNavigationGroups",
              type: "array",
              maxRows: 5,
              fields: [
                { name: "label", type: "text", required: true },
                {
                  name: "links",
                  type: "array",
                  fields: linkFields,
                },
              ],
            },
            {
              name: "footerCTA",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text" },
                { name: "heading", type: "text" },
                ...linkFields,
              ],
            },
            { name: "copyrightText", type: "text" },
            { name: "footerRegistrationText", type: "text" },
          ],
        },
        {
          label: "Announcement",
          fields: [
            {
              name: "announcement",
              type: "group",
              fields: [
                { name: "visible", type: "checkbox", defaultValue: false },
                { name: "message", type: "text" },
                { name: "url", type: "text" },
              ],
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            seoFields,
            {
              name: "productionURL",
              type: "text",
              required: true,
              admin: { description: "Canonical public website origin, without a trailing slash." },
            },
          ],
        },
      ],
    },
  ],
};
