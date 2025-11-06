import { paginationFields } from "../../constant/constant";
import catchAsync from "../../utils/catchAsync";
import { IPaginationOptions } from "../../utils/pagination/pagination.interface";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { IJwtPayload } from "../auth/auth.interface";
import { appointmentFilterableField } from "./appointment.constant";
import { AppointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await AppointmentService.createAppointment(user, payload);
  sendResponse(res, {
    message: "Appointment created successfully",
    data: result,
  });
});
const getMyAppointment = catchAsync(async (req, res) => {
  const user = req.user;
  const queryOptions = pick(req.query, appointmentFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AppointmentService.getMyAppointment(
    user,
    queryOptions,
    paginationOptions as IPaginationOptions
  );
  sendResponse(res, {
    message: "Appointment retrieved successfully",
    data: result,
  });
});
const getAllAppointment = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, appointmentFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AppointmentService.getAllAppointment(
    queryOptions,
    paginationOptions as IPaginationOptions
  );
  sendResponse(res, {
    message: "Appointment retrieved successfully",
    data: result,
  });
});

const updateAppointment = catchAsync(async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const status = req.body.status;

  const result = await AppointmentService.updateAppointment(
    user as IJwtPayload,
    id,
    status
  );
  sendResponse(res, {
    message: "Appointment updated successfully",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
  updateAppointment,
};
