import { Response } from 'express';
import { envVariable } from '../../config/envConfig';
import { nodeEnv } from '../../constant/constant';

const setCookie = async (res: Response, cookieName: string, value: string, age: number) => {
  const result = res.cookie(cookieName, value, {
    path: '/',
    httpOnly: true,
    secure: envVariable.NODE_ENV === nodeEnv.PRODUCTION,
    sameSite: 'lax',
    maxAge: age,
  });
  return result;
};
export default setCookie;
