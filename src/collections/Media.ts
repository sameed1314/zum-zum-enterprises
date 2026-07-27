import type { CollectionConfig } from "payload";
import { contentManagersOnly } from "@/src/access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Media Asset", plural: "Media Library" },
  admin: {
    group: "Assets",
    useAsTitle: "title",
    defaultColumns: ["filename", "title", "alt", "category", "updatedAt"],
  },
  access: {
    read: () => true,
    create: contentManagersOnly,
    update: contentManagersOnly,
    delete: contentManagersOnly,
  },
  upload: {
    staticDir: "media",
    focalPoint: true,
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "application/pdf",
    ],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 576, position: "centre" },
      { name: "gallery", width: 1280, height: 960, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image for visitors using assistive technology." },
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "textarea",
    },
    {
      name: "photographer",
      label: "Photographer or source",
      type: "text",
    },
    {
      name: "project",
      type: "relationship",
      relationTo: "projects",
      index: true,
    },
    {
      name: "category",
      type: "select",
      options: [
        "Project",
        "Company",
        "Team",
        "Certification",
        "Website",
        "Document",
      ],
    },
    {
      name: "internalNotes",
      type: "textarea",
      access: { read: ({ req }) => Boolean(req.user) },
    },
  ],
};
