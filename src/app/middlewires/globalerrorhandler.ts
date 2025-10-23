import httpStatus from "http-status-codes";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from "express";
import { TErrorSource } from "../types/types";
import AppError from "../errors/AppError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { envVariable } from "../config/envConfig";
import { nodeEnv } from "../constant/constant";
import { ZodError, ZodIssue } from "zod";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong";
  let source: TErrorSource = [
    {
      path: "",
      message: err.message || message,
    },
  ];

  const error = err;
  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Zod validation error";

    const errorSources: TErrorSource = error?.issues.map((issue: ZodIssue) => {
      return {
        path: issue.path[issue?.path.length - 1],
        message: issue?.message,
      };
    });
    source = errorSources;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = `Duplicate error`;
      source = [
        {
          path: error.meta.modelName,
          message: `${error.meta?.target} is already exists`,
        },
      ];
    } else if (error.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      message = "Not found error";
      source = [
        {
          path: error.meta.modelName,
          message: error.meta.cause,
        },
      ];
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    const findPath = error.message.match(/`(\w+)`\s+arguments/);
    const path = findPath ? findPath[1] : "";

    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation fail";
    const sourceMessage = `${
      path ? path.charAt(0).toUpperCase() + path.slice(1) : "Something"
    } is missing `;
    source = [
      {
        path: path,
        message: sourceMessage,
      },
    ];
  } else if (err instanceof AppError) {
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
    stack: envVariable.NODE_ENV === nodeEnv.DEVELOPMENT ? error.stack : "",
    err: envVariable.NODE_ENV === nodeEnv.DEVELOPMENT ? err : "",
  });
};

export default globalErrorHandler;
