import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { categoryService } from '@/server/modules/category/category.service';
import { successResponse } from '@/server/utils/api-response';

export async function GET() {
  return withErrorHandler(async () => {
    const categories = await categoryService.findAll();

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Categories fetched successfully', data: { categories } }),
    );
  });
}
