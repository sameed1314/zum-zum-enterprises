import type { Field } from "payload";
import { slugify } from "@/src/lib/slug";

export const slugField = (sourceField = "title"): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    description: "URL-safe identifier. It is generated automatically but can be edited.",
    position: "sidebar",
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc, value }) => {
        const source = data?.[sourceField] ?? originalDoc?.[sourceField];
        const candidate =
          typeof value === "string" && value.trim()
            ? value
            : typeof source === "string"
              ? source
              : "";
        return slugify(candidate);
      },
    ],
  },
});

export const seoFields: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  admin: {
    description: "Optional overrides. Site defaults are used when fields are empty.",
  },
  fields: [
    {
      name: "title",
      type: "text",
      maxLength: 70,
      admin: { description: "Aim for 50–60 characters." },
    },
    {
      name: "description",
      type: "textarea",
      maxLength: 180,
      admin: { description: "Aim for 140–160 characters." },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "canonicalURL",
      type: "text",
      validate: (value: string | null | undefined) => {
        if (!value) return true;
        try {
          const url = new URL(value);
          return ["http:", "https:"].includes(url.protocol)
            ? true
            : "Canonical URL must use HTTP or HTTPS.";
        } catch {
          return "Enter a valid canonical URL.";
        }
      },
    },
    {
      name: "noIndex",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
};

export const linkFields: Field[] = [
  {
    name: "label",
    type: "text",
    required: true,
  },
  {
    name: "url",
    type: "text",
    required: true,
    validate: (value: string | null | undefined) => {
      if (!value) return "A URL is required.";
      if (value.startsWith("/") && !value.startsWith("//")) return true;
      try {
        const url = new URL(value);
        return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
          ? true
          : "Use an internal path or an approved URL scheme.";
      } catch {
        return "Enter an internal path or a valid URL.";
      }
    },
  },
  {
    name: "newTab",
    type: "checkbox",
    defaultValue: false,
  },
];

export const editorialVersions = {
  drafts: {
    autosave: {
      interval: 30_000,
    },
  },
  maxPerDoc: 25,
} as const;
