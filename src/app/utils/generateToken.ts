import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

export const generateToken = async (
  payload: JwtPayload,
  secret: Secret,
  expireIn: string
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expireIn,
  } as SignOptions);
  return token;
};
