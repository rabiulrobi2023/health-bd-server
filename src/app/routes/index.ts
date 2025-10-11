import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { DoctorRoutes } from "../modules/doctor/doctor.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { PatientRoutes } from "../modules/patient/patient.routes";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
