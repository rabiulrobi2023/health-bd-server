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
  const user = req.user;

  const result = await ScheduleService.getAllSchedules(
    user,
    queryOptions,
    paginationOptions as IPaginationOptions
  );
  sendResponse(res, {
    message: "Schedules retrived successfully",
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ScheduleService.deleteSchedule(id);
  sendResponse(res, {
    message: "Schedule deleted successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  deleteSchedule,
};
