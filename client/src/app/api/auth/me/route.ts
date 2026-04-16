import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { getAuthUser } from '@/server/middleware/auth';
import { authService } from '@/server/modules/auth/auth.service';
import { successResponse } from '@/server/utils/api-response';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const user = await getAuthUser(request);
    const userProfile = await authService.getMe(user.id);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'User profile fetched successfully', data: { user: userProfile } }),
    );
  });
}
