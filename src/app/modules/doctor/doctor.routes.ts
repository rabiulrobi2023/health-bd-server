import { Router } from "express";
import { DoctorContrller } from "./doctor.controller";
import { validationRequest } from "../../middlewires/validationRequest";
import { DoctorValidation } from "./doctor.validation";
import { upload } from "../../utils/fileUpload/multer";

const router = Router();

router.post(
  "/create",
  upload.single("file"),
  validationRequest(DoctorValidation.createDoctorValidationSchema),
  DoctorContrller.createDoctor
);

export const DoctorRoutes = router;
