import { paginationFields } from "../../constant/constant";
import catchAsync from "../../utils/catchAsync";
import { IPaginationOptions } from "../../utils/pagination/pagination.interface";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { filterableScheduleFields } from "./schedule.constant";
import { ScheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req, res) => {
  const result = await ScheduleService.createSchedule(req.body);
  sendResponse(res, {
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, filterableScheduleFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ScheduleService.getAllSchedules(
    queryOptions,
    paginationOptions as IPaginationOptions
  );
  sendResponse(res, {
    message: "Schedules retrived successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
};
