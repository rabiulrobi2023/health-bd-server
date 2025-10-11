import httpStatus from "http-status-codes";
import { envVariable } from "../../config/envConfig";
import AppError from "../../errors/AppError";
import { uploadToCloudinary } from "../../utils/fileUpload/cloudinary";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import { IAdmin } from "./admin.interface";


const createAdmin = async (
  password: string,
  payload: IAdmin,
  file?: Express.Multer.File
) => {
  const isAccountExists = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (isAccountExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "The email already used");
  }

  if (file) {
    const uploadedImage = await uploadToCloudinary(file);

    payload.profilePhoto = uploadedImage.secure_url;
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(envVariable.BCRIPT_SALT_ROUND)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });

    return await tnx.admin.create({
      data: payload,
    });
  });

  return result;
};

export const DoctorService = {
  createAdmin,
};
