import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/server/config/database';
import { env } from '@/server/config/env';
import { AppError } from './error-handler';

export interface JwtPayload {
  id: number;
  email: string;
}

export interface AuthUser {
  id: number;
  email: string;
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required. Please log in.');
  }

  const token = authHeader.split(' ')[1];

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw new AppError(401, 'Invalid token. Please log in again.');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new AppError(401, 'The user belonging to this token no longer exists.');
  }

  return { id: user.id, email: user.email };
}

export async function getOptionalAuthUser(
  request: NextRequest,
): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true },
    });
    return user ? { id: user.id, email: user.email } : null;
  } catch {
    return null;
  }
}
