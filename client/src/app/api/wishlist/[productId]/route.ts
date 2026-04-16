import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { getAuthUser } from '@/server/middleware/auth';
import { AppError } from '@/server/middleware/error-handler';
import { wishlistService } from '@/server/modules/wishlist/wishlist.service';
import { successResponse } from '@/server/utils/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  return withErrorHandler(async () => {
    const user = await getAuthUser(request);
    const productId = parseInt(params.productId);
    if (isNaN(productId)) throw new AppError(400, 'Invalid product ID');

    const data = await wishlistService.addItem(user.id, productId);

    return NextResponse.json(
      successResponse({ statusCode: 201, message: 'Added to wishlist', data }),
      { status: 201 },
    );
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  return withErrorHandler(async () => {
    const user = await getAuthUser(request);
    const productId = parseInt(params.productId);
    if (isNaN(productId)) throw new AppError(400, 'Invalid product ID');

    await wishlistService.removeItem(user.id, productId);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Removed from wishlist' }),
    );
  });
}
