import z from "zod";

export const createDoctorScheduleValidationSchema = z.object({
  scheduleIds: z.string().array(),
});

export const doctorValidation = {
  createDoctorScheduleValidationSchema,
};
