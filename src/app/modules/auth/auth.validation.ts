import z from "zod";

const authValidationSchema = z.object({
  email: z.email("Email is required"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 character "),
});

export const AuthValidation = {
  authValidationSchema,
};
