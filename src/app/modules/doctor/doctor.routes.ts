import { Router } from "express";
import { DoctorContrller } from "./doctor.controller";
import { validationRequest } from "../../middlewires/validationRequest";
import { DoctorValidation } from "./doctor.validation";
import { upload } from "../../utils/fileUpload/multer";
import auth from "../../middlewires/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  upload.single("file"),
  validationRequest(DoctorValidation.createDoctorValidationSchema),
  DoctorContrller.createDoctor
);

router.get("/", DoctorContrller.getAllDoctors);
router.patch("/", auth(UserRole.DOCTOR), DoctorContrller.updateDoctor);

export const DoctorRoutes = router;
