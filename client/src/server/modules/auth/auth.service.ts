import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/server/config/database';
import { env } from '@/server/config/env';
import { AppError } from '@/server/middleware/error-handler';
import type { RegisterInput, LoginInput } from './auth.validation';

const signToken = (id: number, email: string): string => {
  return jwt.sign({ id, email }, env.JWT_SECRET, { expiresIn: '7d' });
};

export const authService = {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(409, 'A user with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const token = signToken(user.id, user.email);

    return { user, token };
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordCorrect) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const token = signToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },

  async getMe(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found.');
    }

    return user;
  },
};
