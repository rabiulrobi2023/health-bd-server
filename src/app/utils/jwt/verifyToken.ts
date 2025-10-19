import jwt from "jsonwebtoken";
import { IJwtPayload } from "../../modules/auth/auth.interface";

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as IJwtPayload;
};
