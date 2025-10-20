import z from "zod";

const createSpecialtiesValidation = z.object({
  title: z
    .string("Title is required")
    .min(2, "Title at least two characters long"),
});

export const SpecialtiesValidation = {
  createSpecialtiesValidation,
};
