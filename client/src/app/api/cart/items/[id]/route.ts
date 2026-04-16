import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { validateRequest } from '@/server/middleware/validate';
import { getOptionalAuthUser } from '@/server/middleware/auth';
import { cartService } from '@/server/modules/cart/cart.service';
import { updateCartItemSchema, type UpdateCartItemInput } from '@/server/modules/cart/cart.validation';
import { successResponse } from '@/server/utils/api-response';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return withErrorHandler(async () => {
    const user = await getOptionalAuthUser(request);
    const userId = user?.id ?? 1;
    const cartItemId = parseInt(params.id, 10);
    const validated = await validateRequest(request, updateCartItemSchema);
    const cartItem = await cartService.updateItem(userId, cartItemId, validated.body as UpdateCartItemInput);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Cart item updated', data: cartItem }),
    );
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return withErrorHandler(async () => {
    const user = await getOptionalAuthUser(request);
    const userId = user?.id ?? 1;
    const cartItemId = parseInt(params.id, 10);
    await cartService.removeItem(userId, cartItemId);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Item removed from cart' }),
    );
  });
}
