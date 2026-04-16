import { NextRequest } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error-handler';

export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
  params?: Record<string, string>,
): Promise<T> {
  let body: unknown = undefined;

  const method = request.method;
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    try {
      body = await request.json();
    } catch {
      body = {};
    }
  }

  const url = new URL(request.url);
  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  try {
    const validated = schema.parse({ body, query, params });
    return validated;
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new AppError(400, errors);
    }
    throw error;
  }
}
