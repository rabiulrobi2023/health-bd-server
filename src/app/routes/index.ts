import { Router } from "express";
import { UserRoutes } from "../modules/patient/patient.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { DoctorRoutes } from "../modules/doctor/doctor.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";

interface IModuleRoute {
  path: string;
  route: Router;
}

export const router = Router();
const moduleRoutes: IModuleRoute[] = [
  {
    path: "/patient",
    route: UserRoutes,
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
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
