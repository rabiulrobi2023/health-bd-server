import { Router } from "express";
import { upload } from "../../utils/fileUpload/multer";
import { validationRequest } from "../../middlewires/validationRequest";
import { SpecialtiesValidation } from "./specialties.validation";
import { SpecialtiesController } from "./specialties.controller";

const router = Router();
router.post(
  "/",
  upload.single("file"),
  validationRequest(SpecialtiesValidation.createSpecialtiesValidation),
  SpecialtiesController.createSpecialties
);
router.get("/", SpecialtiesController.getAllSpecialties);
router.delete("/:id", SpecialtiesController.deleteSpecialties);

export const SpecialtiesRouter = router;
