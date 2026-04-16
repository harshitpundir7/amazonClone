import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { productService } from '@/server/modules/product/product.service';
import { successResponse } from '@/server/utils/api-response';

export async function GET() {
  return withErrorHandler(async () => {
    const products = await productService.findFeatured();

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Featured products fetched successfully', data: { products } }),
    );
  });
}
