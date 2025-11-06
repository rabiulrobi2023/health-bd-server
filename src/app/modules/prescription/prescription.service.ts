import httpStatus from "http-status-codes";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { ICreatePrescription } from "./prescription.interface";
import { IJwtPayload } from "../auth/auth.interface";
import AppError from "../../errors/AppError";

export const createPrescription = async (
  user: Partial<IJwtPayload>,
  payload: ICreatePrescription
) => {
  const { appointmentId, instruction, followUpDate } = payload;

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
      status: "COMPLETED",
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (user.email != appointmentData.doctor.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is not your appointment");
  }

  if (new Date() >= new Date(followUpDate)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The follwoup date must be future date"
    );
  }

  const data = {
    appointmentId: appointmentId,
    doctorId: appointmentData.doctor.id,
    patientId: appointmentData.paitentId,
    instruction: instruction,
    followUpDate: new Date(followUpDate),
  };

  const result = await prisma.prescription.create({
    data,
  });

  return result;
};

export const PrescriptionService = {
  createPrescription,
};
