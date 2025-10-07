import { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";

import { envVariable } from "./app/config/envConfig";
import { router } from "./app/routes";
import globalErrorHandler from "./app/middlewires/globalerrorhandler";
import notFoundRoute from "./app/middlewires/notFoundRoute";

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Server is running...",
    environment: envVariable.NODE_ENV,
    uptime: process.uptime().toFixed(2) + "s",
    timeStamp: new Date().toDateString(),
  });
});
app.use(globalErrorHandler);
app.use(notFoundRoute);

export default app;
