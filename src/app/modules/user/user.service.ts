import { prisma } from "../../utils/prisma";
import { IPaginationOptions } from "../../utils/pagination/pagination.interface";
import pagination from "../../utils/pagination/pagination";
import { Prisma } from "@prisma/client";
import { filterableUserFields, userSearchableFields } from "./user.constant";

type TFileterableUserField = (typeof filterableUserFields)[number];

const getAllUser = async (
  queryOptions: Record<TFileterableUserField, string>,
  paginationOptions: IPaginationOptions
) => {
  const { skip, limit, sortBy, orderBy, page } = pagination(paginationOptions);
  const { searchTerm, ...filterData } = queryOptions;
  const andConditions: Prisma.UserWhereInput[] = [];

  console.log(filterData)

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((key) => ({
        [key]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: filterData[key],
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    where: whereConditions,

    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: orderBy,
    },
  });

  const total = await prisma.user.count({ where: whereConditions });
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

export const UserService = {
  getAllUser,
};
