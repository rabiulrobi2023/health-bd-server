import httpStatus from 'http-status-codes';
import { envVariable } from '../../config/envConfig';
import { uploadToCloudinary } from '../../utils/fileUpload/cloudinary';
import { prisma } from '../../utils/prisma';
import bcrypt from 'bcrypt';
import { DoctorSpecialties, Prisma, UserRole } from '@prisma/client';
import { IPaginationOptions } from '../../utils/pagination/pagination.interface';
import pagination from '../../utils/pagination/pagination';
import { doctorFilterableFields, doctorSearchableFields } from './doctor.constant';

import AppError from '../../errors/AppError';
import { openai } from '../../utils/ai/openRouter';
import { parseAiDoctorResponse } from '../../utils/ai/parseAiResponse';

import { IDoctorCreatePayload, IDoctorUpdatePayload } from './doctor.interface';

const createDoctor = async (
  { specialties, ...doctorData }: IDoctorCreatePayload,
  file?: Express.Multer.File
) => {
  if (file) {
    const uploadedImage = await uploadToCloudinary(file);

    doctorData.profilePhoto = uploadedImage.secure_url;
  }

  const hashPassword = await bcrypt.hash(
    envVariable.DEFAULT_PASSWORD,
    Number(envVariable.BCRIPT_SALT_ROUND)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: doctorData.email,
        password: hashPassword,
        role: UserRole.DOCTOR,
      },
    });

    const createDoctor = await tnx.doctor.create({
      data: doctorData,
    });

    if (specialties && Array.isArray(specialties) && specialties.length > 0) {
      const existingSpecialties = await tnx.specialties.findMany({
        where: {
          id: {
            in: specialties,
          },
        },
      });

      const existingSpecialtiesIds = existingSpecialties.map((specialty) => specialty.id);
      const invalidSpecialties = existingSpecialtiesIds.filter(
        (specialtyId) => !specialties.includes(specialtyId)
      );

      if (invalidSpecialties.length > 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Invalid specialties ids: ${invalidSpecialties.join(', ')}`
        );
      }

      // const doctorSpecialtiesData: Prisma.DoctorSpecialtiesCreateManyInput[] = specialties.map(
      //   (specialtyId) => ({
      //     doctorId: createDoctor.id,
      //     specialtiesId: specialtyId,
      //   })
      // );

      //Or

      const doctorSpecialtesData = specialties.map(
        (specialtyId: string): DoctorSpecialties => ({
          doctorId: createDoctor.id,
          specialtiesId: specialtyId,
        })
      );

      await tnx.doctorSpecialties.createMany({ data: doctorSpecialtesData });
    }

    const doctorWithSpecialties = await tnx.doctor.findUnique({
      where: {
        id: createDoctor.id,
      },
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });
    return doctorWithSpecialties;
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
        [key]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: { contains: specialties, mode: 'insensitive' },
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
      review: {
        select: {
          comment: true,
          rating: true,
          patient: {
            select: {
              name: true,
            },
          },
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

const getSingleDoctor = async (id: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
    include: {
      doctorSchedules: {
        include: { schedule: true },
      },
      review: {
        select: {
          comment: true,
          rating: true,
          patient: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const updateDoctor = async (
  id: string,
  { specialties, removeSpecialties, ...doctorData }: Partial<IDoctorUpdatePayload>
) => {
  const isDoctorExists = await prisma.doctor.findUniqueOrThrow({
    where: { id: id },
  });

  const result = await prisma.$transaction(async (tnx) => {
    if (Object.keys(doctorData).length > 0) {
      await tnx.doctor.update({
        where: {
          id: id,
        },
        data: doctorData,
      });
    }

    if (removeSpecialties && Array.isArray(removeSpecialties) && removeSpecialties.length > 0) {
      const existingDoctorSpecialties = await tnx.doctorSpecialties.findMany({
        where: {
          doctorId: id,
          specialtiesId: {
            in: removeSpecialties,
          },
        },
      });

      if (removeSpecialties.length != existingDoctorSpecialties.length) {
        const foundSpecialtiesIds = existingDoctorSpecialties.map(
          (specialtiesId) => specialtiesId.specialtiesId
        );
        const notfoundSpecialtesIds = removeSpecialties.filter(
          (specialteisId) => !foundSpecialtiesIds.includes(specialteisId)
        );
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Cannot remove non-existent specialties: ${notfoundSpecialtesIds.join(', ')}`
        );
      }
      await tnx.doctorSpecialties.deleteMany({
        where: { doctorId: id, specialtiesId: { in: removeSpecialties } },
      });
    }

    if (specialties && Array.isArray(specialties) && specialties.length > 0) {
      const existingSpecialties = await tnx.specialties.findMany({
        where: {
          id: { in: specialties },
        },
        select: { id: true },
      });

      const existingSpecialtiesIds = existingSpecialties.map((id) => id.id);
      const invalidSpecialtiesIds = specialties.filter(
        (id) => !existingSpecialtiesIds.includes(id)
      );

      if (invalidSpecialtiesIds.length > 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Invalid specialties ids: ${invalidSpecialtiesIds}`
        );
      }

      const currentDoctorSpecialties = await tnx.doctorSpecialties.findMany({
        where: { doctorId: doctorData.id, specialtiesId: { in: specialties } },
        select: { specialtiesId: true },
      });
      const currentSpecialtiesIds = currentDoctorSpecialties.map((id) => id.specialtiesId);
      const newSpecialtiesIds = specialties.filter((id) => !currentSpecialtiesIds.includes(id));
      if (newSpecialtiesIds.length > 0) {
        const doctorSpecialtiesData = newSpecialtiesIds.map(
          (id): DoctorSpecialties => ({ doctorId: isDoctorExists.id, specialtiesId: id })
        );

        await tnx.doctorSpecialties.createMany({ data: doctorSpecialtiesData });
      }
    }
    return await tnx.doctor.findUnique({
      where: { id: isDoctorExists.id },
      include: { doctorSpecialties: { include: { specialties: true } } },
    });
  });
  return result;
};

// const updateDoctor = async (doctorId: string, payload: Partial<IDoctorPayload>) => {
//   const { doctorSpecialties, ...doctorUpdateData } = payload;

//   return prisma.$transaction(async (tnx) => {
//     if (doctorSpecialties && doctorSpecialties.length > 0) {
//       const deleteSpecialtiesIds = doctorSpecialties?.filter((specialty) => specialty.isDeleted);

//       if (deleteSpecialtiesIds.length > 0) {
//         for (const specialtiesId of deleteSpecialtiesIds) {
//           await tnx.doctorSpecialties.delete({
//             where: {
//               specialtiesId_doctorId: {
//                 doctorId: doctorId,
//                 specialtiesId: specialtiesId.specialtiesId,
//               },
//             },
//           });
//         }
//       }
//       const insertSpecialtiesIds = doctorSpecialties.filter((specialty) => !specialty.isDeleted);

//       if (insertSpecialtiesIds.length > 0) {
//         for (const specialties of insertSpecialtiesIds) {
//           await tnx.doctorSpecialties.create({
//             data: {
//               doctorId: doctorId,
//               specialtiesId: specialties.specialtiesId,
//             },
//           });
//         }
//       }
//     }

//     const result = await tnx.doctor.update({
//       where: { id: doctorId },
//       data: doctorUpdateData,
//       include: {
//         doctorSpecialties: {
//           include: {
//             specialties: true,
//           },
//         },
//       },
//     });

//     return result;
//   });
// };

const getAiSuggestion = async (payload: { syntoms: string }) => {
  if (!payload || !payload.syntoms) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No syntoms found');
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

  const completion = await openai.chat.completions.create({
    model: 'z-ai/glm-4.5-air:free',
    messages: [
      {
        role: 'system',
        content: 'You are an AI medical assistant that provide doctor suggestion',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
  const aiResponse = completion.choices[0].message;
  const suggestedDoctor = parseAiDoctorResponse(aiResponse as { content: string });

  return suggestedDoctor;
};

const deleteDoctor = async (id: string) => {
  const doctorInfo = await prisma.doctor.findFirstOrThrow({
    where: { id: id },
    include: {
      user: true,
    },
  });
  const userId = doctorInfo.user.id;
  await prisma.$transaction(async (tnx) => {
    await tnx.doctor.delete({ where: { id: id } });

    const result = await tnx.user.delete({ where: { id: userId } });
    return result;
  });
};

const softDeleteDoctor = async (id: string) => {
  const result = await prisma.doctor.update({
    where: { id, isDeleted: false },
    data: { isDeleted: true },
  });
  return result;
};

export const DoctorService = {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  getAiSuggestion,
  getSingleDoctor,
  softDeleteDoctor,
  deleteDoctor,
};
