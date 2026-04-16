import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { AppError } from '@/server/middleware/error-handler';
import { productService } from '@/server/modules/product/product.service';
import { successResponse } from '@/server/utils/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return withErrorHandler(async () => {
    const id = Number(params.id);

    if (isNaN(id) || id <= 0) {
      throw new AppError(400, 'Invalid product ID.');
    }

    const product = await productService.findById(id);

    if (!product) {
      throw new AppError(404, 'Product not found.');
    }

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Product fetched successfully', data: { product } }),
    );
  });
}
