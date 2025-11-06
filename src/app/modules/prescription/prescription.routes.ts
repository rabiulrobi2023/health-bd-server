import { Router } from "express";
import auth from "../../middlewires/auth";
import { UserRole } from "@prisma/client";
import { PrescriptionController } from "./prescription.controller";
import { validationRequest } from "../../middlewires/validationRequest";
import { PrescriptionValidation } from "./prescription.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validationRequest(PrescriptionValidation.createPrescriptionValidation),
  PrescriptionController.createPrescription
);
export const PrescriptionRouter = router;
