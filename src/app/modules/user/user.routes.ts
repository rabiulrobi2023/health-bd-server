import { Router } from "express";
import { UserContrller } from "./user.controller";

const router = Router();

router.post("/create-patient", UserContrller.createPatient);

export const UserRoutes = router;
