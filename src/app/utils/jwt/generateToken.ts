import jwt, {  Secret, SignOptions } from "jsonwebtoken";
import { IJwtPayload } from "../../modules/auth/auth.interface";

export const generateToken = async (
  payload: IJwtPayload,
  secret: Secret,
  expireIn: string
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expireIn,
  } as SignOptions);
  return token;
};
