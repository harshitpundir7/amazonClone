import { Prisma, PaymentMethod } from '@prisma/client';
import crypto from 'crypto';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error-handler';
import type { CreateOrderInput } from './order.validation';
import type { PaginationResult } from '../../utils/pagination';

function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const hex = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `ORD-${dateStr}-${hex}`;
}

export const orderService = {
  async placeOrder(userId: number, data: CreateOrderInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Get cart items with product details
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              basePrice: true,
              mrp: true,
              isActive: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { imageUrl: true },
              },
            },
          },
          variant: {
            select: {
              id: true,
              variantName: true,
              sku: true,
              priceOverride: true,
              mrpOverride: true,
              stock: true,
              isActive: true,
            },
          },
        },
      });

      // 2. Validate cart is not empty
      if (cartItems.length === 0) {
        throw new AppError(400, 'Cart is empty');
      }

      // 3. Generate order number
      const orderNumber = generateOrderNumber();

      // 4. Compute subtotal and discount
      let subtotal = 0;
      let discount = 0;

      const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

      for (const item of cartItems) {
        if (!item.product.isActive) {
          throw new AppError(
            400,
            `Product "${item.product.name}" is no longer available.`,
          );
        }

        if (item.variant && !item.variant.isActive) {
          throw new AppError(
            400,
            `Variant "${item.variant.variantName}" is no longer available.`,
          );
        }

        const effectivePrice = item.variant?.priceOverride ?? item.product.basePrice;
        const effectiveMrp = item.variant?.mrpOverride ?? item.product.mrp;

        const unitPrice = Number(effectivePrice);
        const mrpPerUnit = Number(effectiveMrp);
        const totalPrice = unitPrice * item.quantity;

        subtotal += totalPrice;
        discount += (mrpPerUnit - unitPrice) * item.quantity;

        const imageUrl = item.product.images[0]?.imageUrl ?? null;

        orderItemsData.push({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.product.name,
          variantName: item.variant?.variantName ?? null,
          sku: item.variant?.sku ?? `PROD-${item.productId}`,
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(unitPrice),
          totalPrice: new Prisma.Decimal(totalPrice),
          imageUrl,
        });
      }

      // 5. Shipping cost: FREE for orders over 499, else 49
      const shippingCost = subtotal > 499 ? 0 : 49;

      // 6. Tax: 18% GST on (subtotal - discount + shipping)
      const taxableAmount = subtotal - discount + shippingCost;
      const tax = Math.round(taxableAmount * 0.18 * 100) / 100;

      // 7. Total amount
      const totalAmount = subtotal - discount + shippingCost + tax;

      // 8. Create order with nested order items
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          subtotal: new Prisma.Decimal(subtotal),
          discount: new Prisma.Decimal(discount),
          shippingCost: new Prisma.Decimal(shippingCost),
          tax: new Prisma.Decimal(tax),
          totalAmount: new Prisma.Decimal(totalAmount),
          paymentMethod: data.paymentMethod as PaymentMethod,
          shipFullName: data.shippingAddress.fullName,
          shipPhone: data.shippingAddress.phone,
          shipLine1: data.shippingAddress.addressLine1,
          shipLine2: data.shippingAddress.addressLine2 ?? null,
          shipCity: data.shippingAddress.city,
          shipState: data.shippingAddress.state,
          shipPostal: data.shippingAddress.postalCode,
          shipCountry: data.shippingAddress.country,
          orderItems: {
            createMany: {
              data: orderItemsData,
            },
          },
        },
        include: {
          orderItems: true,
        },
      });

      // 9. Decrease variant stock for items with variantId
      for (const item of cartItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // 10. Delete cart items
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return order;
    });
  },

  async findByUser(userId: number, pagination: PaginationResult) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            select: {
              id: true,
              productName: true,
              variantName: true,
              quantity: true,
              unitPrice: true,
              totalPrice: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.order.count({
        where: { userId },
      }),
    ]);

    return {
      orders,
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    };
  },

  async findById(userId: number, orderId: number) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new AppError(404, 'Order not found.');
    }

    return order;
  },
};
