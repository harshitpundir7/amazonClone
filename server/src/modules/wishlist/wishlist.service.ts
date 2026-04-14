import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error-handler';

export const wishlistService = {
  async findByUser(userId: number) {
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            brand: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        effectivePrice: item.product.basePrice,
        primaryImage: item.product.images[0]?.imageUrl || null,
      },
    }));
  },

  async addItem(userId: number, productId: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      throw new AppError(404, 'Product not found');
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      return existing;
    }

    return prisma.wishlistItem.create({
      data: { userId, productId },
    });
  },

  async removeItem(userId: number, productId: number) {
    const item = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!item) {
      throw new AppError(404, 'Item not found in wishlist');
    }

    await prisma.wishlistItem.delete({
      where: { id: item.id },
    });

    return null;
  },
};
