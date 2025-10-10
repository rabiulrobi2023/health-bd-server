import { envVariable } from "../../config/envConfig";
import { uploadToCloudinary } from "../../utils/fileUpload/cloudinary";
import { prisma } from "../../utils/prisma";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";

const createPatient = async (payload: IUser, file?: Express.Multer.File) => {
  if (file) {
    const uploadedImage = await uploadToCloudinary(file);
    payload.profilePhoto = uploadedImage.secure_url;
  }

  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(envVariable.BCRIPT_SALT_ROUND)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: {
        name: payload.name,
        email: payload.email,
        contactNumber: payload.contactNumber,
        gender: payload.gender,
        profilePhoto: payload.profilePhoto,
      },
    });
  });
  return result;
};

export const UserService = {
  createPatient,
};
