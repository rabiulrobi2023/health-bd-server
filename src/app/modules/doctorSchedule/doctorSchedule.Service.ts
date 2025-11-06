import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppError';
import { prisma } from '../../utils/prisma';

import { IJwtPayload } from '../auth/auth.interface';

const createDoctorSchedule = async (
  user: Partial<IJwtPayload>,
  payload: { scheduleIds: string[] }
) => {
  const doctorData = await prisma.doctor.findFirst({
    where: { email: user.email },
  });

  await Promise.all(
    payload.scheduleIds.map(async (scheduleId) => {
      const isScheduleExist = await prisma.schedule.findFirst({
        where: { id: scheduleId },
      });

      if (!isScheduleExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'One or more schedule not found');
      }
    })
  );
  // await Promise.all(
  //   payload.scheduleIds.map(async (scheduleId) => {
  //     const isScheduleAlreadyExist = await prisma.doctorSchedule.findFirst({
  //       where: { scheduleId: scheduleId },
  //     });

  //     if (isScheduleAlreadyExist) {
  //       const schedule = await prisma.schedule.findFirst({
  //         where: { id: isScheduleAlreadyExist.scheduleId },
  //       });
  //       throw new AppError(
  //         httpStatus.NOT_FOUND,
  //         `${schedule?.startDateTime} to ${schedule?.endDateTime} is already exist`
  //       );
  //     }
  //   })
  // );

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData?.id as string,
    scheduleId: scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });

  return result;
};

  const getAllDoctorSchedule = async () => {
    const result = await prisma.doctorSchedule.findMany();
    return result;
  };

export const DoctorScheduleService = {
  createDoctorSchedule,
  getAllDoctorSchedule
};
