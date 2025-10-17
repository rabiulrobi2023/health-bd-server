import { UserRole, UserStatus } from "@prisma/client";

export const filterableUserFields = ["searchTerm", "email", "role", "status"];
export const userSearchableFields = ["email"];
export const roleArr = Object.keys(UserRole);
export const statusArr = Object.keys(UserStatus);
