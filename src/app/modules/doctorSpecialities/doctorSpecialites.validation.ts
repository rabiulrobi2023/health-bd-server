import z from "zod";

const createDoctorSpecialitesValidation = z.object({
  title: z.string("Title is required").min(2, "Title at least 2 character"),
});

export const DoctorSpecialtiesValidation = {
  createDoctorSpecialitesValidation,
};
