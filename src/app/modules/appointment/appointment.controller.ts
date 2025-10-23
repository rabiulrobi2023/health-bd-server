import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppointmentService } from "./appointment.service";

export const createAppointment = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await AppointmentService.createAppointment(user, payload);
  sendResponse(res, {
    message: "Appointment created successfully",
    data: result,
  });
});
export const AppointmentController = {
  createAppointment,
};
