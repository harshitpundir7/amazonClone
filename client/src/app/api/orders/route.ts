import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { validateRequest } from '@/server/middleware/validate';
import { getAuthUser } from '@/server/middleware/auth';
import { orderService } from '@/server/modules/order/order.service';
import { createOrderSchema, type CreateOrderInput } from '@/server/modules/order/order.validation';
import { successResponse } from '@/server/utils/api-response';
import { parsePagination } from '@/server/utils/pagination';

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const user = await getAuthUser(request);
    const validated = await validateRequest(request, createOrderSchema);
    const order = await orderService.placeOrder(user.id, validated.body as CreateOrderInput);

    return NextResponse.json(
      successResponse({ statusCode: 201, message: 'Order placed successfully', data: order }),
      { status: 201 },
    );
  });
}

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const user = await getAuthUser(request);
    const url = new URL(request.url);
    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => { query[key] = value; });

    const pagination = parsePagination(query);
    const result = await orderService.findByUser(user.id, pagination);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Orders fetched successfully', data: result }),
    );
  });
}
