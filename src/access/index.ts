import type { Access, FieldAccess } from "payload";

export const userRoles = ["super-admin", "editor", "enquiry-manager"] as const;
export type UserRole = (typeof userRoles)[number];

type PayloadUser = {
  id?: number | string;
  role?: UserRole | null;
};

export function getUserRole(user: unknown): UserRole | null {
  if (!user || typeof user !== "object") return null;
  const role = (user as PayloadUser).role;
  return role && userRoles.includes(role) ? role : null;
}

export const isSuperAdminUser = (user: unknown): boolean =>
  getUserRole(user) === "super-admin";

export const canManageContentUser = (user: unknown): boolean => {
  const role = getUserRole(user);
  return role === "super-admin" || role === "editor";
};

export const canManageEnquiriesUser = (user: unknown): boolean => {
  const role = getUserRole(user);
  return role === "super-admin" || role === "enquiry-manager";
};

export const authenticated: Access = ({ req }) => Boolean(req.user);
export const superAdminOnly: Access = ({ req }) => isSuperAdminUser(req.user);
export const contentManagersOnly: Access = ({ req }) =>
  canManageContentUser(req.user);
export const enquiryManagersOnly: Access = ({ req }) =>
  canManageEnquiriesUser(req.user);

export const publicOrContentManager: Access = ({ req }) => {
  if (canManageContentUser(req.user)) return true;
  return { _status: { equals: "published" } };
};

export const publicActiveOrContentManager: Access = ({ req }) => {
  if (canManageContentUser(req.user)) return true;
  return { active: { equals: true } };
};

export const publicVisibleOrContentManager: Access = ({ req }) => {
  if (canManageContentUser(req.user)) return true;
  return { publiclyVisible: { equals: true } };
};

export const superAdminField: FieldAccess = ({ req }) =>
  isSuperAdminUser(req.user);

export const authenticatedField: FieldAccess = ({ req }) => Boolean(req.user);
