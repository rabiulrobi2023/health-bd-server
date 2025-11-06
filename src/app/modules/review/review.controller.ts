import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { IJwtPayload } from '../auth/auth.interface';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const user = req.user;
  const reviewData = req.body;
  const result = await ReviewService.createReview(user as IJwtPayload, reviewData);
  sendResponse(res, {
    message: 'Review created successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
};
