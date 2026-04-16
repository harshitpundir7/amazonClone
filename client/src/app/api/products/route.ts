import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { validateRequest } from '@/server/middleware/validate';
import { productService } from '@/server/modules/product/product.service';
import { productQuerySchema, type ProductQueryInput } from '@/server/modules/product/product.validation';
import { successResponse } from '@/server/utils/api-response';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const validated = await validateRequest(request, productQuerySchema);
    const result = await productService.findAll(validated.query as ProductQueryInput);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Products fetched successfully', data: result }),
    );
  });
}
