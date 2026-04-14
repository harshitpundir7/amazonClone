import { prisma } from '../../config/database';
import { parsePagination, type PaginationResult } from '../../utils/pagination';

interface CreateReviewData {
  userId: number;
  productId: number;
  rating: number;
  title?: string;
  body?: string;
}

export const reviewService = {
  async findByProduct(productId: number, pagination: PaginationResult) {
    const [reviews, total] = await Promise.all([
      prisma.productReview.findMany({
        where: { productId },
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.productReview.count({ where: { productId } }),
    ]);

    return {
      reviews,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  },

  async create(data: CreateReviewData) {
    const review = await prisma.productReview.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        title: data.title,
        body: data.body,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return review;
  },
};
