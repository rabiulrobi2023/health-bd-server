import fs from "fs/promises";
import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      next(err);
    }
  };
};
export default catchAsync;
