import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { validateRequest } from '@/server/middleware/validate';
import { getOptionalAuthUser } from '@/server/middleware/auth';
import { cartService } from '@/server/modules/cart/cart.service';
import { addToCartSchema, type AddToCartInput } from '@/server/modules/cart/cart.validation';
import { successResponse } from '@/server/utils/api-response';

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const user = await getOptionalAuthUser(request);
    const userId = user?.id ?? 1;
    const validated = await validateRequest(request, addToCartSchema);
    const cartItem = await cartService.addItem(userId, validated.body as AddToCartInput);

    return NextResponse.json(
      successResponse({ statusCode: 201, message: 'Item added to cart', data: cartItem }),
      { status: 201 },
    );
  });
}
