import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { contentManagersOnly, publicOrContentManager } from "@/src/access";
import { editorialVersions, seoFields, slugField } from "@/src/fields/shared";
import { createCollectionRevalidation } from "@/src/hooks/revalidate";

const revalidation = createCollectionRevalidation(
  ["/", "/projects", "/services", "/sitemap.xml"],
  "/projects",
);

const setPublishedAt: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (data?._status === "published" && !data.publishedAt && !originalDoc?.publishedAt) {
    return { ...data, publishedAt: new Date().toISOString() };
  }
  return data;
};

const previewURL = (slug?: string | null) => {
  if (!slug) return null;
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  return `${serverURL}/api/preview?path=${encodeURIComponent(`/projects/${slug}`)}`;
};

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "category",
      "location",
      "status",
      "_status",
      "featured",
      "updatedAt",
    ],
    preview: ({ slug }) => previewURL(typeof slug === "string" ? slug : null),
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
    beforeChange: [setPublishedAt],
    afterChange: [revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Project",
          fields: [
            {
              type: "row",
              fields: [
                { name: "title", type: "text", required: true },
                slugField("title"),
              ],
            },
            { name: "shortSummary", type: "textarea", required: true, maxLength: 260 },
            {
              type: "row",
              fields: [
                {
                  name: "category",
                  type: "relationship",
                  relationTo: "project-categories",
                  required: true,
                  index: true,
                },
                { name: "location", type: "text", required: true, index: true },
                { name: "district", type: "text" },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "year", type: "text" },
                {
                  name: "status",
                  type: "select",
                  enumName: "enum_projects_project_status",
                  required: true,
                  defaultValue: "completed",
                  index: true,
                  options: [
                    { label: "Ongoing", value: "ongoing" },
                    { label: "Completed", value: "completed" },
                    { label: "Upcoming", value: "upcoming" },
                  ],
                },
                { name: "clientType", type: "text" },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "featured",
                  type: "checkbox",
                  defaultValue: false,
                  index: true,
                  admin: { position: "sidebar" },
                },
                {
                  name: "displayOrder",
                  type: "number",
                  defaultValue: 0,
                  index: true,
                  admin: { position: "sidebar" },
                },
                {
                  name: "publishedAt",
                  type: "date",
                  index: true,
                  admin: { position: "sidebar", readOnly: true },
                },
              ],
            },
          ],
        },
        {
          label: "Delivery Details",
          fields: [
            { name: "scopeOfWork", type: "textarea" },
            {
              type: "row",
              fields: [
                { name: "contractType", type: "text" },
                { name: "builtUpArea", type: "text" },
                { name: "duration", type: "text" },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "startDate", type: "date" },
                { name: "completionDate", type: "date" },
              ],
            },
            {
              name: "projectValue",
              type: "group",
              fields: [
                { name: "value", type: "text" },
                {
                  name: "displayPublicly",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    description: "Enable only after the company has approved public disclosure.",
                  },
                },
              ],
            },
            { name: "architectConsultant", type: "text" },
            { name: "executionResponsibilities", type: "textarea" },
            {
              name: "materials",
              type: "array",
              fields: [{ name: "name", type: "text", required: true }],
            },
            {
              name: "constructionMethods",
              type: "array",
              fields: [{ name: "name", type: "text", required: true }],
            },
            { name: "qualityControl", type: "textarea" },
            { name: "safetyInformation", type: "textarea" },
          ],
        },
        {
          label: "Project Story",
          fields: [
            { name: "overview", type: "richText", required: true },
            { name: "challenge", type: "richText" },
            { name: "executionApproach", type: "richText" },
            { name: "outcome", type: "richText" },
            { name: "qualityAndSafety", type: "richText" },
            { name: "additionalNotes", type: "richText" },
          ],
        },
        {
          label: "Media",
          fields: [
            { name: "coverImage", type: "upload", relationTo: "media", required: true },
            { name: "heroImage", type: "upload", relationTo: "media" },
            {
              name: "gallery",
              type: "array",
              admin: { description: "Drag rows to control gallery order." },
              fields: [
                { name: "media", type: "upload", relationTo: "media", required: true },
                { name: "caption", type: "text" },
                { name: "altOverride", type: "text" },
                { name: "displayOrder", type: "number", defaultValue: 0 },
                {
                  name: "layout",
                  type: "select",
                  defaultValue: "standard",
                  options: ["standard", "wide", "portrait"],
                },
              ],
            },
            {
              name: "beforeAfter",
              type: "array",
              maxRows: 4,
              fields: [
                { name: "before", type: "upload", relationTo: "media", required: true },
                { name: "after", type: "upload", relationTo: "media", required: true },
                { name: "caption", type: "text" },
              ],
            },
            {
              name: "documents",
              type: "relationship",
              relationTo: "media",
              hasMany: true,
            },
          ],
        },
        {
          label: "Relationships",
          fields: [
            {
              name: "services",
              type: "relationship",
              relationTo: "services",
              hasMany: true,
            },
            {
              name: "sectors",
              type: "relationship",
              relationTo: "sectors",
              hasMany: true,
            },
            {
              name: "relatedProjects",
              type: "relationship",
              relationTo: "projects",
              hasMany: true,
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
