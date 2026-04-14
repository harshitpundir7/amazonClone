import { Request, Response, NextFunction } from 'express';
import { orderService } from './order.service';
import { sendResponse } from '../../utils/api-response';
import { parsePagination } from '../../utils/pagination';

export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id || 1;
    const order = await orderService.placeOrder(userId, req.body);

    sendResponse(res, {
      statusCode: 201,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id || 1;
    const pagination = parsePagination(req.query as Record<string, string>);
    const result = await orderService.findByUser(userId, pagination);

    sendResponse(res, {
      statusCode: 200,
      message: 'Orders fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id || 1;
    const orderId = parseInt(req.params.id, 10);
    const order = await orderService.findById(userId, orderId);

    sendResponse(res, {
      statusCode: 200,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
