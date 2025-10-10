import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prisma";
import { ILogin } from "./auth.interface";

import { Status } from "../user/user.constant";
import { generateToken } from "../../utils/generateToken";
import { envVariable } from "../../config/envConfig";

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

  if (isUserExists.status === Status.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "The account is blocked");
  }
  if (isUserExists.status === Status.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "The account is inactive");
  }
  if (isUserExists.status === Status.DELETED) {
    throw new AppError(httpStatus.BAD_REQUEST, "The account is deleted");
  }
  if (!isCorrectPass) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
  const jwtPayload = {
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
    user: isUserExists,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const AuthService = {
  credentialLogin,
};
