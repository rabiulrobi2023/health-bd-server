import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";
import pick from "../../utils/pick";
import { paginationFields } from "../../constant/constant";
import { filterableUserFields } from "./user.constant";
import { IPaginationOptions } from "../../utils/pagination/pagination.interface";

const getAllUser = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, filterableUserFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await UserService.getAllUser(
    queryOptions,
    paginationOptions as IPaginationOptions
  );
  const { meta, data } = result;
  sendResponse(res, {
    message: "User retrived successfully",
    data: {
      data,
      meta,
    },
  });
});
export const UserController = {
  getAllUser,
};
