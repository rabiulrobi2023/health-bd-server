import { Router } from "express";
import { ScheduleController } from "./schedule.controllert";
import auth from "../../middlewires/auth";
import { UserRole } from "@prisma/client";

const router = Router();
router.post("/", ScheduleController.createSchedule);
router.get("/",auth(UserRole.DOCTOR, UserRole.ADMIN), ScheduleController.getAllSchedules);
router.delete("/:id", ScheduleController.deleteSchedule);
export const ScheduleRouter = router;
