import z from "zod";

const createPrescriptionValidation = z.object({
  appointmentId: z.string("App id required"),
  instruction: z.string().optional(),
  followUpDate: z.string(),
});

export const PrescriptionValidation = {
  createPrescriptionValidation,
};
