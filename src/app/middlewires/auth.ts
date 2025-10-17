import httpStatus from "http-status-codes";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import { envVariable } from "../config/envConfig";
import { verifyToken } from "../utils/jwt/verifyToken";
import { UserRole } from "@prisma/client";

const auth = (...roles: UserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new AppError(httpStatus.NOT_FOUND, "Token not found");
    }

    const verifedUser = verifyToken(token, envVariable.JWT_ACCESS_SECRET);
    req.user = verifedUser;

    if (roles.length && !roles.includes(verifedUser.role)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Unauthorized user");
    }
    next();
  });
};

export default auth;
