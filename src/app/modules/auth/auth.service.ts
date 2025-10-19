import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prisma";
import { ILogin } from "./auth.interface";

import { generateToken } from "../../utils/jwt/generateToken";
import { envVariable } from "../../config/envConfig";
import { UserStatus } from "@prisma/client";

const credentialLogin = async (palyload: ILogin) => {
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: palyload.email,
    },
  });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const isCorrectPass = await bcrypt.compare(
    palyload.password,
    isUserExists.password
  );

  if (isUserExists.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "The account is blocked");
  }
  if (isUserExists.status === UserStatus.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "The account is inactive");
  }
  if (isUserExists.status === UserStatus.DELETED) {
    throw new AppError(httpStatus.BAD_REQUEST, "The account is deleted");
  }
  if (!isCorrectPass) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
  const jwtPayload = {
    id: isUserExists.id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = await generateToken(
    jwtPayload,
    envVariable.JWT_ACCESS_SECRET,
    envVariable.JWT_ACCESS_EXPIRE
  );

  const refreshToken = await generateToken(
    jwtPayload,
    envVariable.JWT_REFRESH_SECRET,
    envVariable.JWT_REFRESH_EXPIRE
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: isUserExists.needPasswordChange,
  };
};

export const AuthService = {
  credentialLogin,
};
