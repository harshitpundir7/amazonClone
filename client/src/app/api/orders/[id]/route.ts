import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { getAuthUser } from '@/server/middleware/auth';
import { orderService } from '@/server/modules/order/order.service';
import { successResponse } from '@/server/utils/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return withErrorHandler(async () => {
    const user = await getAuthUser(request);
    const orderId = parseInt(params.id, 10);
    const order = await orderService.findById(user.id, orderId);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Order fetched successfully', data: order }),
    );
  });
}
