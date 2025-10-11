import { prisma } from "../../utils/prisma";

const getAllUser = async (
  page: number,
  limit: number,
  searchTerm: string,
  sortBy: string,
  orderBy: string
) => {
  const skip = limit * (page - 1);

  const result = await prisma.user.findMany({
    skip: skip,
    take: limit,
    where: searchTerm
      ? {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }
      : {},

    orderBy: {
      [sortBy]: orderBy,
    },
  });
  return result;
};

export const UserService = {
  getAllUser,
};
