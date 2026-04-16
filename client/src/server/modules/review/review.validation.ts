import { z } from 'zod';

export const reviewQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
  params: z.object({
    productId: z.coerce.number().int().positive('Product ID must be a positive integer'),
  }),
});

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    title: z.string().max(200, 'Title must be at most 200 characters').optional(),
    body: z.string().optional(),
  }),
  params: z.object({
    productId: z.coerce.number().int().positive('Product ID must be a positive integer'),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
