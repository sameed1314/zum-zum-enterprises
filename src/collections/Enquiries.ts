import type { CollectionConfig } from "payload";
import {
  canManageEnquiriesUser,
  enquiryManagersOnly,
  isSuperAdminUser,
} from "@/src/access";

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  labels: { singular: "Enquiry", plural: "Enquiries" },
  admin: {
    group: "Communication",
    useAsTitle: "fullName",
    defaultColumns: [
      "reference",
      "fullName",
      "phone",
      "projectType",
      "status",
      "priority",
      "createdAt",
    ],
    hidden: ({ user }) => !canManageEnquiriesUser(user),
  },
  defaultSort: "-createdAt",
  access: {
    create: () => false,
    read: enquiryManagersOnly,
    update: enquiryManagersOnly,
    delete: ({ req }) => isSuperAdminUser(req.user),
  },
  fields: [
    {
      name: "reference",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true, position: "sidebar" },
    },
    { name: "fullName", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "phone", type: "text", required: true },
        { name: "email", type: "email" },
      ],
    },
    { name: "organisation", label: "Company or organisation", type: "text" },
    {
      type: "row",
      fields: [
        { name: "projectType", type: "text", required: true },
        { name: "projectLocation", type: "text" },
        { name: "district", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "estimatedBudget", type: "text" },
        { name: "expectedStartDate", type: "date" },
      ],
    },
    { name: "message", label: "Enquiry message", type: "textarea", required: true },
    { name: "sourcePage", type: "text" },
    { name: "relatedProject", type: "relationship", relationTo: "projects" },
    { name: "relatedService", type: "relationship", relationTo: "services" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      index: true,
      options: [
        "new",
        "contacted",
        "site-visit-planned",
        "proposal-in-progress",
        "proposal-sent",
        "won",
        "lost",
        "closed",
        "spam",
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "assignedAdministrator",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
    },
    {
      name: "priority",
      type: "select",
      defaultValue: "normal",
      index: true,
      options: ["low", "normal", "high", "urgent"],
      admin: { position: "sidebar" },
    },
    {
      name: "internalNotes",
      type: "textarea",
      access: {
        read: ({ req }) => canManageEnquiriesUser(req.user),
        update: ({ req }) => canManageEnquiriesUser(req.user),
      },
    },
    { name: "lastContactedAt", type: "date" },
    { name: "consentConfirmed", type: "checkbox", required: true },
    {
      name: "tracking",
      type: "group",
      fields: [
        { name: "utmSource", type: "text" },
        { name: "utmMedium", type: "text" },
        { name: "utmCampaign", type: "text" },
        { name: "utmTerm", type: "text" },
        { name: "utmContent", type: "text" },
        { name: "referrer", type: "text" },
      ],
    },
    {
      name: "emailNotificationStatus",
      type: "select",
      defaultValue: "pending",
      options: ["pending", "sent", "failed", "skipped"],
      admin: { readOnly: true, position: "sidebar" },
    },
  ],
};
