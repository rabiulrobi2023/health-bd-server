import httpStatus from "http-status-codes";
import AppError from "../../errors/AppError";

import { addMinutes, differenceInMinutes } from "date-fns";
import { prisma } from "../../utils/prisma";
import { ISchedule } from "./schedule.interface";
import { IPaginationOptions } from "../../utils/pagination/pagination.interface";
import pagination from "../../utils/pagination/pagination";

import { filterableScheduleFields } from "./schedule.constant";
import { Prisma } from "@prisma/client";

type TFileterableScheduleField = (typeof filterableScheduleFields)[number];

const createSchedule = async (payload: ISchedule) => {
  const { startDate, startTime, endTime, endDate, interval } = payload;

  const newStartDateTime = new Date(`${startDate}T${startTime}`);
  const newEndDateTime = new Date(`${endDate}T${endTime}`);

  const schedules = [];

  if (newStartDateTime >= newEndDateTime) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid date");
  }

  const now = new Date(Date.now());

  if (newStartDateTime < now) {
    throw new AppError(httpStatus.BAD_REQUEST, "Schedule already passed");
  }

  const difference = differenceInMinutes(newEndDateTime, newStartDateTime);
  if (difference < Number(interval)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Interval duration exceeds total schedule time."
    );
  }

  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);
  while (newStartDate <= newEndDate) {
    const startMinute =
      Number(startTime.split(":")[0]) * 60 + Number(startTime.split(":")[1]);
    const endMinute =
      Number(endTime.split(":")[0]) * 60 + Number(endTime.split(":")[1]);

    let slotStartDateTime = addMinutes(newStartDate, startMinute);
    const dailyEndDateTime = addMinutes(newStartDate, endMinute);

    while (slotStartDateTime < dailyEndDateTime) {
      const slotEndDateTime = addMinutes(slotStartDateTime, Number(interval));
      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };
      schedules.push(scheduleData);

      const isOverlap = await prisma.schedule.findFirst({
        where: {
          startDateTime: { lt: slotEndDateTime },
          endDateTime: { gt: slotStartDateTime },
        },
      });

      if (isOverlap) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Schedule overlaps with existing slot."
        );
      }

      slotStartDateTime = slotEndDateTime;
    }

    newStartDate.setDate(newStartDate.getDate() + 1);
  }

  const result = await prisma.schedule.createMany({
    data: schedules,
  });
  schedules.push(result);
  return schedules;
};

const getAllSchedules = async (
  queryOptions: Record<TFileterableScheduleField, string>,
  paginationOptions: IPaginationOptions
) => {
  const { startDateTime, endDateTime } = queryOptions;
  const { skip, limit, sortBy, orderBy, page } = pagination(paginationOptions);

  const andConditions: Prisma.ScheduleWhereInput[] = [];
  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: new Date(startDateTime),
          },
        },
        {
          endDateTime: {
            lte: new Date(endDateTime),
          },
        },
      ],
    });
  }

  const wherConditions: Prisma.ScheduleWhereInput =
    andConditions?.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.schedule.findMany({
    where: wherConditions,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: orderBy,
    },
  });

  const total = await prisma.schedule.count({ where: wherConditions });
  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};
export const ScheduleService = {
  createSchedule,
  getAllSchedules,
};
