import { envVariable } from "../../config/envConfig";
import { prisma } from "../../utils/prisma";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";

const createPatient = async (payload: IUser) => {
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
      },
    });
  });
  return result;
};

export const UserService = {
  createPatient,
};
