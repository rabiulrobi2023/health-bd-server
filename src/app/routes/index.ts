import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";

interface IModuleRoute {
  path: string;
  route: Router;
}

export const router = Router();
const moduleRoutes: IModuleRoute[] = [{ path: "/user", route: UserRoutes }];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
