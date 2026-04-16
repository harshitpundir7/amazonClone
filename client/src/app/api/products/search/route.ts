import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { validateRequest } from '@/server/middleware/validate';
import { productService } from '@/server/modules/product/product.service';
import { productSearchSchema, type ProductSearchInput } from '@/server/modules/product/product.validation';
import { successResponse } from '@/server/utils/api-response';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const validated = await validateRequest(request, productSearchSchema);
    const result = await productService.search(validated.query as ProductSearchInput);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Search results fetched successfully', data: result }),
    );
  });
}
