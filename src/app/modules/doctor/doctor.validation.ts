import { Gender } from "@prisma/client";
import z from "zod";

const createDoctorValidationSchema = z.object({
  password: z.string("Password is required"),
  doctor: z.object({
    name: z.string("Name is required"),
    email: z.email("Email is required"),
    contactNumber: z
      .string("Contact number is required")
      .regex(/^01[3-9]\d{8}$/, "Invalid mobile number")
      .trim(),
    gender: z.enum(Object.keys(Gender), "Gender is required"),
    address: z.string().optional(),
    qualification: z.string("Qualification is required"),
    registrationNumber: z.string("Registration number is required"),
    experience: z.number("Experience number is required"),
    currentWorkingPlace: z.string("Current working place is requird"),
    designation: z.string("Designation is required"),
    appoinmentFee: z.number("Appoinment fee is required"),
  }),
});

export const DoctorValidation = {
  createDoctorValidationSchema,
};
