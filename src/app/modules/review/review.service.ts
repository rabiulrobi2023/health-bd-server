import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppError';
import { prisma } from '../../utils/prisma';
import { IJwtPayload } from '../auth/auth.interface';
import { IReviewPayload } from './review.interface';
import { AppointmentStauts } from '@prisma/client';

const createReview = async (user: IJwtPayload, payload: IReviewPayload) => {
  const { email } = user;
  const patienData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      paitentId: patienData.id,
    },
  });
  if (!appointmentData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User appointment not found');
  }

  if (appointmentData.status != AppointmentStauts.COMPLETED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Appointment not completed');
  }

  return await prisma.$transaction(async (tnx) => {
    const result = await tnx.review.create({
      data: {
        appointmentId: payload.appointmentId,
        doctorId: appointmentData.doctorId,
        patientId: patienData.id,
        comment: payload.comment,
        rating: payload.rating,
      },
    });

    const avgRating = tnx.review.aggregate({
      _avg: {
        rating: true,
      },

      where: {
        doctorId: appointmentData.doctorId,
      },
    });

    await tnx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        rating: (await avgRating)._avg.rating as number,
      },
    });
    return result;
  });
};

export const ReviewService = {
  createReview,
};
