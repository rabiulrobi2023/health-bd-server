import { Router } from 'express';
import { validationRequest } from '../../middlewires/validationRequest';
import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';
import auth from '../../middlewires/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/',
  auth(UserRole.PATIENT),

  validationRequest(ReviewValidation.createReviewValidation),
  ReviewController.createReview
);

export const ReviewRouter = router;
