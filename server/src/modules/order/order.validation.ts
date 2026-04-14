import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(150),
  phone: z.string().min(1, 'Phone number is required').max(20),
  addressLine1: z.string().min(1, 'Address line 1 is required').max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().max(100).default('India'),
});

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: shippingAddressSchema,
    paymentMethod: z
      .enum(['cod', 'credit_card', 'debit_card', 'upi', 'net_banking'], {
        errorMap: () => ({ message: 'Invalid payment method' }),
      })
      .default('cod'),
  }),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>['body'];
