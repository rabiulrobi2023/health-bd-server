import { Router } from "express";
import { DoctorContrller } from "./admin.controller";
import { validationRequest } from "../../middlewires/validationRequest";
import { AdminValidation } from "./admin.validation";
import { upload } from "../../utils/fileUpload/multer";

const router = Router();

router.post(
  "/create",
  upload.single("file"),
  validationRequest(AdminValidation.createAdminValidationSchema),
  DoctorContrller.createAdmin
);

export const AdminRoutes = router;
