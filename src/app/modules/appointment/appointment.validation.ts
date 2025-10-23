import z from "zod";

const createAppointmentValidation = z.object({
  doctorId: z.string("Dcotor id is required"),
  scheduleId: z.string("Schedule id is required"),
});

export const AppointmentValidation = {
  createAppointmentValidation,
};
