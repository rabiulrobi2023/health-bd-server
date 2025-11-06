import httpStatus from 'http-status-codes';
import { Appointment, AppointmentStauts, Prisma, UserRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { IJwtPayload } from '../auth/auth.interface';
import { prisma } from '../../utils/prisma';

import { envVariable } from '../../config/envConfig';
import { stripe } from '../../utils/payment/stripe';
import pagination from '../../utils/pagination/pagination';
import { IPaginationOptions } from '../../utils/pagination/pagination.interface';
import { appointmentFilterableField, appontmentSearchableField } from './appointment.constant';
import AppError from '../../errors/AppError';

const createAppointment = async (user: Partial<IJwtPayload>, payload: Partial<Appointment>) => {
  const isPatientExist = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isDoctorExist = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  const isScheduleNotBooked = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: isDoctorExist?.id,
      scheduleId: payload?.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointment = await tnx.appointment.create({
      data: {
        paitentId: isPatientExist?.id,
        doctorId: isDoctorExist.id,
        scheduleId: isScheduleNotBooked?.scheduleId,
        videoCallingId,
      },
    });

    await tnx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: isDoctorExist.id as string,
          scheduleId: payload?.scheduleId as string,
        },
      },
      data: {
        isBooked: true,
      },
    });
    const transactionId = uuidv4();
    const payment = await tnx.payment.create({
      data: {
        appointmentId: appointment.id,
        transactionId,
        amount: isDoctorExist.appoinmentFee,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: isPatientExist.email,
      line_items: [
        {
          price_data: {
            currency: 'bdt',
            product_data: {
              name: `Appointment with Dr ${isDoctorExist.name}`,
            },
            unit_amount: isDoctorExist.appoinmentFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointment.id,
        paymentId: payment.id,
      },
      success_url: envVariable.PAYMENT_SECCESS_URL,
      cancel_url: envVariable.PAYMENT_FAIL_URL,
    });

    return session.url;
  });
  return result;
};

type TAppointmentFilterableField = (typeof appointmentFilterableField)[number];
const getMyAppointment = async (
  user: Partial<IJwtPayload>,
  queryOptions: Record<TAppointmentFilterableField, string>,
  paginationOptions: IPaginationOptions
) => {
  const { skip, limit, sortBy, orderBy, page } = pagination(paginationOptions);
  const { ...filterData } = queryOptions;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user.email,
      },
    });
  }
  if (user.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({ [key]: filterData[key] })),
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    include: user.role === UserRole.DOCTOR ? { patient: true } : { doctor: true },
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: orderBy,
    },
  });

  const total = await prisma.appointment.count({ where: whereConditions });

  return {
    meta: {
      total: total,
      limit: limit,
      page: page,
    },
    data: result,
  };
};
const getAllAppointment = async (
  queryOptions: Record<TAppointmentFilterableField, string>,
  paginationOptions: IPaginationOptions
) => {
  const { skip, limit, sortBy, orderBy, page } = pagination(paginationOptions);
  const { searchTerm, ...filterData } = queryOptions;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        ...appontmentSearchableField.map((field) => ({
          doctor: {
            [field]: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        })),
        ...appontmentSearchableField.map((field) => ({
          patient: { [field]: { contains: searchTerm, mode: 'insensitive' } },
        })),
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({ [key]: filterData[key] })),
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    include: {
      doctor: true,
      patient: true,
    },

    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: orderBy,
    },
  });

  const total = await prisma.appointment.count({ where: whereConditions });

  return {
    meta: {
      total: total,
      limit: limit,
      page: page,
    },
    data: result,
  };
};

const updateAppointment = async (
  user: Partial<IJwtPayload>,
  appointmentId: string,
  status: AppointmentStauts
) => {
  const isAppointmentExist = await prisma.appointment.findUniqueOrThrow({
    where: { id: appointmentId },
    include: {
      doctor: true,
      patient: true,
    },
  });

  if (!isAppointmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Appoint not found');
  }

  if (user.role === UserRole.DOCTOR) {
    if (user.email != isAppointmentExist.doctor.email) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'This is not your appointment');
    }
    const result = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: status,
      },
    });
    return result;
  }
};

export const AppointmentService = {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
  updateAppointment,
};
