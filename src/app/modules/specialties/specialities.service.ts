import { uploadToCloudinary } from "../../utils/fileUpload/cloudinary";
import { prisma } from "../../utils/prisma";
import { ISpecialties } from "./specialties.interface";

const createSpecialties = async (
  payload: ISpecialties,
  file?: Express.Multer.File
) => {

  if (file) {
    const uploadedImage = await uploadToCloudinary(file);
    payload.icon = uploadedImage.secure_url;
  }
  const result = await prisma.specialties.create({
    data: payload,
  });
  return result;
};

const getAllSpecialties = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};

const deleteSpecialties = async (id: string) => {
  await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return null;
};

export const SpecialtiesService = {
  createSpecialties,
  getAllSpecialties,
  deleteSpecialties,
};
