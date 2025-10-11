import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { DoctorService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const password = req.body.password;
  const payload = req.body.admin;
  const file = req.file;

  const result = await DoctorService.createAdmin(password, payload, file);

  sendResponse(res, {
    message: "Admin account created successfully",
    data: result,
  });
});

export const DoctorContrller = {
  createAdmin,
};
