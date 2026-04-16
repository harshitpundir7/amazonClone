import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { getOptionalAuthUser } from '@/server/middleware/auth';
import { cartService } from '@/server/modules/cart/cart.service';
import { successResponse } from '@/server/utils/api-response';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const user = await getOptionalAuthUser(request);
    const userId = user?.id ?? 1;
    const cart = await cartService.getCart(userId);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Cart fetched successfully', data: cart }),
    );
  });
}

export async function DELETE(request: NextRequest) {
  return withErrorHandler(async () => {
    const user = await getOptionalAuthUser(request);
    const userId = user?.id ?? 1;
    await cartService.clearCart(userId);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Cart cleared' }),
    );
  });
}
