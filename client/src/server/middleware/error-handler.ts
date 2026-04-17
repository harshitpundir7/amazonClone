import { NextResponse } from 'next/server';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: 'fail' | 'error';

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function withErrorHandler<T>(
  handler: () => Promise<T>,
): Promise<T | NextResponse> {
  return handler().catch((err: unknown) => {
    if (err instanceof AppError) {
      return NextResponse.json(
        {
          status: err.status,
          message: err.message,
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
        { status: err.statusCode },
      );
    }

    console.error('Unexpected error:', err);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && {
          stack: err instanceof Error ? err.stack : undefined,
        }),
      },
      { status: 500 },
    );
  });
}
