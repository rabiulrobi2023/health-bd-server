import { Appointment } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { IJwtPayload } from "../auth/auth.interface";
import { prisma } from "../../utils/prisma";

import { envVariable } from "../../config/envConfig";
import { stripe } from "../../utils/payment/stripe";

const createAppointment = async (
  user: Partial<IJwtPayload>,
  payload: Partial<Appointment>
) => {
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
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: isPatientExist.email,
      line_items: [
        {
          price_data: {
            currency: "bdt",
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

    console.log(session);

    return session.url;
  });
  return result;
};

export const AppointmentService = {
  createAppointment,
};
