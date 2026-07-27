import type { CollectionConfig } from "payload";
import {
  authenticatedField,
  contentManagersOnly,
  publicVisibleOrContentManager,
} from "@/src/access";
import { createCollectionRevalidation } from "@/src/hooks/revalidate";

const revalidation = createCollectionRevalidation(["/quality-safety"]);

const publicWhenApproved = ({
  req,
  siblingData,
}: {
  req: { user?: unknown };
  siblingData?: { showDetailsPublicly?: boolean };
}) => Boolean(req.user) || siblingData?.showDetailsPublicly === true;

export const Certifications: CollectionConfig = {
  slug: "certifications",
  labels: { singular: "Certification", plural: "Certifications" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: [
      "name",
      "issuingAuthority",
      "expiryDate",
      "publiclyVisible",
      "updatedAt",
    ],
  },
  defaultSort: "displayOrder",
  access: {
    read: publicVisibleOrContentManager,
    create: contentManagersOnly,
    update: contentManagersOnly,
    delete: contentManagersOnly,
  },
  hooks: {
    afterChange: [revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  fields: [
    { name: "name", label: "Certification or registration name", type: "text", required: true },
    { name: "issuingAuthority", type: "text" },
    {
      name: "registrationNumber",
      type: "text",
      access: {
        read: publicWhenApproved,
        create: authenticatedField,
        update: authenticatedField,
      },
    },
    {
      type: "row",
      fields: [
        { name: "issueDate", type: "date" },
        { name: "expiryDate", type: "date" },
      ],
    },
    {
      name: "document",
      type: "upload",
      relationTo: "media",
      access: { read: publicWhenApproved },
    },
    { name: "logo", type: "upload", relationTo: "media" },
    {
      name: "showDetailsPublicly",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Controls whether the registration number and document may be public.",
      },
    },
    {
      name: "publiclyVisible",
      type: "checkbox",
      defaultValue: false,
      index: true,
    },
    { name: "displayOrder", type: "number", defaultValue: 0, index: true },
    { name: "notes", type: "textarea", access: { read: authenticatedField } },
  ],
};
