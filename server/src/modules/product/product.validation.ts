import { z } from 'zod';

export const productQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    categoryId: z.coerce.number().int().optional(),
    brandId: z.coerce.number().int().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sort: z
      .enum(['featured', 'price_asc', 'price_desc', 'rating', 'newest', 'bestselling'])
      .default('featured'),
    search: z.string().optional(),
    isFeatured: z.coerce.boolean().optional(),
  }),
});

export const productSearchSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    categoryId: z.coerce.number().int().optional(),
    brandId: z.coerce.number().int().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sort: z
      .enum(['featured', 'price_asc', 'price_desc', 'rating', 'newest', 'bestselling'])
      .default('featured'),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Product ID must be a positive integer'),
  }),
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>['query'];
export type ProductSearchInput = z.infer<typeof productSearchSchema>['query'];
