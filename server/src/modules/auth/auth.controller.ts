import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendResponse } from '../../utils/api-response';
import { AppError } from '../../middleware/error-handler';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user, token } = await authService.register(req.body);

    sendResponse(res, {
      statusCode: 201,
      message: 'User registered successfully',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user, token } = await authService.login(req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'Logged in successfully',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required.');
    }

    const user = await authService.getMe(req.user.id);

    sendResponse(res, {
      statusCode: 200,
      message: 'User profile fetched successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
