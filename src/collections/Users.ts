import type {
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionConfig,
} from "payload";
import {
  getUserRole,
  isSuperAdminUser,
  superAdminField,
  userRoles,
} from "@/src/access";

const protectFinalSuperAdmin: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation === "create") {
    const existingUsers = await req.payload.count({
      collection: "users",
      overrideAccess: true,
    });
    if (existingUsers.totalDocs === 0) return { ...data, role: "super-admin", active: true };
    return data;
  }

  if (
    originalDoc?.role === "super-admin" &&
    (data?.role !== "super-admin" || data?.active === false)
  ) {
    const remaining = await req.payload.count({
      collection: "users",
      overrideAccess: true,
      where: {
        and: [
          { role: { equals: "super-admin" } },
          { active: { equals: true } },
          { id: { not_equals: originalDoc.id } },
        ],
      },
    });
    if (remaining.totalDocs === 0) {
      throw new Error("The final active super administrator cannot be demoted or disabled.");
    }
  }
  return data;
};

const preventFinalSuperAdminDeletion: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const user = await req.payload.findByID({
    collection: "users",
    id,
    overrideAccess: true,
  });
  if (user.role !== "super-admin" || user.active === false) return;

  const remaining = await req.payload.count({
    collection: "users",
    overrideAccess: true,
    where: {
      and: [
        { role: { equals: "super-admin" } },
        { active: { equals: true } },
        { id: { not_equals: id } },
      ],
    },
  });
  if (remaining.totalDocs === 0) {
    throw new Error("The final active super administrator cannot be deleted.");
  }
};

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Administrator", plural: "Administrators" },
  admin: {
    group: "Administration",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "active", "updatedAt"],
    hidden: ({ user }) => !isSuperAdminUser(user),
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 2 * 60 * 60,
  },
  access: {
    create: ({ req }) => isSuperAdminUser(req.user),
    read: ({ req }) => {
      if (isSuperAdminUser(req.user)) return true;
      const user = req.user as { id?: number | string } | null;
      return user?.id ? { id: { equals: user.id } } : false;
    },
    update: ({ req }) => {
      if (isSuperAdminUser(req.user)) return true;
      const user = req.user as { id?: number | string } | null;
      return user?.id ? { id: { equals: user.id } } : false;
    },
    delete: ({ req }) => isSuperAdminUser(req.user),
  },
  hooks: {
    beforeChange: [protectFinalSuperAdmin],
    beforeDelete: [preventFinalSuperAdminDeletion],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: userRoles.map((role) => ({
        label: role
          .split("-")
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(" "),
        value: role,
      })),
      access: {
        create: superAdminField,
        read: ({ req }) =>
          isSuperAdminUser(req.user) ||
          getUserRole(req.user) === "editor" ||
          getUserRole(req.user) === "enquiry-manager",
        update: superAdminField,
      },
      admin: { position: "sidebar" },
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      access: {
        create: superAdminField,
        update: superAdminField,
      },
      admin: { position: "sidebar" },
    },
    {
      name: "profileImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "lastLoginAt",
      type: "date",
      access: {
        create: () => false,
        update: () => false,
      },
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
  ],
};
