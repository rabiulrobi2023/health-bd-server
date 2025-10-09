import httpStatus from "http-status-codes";

import { Response } from "express";

interface IMeta {
  totalPage: number;
  limit: number;
  page: number;
  pgination: number;
}

interface IResponse<T> {
  statusCode?: number;
  message: string;
  data: T;
  meta?: IMeta;
}

export const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode || httpStatus.OK).json({
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
