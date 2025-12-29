import { Gender } from '@prisma/client';
import z from 'zod';

const createDoctorValidationSchema = z.object({
  name: z.string('Name is required'),
  email: z.email('Email is required'),
  contactNumber: z
    .string('Contact number is required')
    .regex(/^01[3-9]\d{8}$/, 'Invalid mobile number')
    .trim(),
  gender: z.enum(Object.keys(Gender), 'Gender is required'),
  address: z.string().optional(),
  qualification: z.string('Qualification is required'),
  registrationNumber: z.string('Registration number is required'),
  experience: z.number('Experience number is required'),
  specialties: z.string().array().optional(),
  currentWorkingPlace: z.string('Current working place is requird'),
  designation: z.string('Designation is required'),
  appoinmentFee: z.number('Appoinment fee is required'),
});

const updateDoctorSchema = z.object({
  name: z.string().optional(),
  contactNumber: z
    .string()
    .regex(/^01[3-9]\d{8}$/, 'Invalid mobile number')
    .trim()
    .optional(),
  gender: z.enum(Object.keys(Gender)).optional(),
  address: z.string().optional(),
  qualification: z.string().optional(),
  registrationNumber: z.string().optional(),
  experience: z.number().optional(),
  specialties: z.string().array().optional(),
  currentWorkingPlace: z.string().optional(),
  designation: z.string().optional(),
  appoinmentFee: z.number().optional(),
  removeSpecialties: z.string().array().optional(),
});
export const DoctorValidation = {
  createDoctorValidationSchema,
  updateDoctorSchema,
};
