import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { getAuthUser } from '@/server/middleware/auth';
import { wishlistService } from '@/server/modules/wishlist/wishlist.service';
import { successResponse } from '@/server/utils/api-response';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const user = await getAuthUser(request);
    const data = await wishlistService.findByUser(user.id);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Wishlist fetched successfully', data }),
    );
  });
}
