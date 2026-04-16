import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { AppError } from '@/server/middleware/error-handler';
import { categoryService } from '@/server/modules/category/category.service';
import { successResponse } from '@/server/utils/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } },
) {
  return withErrorHandler(async () => {
    const { slug } = params;
    const category = await categoryService.findBySlug(slug);

    if (!category) {
      throw new AppError(404, 'Category not found.');
    }

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Category fetched successfully', data: { category } }),
    );
  });
}
