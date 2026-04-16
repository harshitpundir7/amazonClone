import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/middleware/error-handler';
import { validateRequest } from '@/server/middleware/validate';
import { authService } from '@/server/modules/auth/auth.service';
import { registerSchema, type RegisterInput } from '@/server/modules/auth/auth.validation';
import { successResponse } from '@/server/utils/api-response';

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const validated = await validateRequest(request, registerSchema);
    const { user, token } = await authService.register(validated.body as RegisterInput);

    return NextResponse.json(
      successResponse({ statusCode: 201, message: 'User registered successfully', data: { user, token } }),
      { status: 201 },
    );
  });
}
