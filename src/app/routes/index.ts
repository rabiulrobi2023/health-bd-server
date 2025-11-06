import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { DoctorRoutes } from "../modules/doctor/doctor.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { PatientRoutes } from "../modules/patient/patient.routes";
import { ScheduleRouter } from "../modules/schedule/schedule.routes";
import { DoctorScheduleRouter } from "../modules/doctorSchedule/doctorSchedule.route";
import { SpecialtiesRouter } from "../modules/specialties/specialities.routes";
import { AppointmentRouter } from "../modules/appointment/appointment.routes";
import { PrescriptionRouter } from "../modules/prescription/prescription.routes";
import { ReviewRouter } from "../modules/review/review.routes";

interface IModuleRoute {
  path: string;
  route: Router;
}

export const router = Router();
const moduleRoutes: IModuleRoute[] = [
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/schedule",
    route: ScheduleRouter,
  },
  {
    path: "/doctor-schedule",
    route: DoctorScheduleRouter,
  },
  {
    path: "/specialties",
    route: SpecialtiesRouter,
  },
  {
    path:"/appointment",
    route: AppointmentRouter
  },
  {
    path:"/prescription",
    route: PrescriptionRouter
  },
  {
    path:"/review",
    route: ReviewRouter
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
