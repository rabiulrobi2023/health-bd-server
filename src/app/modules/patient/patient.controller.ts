import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";
import { PatientService } from "./patient.service";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const password = req.body.password;
  const payload = req.body.patient;
  const file = req.file;

  const result = await PatientService.createPatient(password, payload, file);

  sendResponse(res, {
    message: "Patient account created successfully",
    data: result,
  });
});

export const PatientContrller = {
  createPatient,
};
