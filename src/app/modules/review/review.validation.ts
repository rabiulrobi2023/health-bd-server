import z from 'zod';

export const createReviewValidation = z.object({
  appointmentId: z.string('Appointment id is required'),
  rating: z
    .number('Rating is required')
    .min(0, 'Rating rate minimum 0')
    .max(5, 'Rating range is maximum 5'),
  remarks: z.string().optional(),
});
export const ReviewValidation = {
  createReviewValidation,
};
