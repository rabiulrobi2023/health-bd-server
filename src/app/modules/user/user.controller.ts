import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req.body);
  sendResponse(res, {
    message: "Patient created successfully",
    data: result,
  });
});

export const UserContrller = {
  createPatient,
};
