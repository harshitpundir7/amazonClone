import { Request, Response, NextFunction } from 'express';
import { reviewService } from './review.service';
import { sendResponse } from '../../utils/api-response';
import { AppError } from '../../middleware/error-handler';
import { parsePagination } from '../../utils/pagination';
import type { CreateReviewInput } from './review.validation';

export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productId = Number(req.params.productId);

    if (isNaN(productId) || productId <= 0) {
      throw new AppError(400, 'Invalid product ID.');
    }

    const pagination = parsePagination({
      page: req.query.page as string,
      limit: req.query.limit as string,
    });

    const result = await reviewService.findByProduct(productId, pagination);

    sendResponse(res, {
      statusCode: 200,
      message: 'Reviews fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required.');
    }

    const productId = Number(req.params.productId);

    if (isNaN(productId) || productId <= 0) {
      throw new AppError(400, 'Invalid product ID.');
    }

    const reviewData: CreateReviewInput = req.body;

    const review = await reviewService.create({
      userId: req.user.id,
      productId,
      rating: reviewData.rating,
      title: reviewData.title,
      body: reviewData.body,
    });

    sendResponse(res, {
      statusCode: 201,
      message: 'Review created successfully',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};
