import { Router } from "express";
import auth from "../../middlewires/auth";
import { UserRole } from "@prisma/client";
import { validationRequest } from "../../middlewires/validationRequest";
import { AppointmentValidation } from "./appointment.validation";
import { AppointmentController } from "./appointment.controller";

const router = Router();
router.post(
  "/",
  auth(UserRole.PATENT),
  validationRequest(AppointmentValidation.createAppointmentValidation),
  AppointmentController.createAppointment
);

export const AppointmentRouter = router
