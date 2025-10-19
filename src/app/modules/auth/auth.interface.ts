export interface ILogin {
    email: string,
    password: string
}

import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface IJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
