import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prisma";
import { ILogin } from "./auth.interface";

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
  if (!isCorrectPass) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
};

export const AuthService = {
  credentialLogin,
};
