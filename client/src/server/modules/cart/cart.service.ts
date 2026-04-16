import { Prisma } from '@prisma/client';
import { prisma } from '@/server/config/database';
import { AppError } from '@/server/middleware/error-handler';
import type { AddToCartInput, UpdateCartItemInput } from './cart.validation';

const cartItemInclude = {
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      basePrice: true,
      mrp: true,
      brand: { select: { id: true, name: true } },
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { imageUrl: true, altText: true },
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
    },
  },
} satisfies Prisma.CartItemInclude;

function computeEffectivePrice(cartItem: {
  variant: { priceOverride: Prisma.Decimal | null } | null;
  product: { basePrice: Prisma.Decimal };
}) {
  const effectivePrice = cartItem.variant?.priceOverride ?? cartItem.product.basePrice;
  return Number(effectivePrice);
}

export const cartService = {
  async getCart(userId: number) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: cartItemInclude,
      orderBy: { createdAt: 'desc' },
    });

    const items = cartItems.map((item) => {
      const effectivePrice = computeEffectivePrice(item);
      const subtotal = effectivePrice * item.quantity;

      return {
        ...item,
        effectivePrice,
        subtotal,
      };
    });

    const subtotal = items.reduce((sum: number, item) => sum + item.subtotal, 0);
    const totalItems = items.reduce((sum: number, item) => sum + item.quantity, 0);

    return { items, subtotal, totalItems };
  },

  async addItem(userId: number, data: AddToCartInput) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product || !product.isActive) {
      throw new AppError(404, 'Product not found or unavailable.');
    }

    if (data.variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: data.variantId },
      });

      if (!variant || !variant.isActive) {
        throw new AppError(404, 'Variant not found or unavailable.');
      }

      if (variant.stock < data.quantity) {
        throw new AppError(400, `Only ${variant.stock} units available in stock.`);
      }
    } else {
      // No variant selected — check stock from the first active variant or product
      const availableVariant = await prisma.productVariant.findFirst({
        where: { productId: data.productId, isActive: true },
        orderBy: { stock: 'desc' },
      });

      if (availableVariant && availableVariant.stock < data.quantity) {
        throw new AppError(400, `Only ${availableVariant.stock} units available in stock.`);
      }
    }

    // Find existing cart item for this user+product+variant combination
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId: data.productId,
        variantId: data.variantId ?? null,
      },
    });

    let cartItem;

    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: { increment: data.quantity } },
        include: cartItemInclude,
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId: data.productId,
          variantId: data.variantId ?? null,
          quantity: data.quantity,
        },
        include: cartItemInclude,
      });
    }

    const effectivePrice = computeEffectivePrice(cartItem);
    const subtotal = effectivePrice * cartItem.quantity;

    return {
      ...cartItem,
      effectivePrice,
      subtotal,
    };
  },

  async updateItem(userId: number, cartItemId: number, data: UpdateCartItemInput) {
    const existingItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
    });

    if (!existingItem) {
      throw new AppError(404, 'Cart item not found.');
    }

    // Verify product is still active
    const product = await prisma.product.findUnique({
      where: { id: existingItem.productId },
    });

    if (!product || !product.isActive) {
      throw new AppError(400, 'Product is no longer available.');
    }

    // Check stock availability for the requested quantity
    if (existingItem.variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: existingItem.variantId },
      });

      if (!variant || !variant.isActive) {
        throw new AppError(400, 'Variant is no longer available.');
      }

      if (variant.stock < data.quantity) {
        throw new AppError(400, `Only ${variant.stock} units available in stock.`);
      }
    } else {
      const availableVariant = await prisma.productVariant.findFirst({
        where: { productId: existingItem.productId, isActive: true },
        orderBy: { stock: 'desc' },
      });

      if (availableVariant && availableVariant.stock < data.quantity) {
        throw new AppError(400, `Only ${availableVariant.stock} units available in stock.`);
      }
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: data.quantity },
      include: cartItemInclude,
    });

    const effectivePrice = computeEffectivePrice(cartItem);
    const subtotal = effectivePrice * cartItem.quantity;

    return {
      ...cartItem,
      effectivePrice,
      subtotal,
    };
  },

  async removeItem(userId: number, cartItemId: number) {
    const existingItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
    });

    if (!existingItem) {
      throw new AppError(404, 'Cart item not found.');
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  },

  async clearCart(userId: number) {
    await prisma.cartItem.deleteMany({
      where: { userId },
    });
  },
};
