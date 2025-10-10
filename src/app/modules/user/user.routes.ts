import { Router } from "express";
import { UserContrller } from "./user.controller";
import { validationRequest } from "../../middlewires/validationRequest";
import { UserValidation } from "./user.validation";
import { upload } from "../../utils/fileUpload/multer";

const router = Router();

router.post(
  "/create-patient",
  upload.single("file"),
  validationRequest(UserValidation.createUserValidationSchema),

  UserContrller.createPatient
);

export const UserRoutes = router;
