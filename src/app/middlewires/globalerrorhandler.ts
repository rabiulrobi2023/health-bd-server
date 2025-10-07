/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from "express";
import { TErrorSource } from "../app/config/types/types";
import AppError from "../Errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";

  let source: TErrorSource = [
    {
      path: "",
      message: message,
    },
  ];

  if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    source = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    source = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err.code === "CastError") {
    statusCode = err?.code;
  }

  res.status(statusCode).json({
    success: false,
    message,
    source,
  });
};

export default globalErrorHandler