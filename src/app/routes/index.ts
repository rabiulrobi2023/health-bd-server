import { Router } from "express";

interface IModuleRoute {
  path: string;
  route: Router;
}

export const router = Router();
const moduleRoutes: IModuleRoute[] = [{ path: "/", route: router }];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
