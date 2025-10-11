import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getAllUser = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const searchTerm = (req.query.searchTerm as string) || "";
  const sortBy = req.query.sortBy as string || "createdAt";
  const orderBy = req.query.orderBy as string || "desc";

  const result = await UserService.getAllUser(page, limit, searchTerm,sortBy,orderBy);
  sendResponse(res, {
    message: "User retrived successfully",
    data: result,
  });
});
export const UserController = {
  getAllUser,
};
