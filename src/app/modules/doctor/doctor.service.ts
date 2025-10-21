import httpStatus from "http-status-codes";
import { envVariable } from "../../config/envConfig";
import { uploadToCloudinary } from "../../utils/fileUpload/cloudinary";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";
import { Doctor, Prisma, UserRole } from "@prisma/client";
import { IPaginationOptions } from "../../utils/pagination/pagination.interface";
import pagination from "../../utils/pagination/pagination";
import {
  doctorFilterableFields,
  doctorSearchableFields,
} from "./doctor.constant";
import { IDoctorUpdate } from "./doctor.interface";
import AppError from "../../errors/AppError";
import { openai } from "../../utils/ai/openRouter";
import { parseAiDoctorResponse } from "../../utils/ai/parseAiResponse";


const createDoctor = async (
  password: string,
  payload: Doctor,
  file?: Express.Multer.File
) => {
  // const isAccountExists = await prisma.user.findFirst({
  //   where: {
  //     email: payload.email,
  //   },
  // });

  // if (isAccountExists) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "The email already used");
  // }

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
        role: UserRole.DOCTOR,
      },
    });

    return await tnx.doctor.create({
      data: payload,
    });
  });

  return result;
};

type TDoctorFilterableField = (typeof doctorFilterableFields)[number];

const getAllDoctors = async (
  queryOptions: Record<TDoctorFilterableField, string>,
  paginationOptions: IPaginationOptions
) => {
  const { skip, limit, sortBy, orderBy, page } = pagination(paginationOptions);
  const { searchTerm, specialties, ...filterData } = queryOptions;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((key) => ({
        [key]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: { contains: specialties, mode: "insensitive" },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({ [key]: filterData[key] })),
    });
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: orderBy,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({ where: whereConditions });
  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const updateDoctor = async (
  userId: string,
  payload: Partial<IDoctorUpdate>
) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      doctor: {
        select: {
          id: true,
        },
      },
    },
  });

  const doctrorId = userInfo.doctor?.id as string;

  const { doctorSpecialties, ...doctorUpdateData } = payload;

  return prisma.$transaction(async (tnx) => {
    if (doctorSpecialties && doctorSpecialties.length > 0) {
      const deleteSpecialtiesIds = doctorSpecialties?.filter(
        (specialty) => specialty.isDeleted
      );

      if (deleteSpecialtiesIds.length > 0) {
        for (const specialtiesId of deleteSpecialtiesIds) {
          await tnx.doctorSpecialties.delete({
            where: {
              specialtiesId_doctorId: {
                doctorId: doctrorId,
                specialtiesId: specialtiesId.specialtiesId,
              },
            },
          });
        }
      }
      const insertSpecialtiesIds = doctorSpecialties.filter(
        (specialty) => !specialty.isDeleted
      );

      if (insertSpecialtiesIds.length > 0) {
        for (const specialties of insertSpecialtiesIds) {
          await tnx.doctorSpecialties.create({
            data: {
              doctorId: doctrorId,
              specialtiesId: specialties.specialtiesId,
            },
          });
        }
      }
    }

    const result = await tnx.doctor.update({
      where: { id: doctrorId },
      data: doctorUpdateData,
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });
    return result;
  });
};

const getAiSuggestion = async (payload: { syntoms: string }) => {
  if (!payload || !payload.syntoms) {
    throw new AppError(httpStatus.BAD_REQUEST, "No syntoms found");
  }

  const doctors = await prisma.doctor.findMany({
    where: { isDeleted: false },
    include: {
      doctorSpecialties: {
        include: { specialties: true },
      },
    },
  });

  const prompt = `
You are an AI medical assistant.
The user reports these symptoms: "${payload.syntoms}".

Available doctor list in JSON :
${JSON.stringify(doctors, null, 2)}

Your Return your response in JSON with full individual doctor data`;
  console.log("Anylyzing.....");
  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-4.5-air:free",
    messages: [
      {
        role: "system",
        content:
          "You are an AI medical assistant that provide doctor suggestion",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  const aiResponse = completion.choices[0].message;
  const suggestedDoctor = parseAiDoctorResponse(
    aiResponse as { content: string }
  );

  return suggestedDoctor;
};

export const DoctorService = {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  getAiSuggestion,
};
