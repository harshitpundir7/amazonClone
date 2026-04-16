import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler, AppError } from '@/server/middleware/error-handler';
import { validateRequest } from '@/server/middleware/validate';
import { getAuthUser } from '@/server/middleware/auth';
import { reviewService } from '@/server/modules/review/review.service';
import { reviewQuerySchema, createReviewSchema, type CreateReviewInput } from '@/server/modules/review/review.validation';
import { successResponse } from '@/server/utils/api-response';
import { parsePagination } from '@/server/utils/pagination';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  return withErrorHandler(async () => {
    const productId = Number(params.productId);

    if (isNaN(productId) || productId <= 0) {
      throw new AppError(400, 'Invalid product ID.');
    }

    const url = new URL(request.url);
    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => { query[key] = value; });

    const pagination = parsePagination(query);
    const result = await reviewService.findByProduct(productId, pagination);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Reviews fetched successfully', data: result }),
    );
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  return withErrorHandler(async () => {
    const user = await getAuthUser(request);
    const validated = await validateRequest(request, createReviewSchema, { productId: params.productId });
    const reviewData = validated.body as CreateReviewInput;

    const review = await reviewService.create({
      userId: user.id,
      productId: Number(params.productId),
      rating: reviewData.rating,
      title: reviewData.title,
      body: reviewData.body,
    });

    return NextResponse.json(
      successResponse({ statusCode: 201, message: 'Review created successfully', data: { review } }),
      { status: 201 },
    );
  });
}
