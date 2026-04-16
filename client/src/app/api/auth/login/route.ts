import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { validateRequest } from '@/server/middleware/validate';
import { authService } from '@/server/modules/auth/auth.service';
import { loginSchema, type LoginInput } from '@/server/modules/auth/auth.validation';
import { successResponse } from '@/server/utils/api-response';

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const validated = await validateRequest(request, loginSchema);
    const { user, token } = await authService.login(validated.body as LoginInput);

    return NextResponse.json(
      successResponse({ statusCode: 200, message: 'Logged in successfully', data: { user, token } }),
    );
  });
}
