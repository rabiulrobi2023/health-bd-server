import z from "zod";

const createAppointmentValidation = z.object({
  doctorId: z.string("Dcotor id is required"),
  scheduleId: z.string("Schedule id is required"),
});

const updateStatusValidation = z.object({
  status: z.string("Status is required"),
});

export const AppointmentValidation = {
  createAppointmentValidation,
  updateStatusValidation,
};
