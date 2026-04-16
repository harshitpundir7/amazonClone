import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.number().int('Product ID must be an integer'),
    variantId: z.number().int('Variant ID must be an integer').nullable().optional(),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>['body'];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>['body'];
