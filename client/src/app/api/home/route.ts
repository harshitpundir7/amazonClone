import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { categoryService } from '@/server/modules/category/category.service';
import { productService } from '@/server/modules/product/product.service';
import { successResponse } from '@/server/utils/api-response';

export async function GET() {
  return withErrorHandler(async () => {
    const [categories, deals, trending, bestSellers, electronics, homeKitchen] =
      await Promise.all([
        categoryService.findAll(),
        productService.findAll({ sort: 'price_asc', page: 1, limit: 20 }),
        productService.findAll({ sort: 'newest', page: 1, limit: 20 }),
        productService.findAll({ sort: 'bestselling', page: 1, limit: 20 }),
        productService.findAll({ sort: 'featured', page: 1, limit: 20, categoryId: 1 }),
        productService.findAll({ sort: 'featured', page: 1, limit: 20, categoryId: 3 }),
      ]);

    return NextResponse.json(
      successResponse({
        statusCode: 200,
        message: 'Home page data fetched successfully',
        data: {
          categories,
          deals: deals.products,
          trending: trending.products,
          bestSellers: bestSellers.products,
          electronics: electronics.products,
          homeKitchen: homeKitchen.products,
        },
      }),
    );
  });
}
