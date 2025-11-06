import { Router } from "express";

import { validationRequest } from "../../middlewires/validationRequest";

import { upload } from "../../utils/fileUpload/multer";
import { PatientValidation } from "./patient.validation";
import { PatientContrller } from "./patient.controller";

const router = Router();

router.post(
  "/",
  upload.single("file"),
  validationRequest(PatientValidation.createPatientValidationSchema),
 PatientContrller.createPatient
);

export const PatientRoutes = router;
