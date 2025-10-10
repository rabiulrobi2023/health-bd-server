import { Gender } from "@prisma/client";
import z from "zod";

const createUserValidationSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Email is required"),
  password: z.string("Password is required"),
  contactNumber: z
    .string("Contact number is required")
    .regex(/^01[3-9]\d{8}$/, "Invalid mobile number")
    .trim(),
  gender: z.enum(Object.keys(Gender), "Gender is required"),
  address: z.string().optional(),
});

export const UserValidation = {
  createUserValidationSchema,
};
