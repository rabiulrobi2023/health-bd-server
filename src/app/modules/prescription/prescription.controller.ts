import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PrescriptionService } from "./prescription.service";

const createPrescription = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await PrescriptionService.createPrescription(user, payload);
  sendResponse(res, {
    message: "Prescription created successfully",
    data: result,
  });
});

export const PrescriptionController = {
    createPrescription
}
