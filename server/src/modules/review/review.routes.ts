import { Router } from 'express';
import { getProductReviews, createReview } from './review.controller';
import { validate } from '../../middleware/validate';
import { auth } from '../../middleware/auth';
import { reviewQuerySchema, createReviewSchema } from './review.validation';

const router = Router();

router.get('/products/:productId/reviews', validate(reviewQuerySchema), getProductReviews);
router.post('/products/:productId/reviews', auth, validate(createReviewSchema), createReview);

export const reviewRoutes = router;
