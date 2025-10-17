import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewires/auth";
import { UserRole } from "@prisma/client";

const router = Router();
router.get("/", auth(UserRole.ADMIN), UserController.getAllUser);
export const UserRoutes = router;
