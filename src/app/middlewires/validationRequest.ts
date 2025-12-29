import fs from 'fs/promises';
import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';

export const validationRequest = (zodSchema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }
      await zodSchema.parseAsync(req.body);
      next();
    } catch (err) {
      if (req.file) {
        await fs.unlink(req.file.path as string);
      }
      next(err);
    }
  };
};
