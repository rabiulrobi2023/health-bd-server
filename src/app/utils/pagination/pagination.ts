import { IPagination, IPaginationOptions } from "./pagination.interface";

const pagination = (options: IPaginationOptions): IPagination => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = Number((page - 1) * limit) || 0;
  const sortBy: string = options.sortBy || "createdAt";
  const orderBy: string = options.orderBy || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    orderBy,
  };
};

export default pagination;
