import { Response } from "express";
import { envVariable } from "../../config/envConfig";
import { nodeEnv } from "../../constant/constant";

const setCookie = (
  res: Response,
  cookieName: string,
  value: string,
  age: number
) => {
  return res.cookie(cookieName, value, {
    httpOnly: true,
    secure: envVariable.NODE_ENV === nodeEnv.PRODUCTION,
    sameSite: "none",
    maxAge: age,
  });
};
export default setCookie;
