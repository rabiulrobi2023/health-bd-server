import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  email: string;
  password: string;
  role: UserRole;
  needPasswordChange: boolean;
  status: UserStatus;
}
