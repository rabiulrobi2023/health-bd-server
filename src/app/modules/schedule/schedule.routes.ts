import { Router } from "express";
import { ScheduleController } from "./schedule.controllert";

const router = Router();
router.post("/create", ScheduleController.createSchedule);
router.get("/", ScheduleController.getAllSchedules);
export const ScheduleRouter = router;
