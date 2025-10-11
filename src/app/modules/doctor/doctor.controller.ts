import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../utils/sendResponse";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const password = req.body.password;
  const payload = req.body.doctor;
  const file = req.file;

  const result = await DoctorService.createDoctor(password, payload, file);

  sendResponse(res, {
    message: "Doctor account created successfully",
    data: result,
  });
});

export const DoctorContrller = {
  createDoctor,
};
