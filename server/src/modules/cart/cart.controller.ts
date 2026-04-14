import { Request, Response, NextFunction } from 'express';
import { cartService } from './cart.service';
import { sendResponse } from '../../utils/api-response';

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id || 1;
    const cart = await cartService.getCart(userId);

    sendResponse(res, {
      statusCode: 200,
      message: 'Cart fetched successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id || 1;
    const cartItem = await cartService.addItem(userId, req.body);

    sendResponse(res, {
      statusCode: 201,
      message: 'Item added to cart',
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id || 1;
    const cartItemId = parseInt(req.params.id, 10);
    const cartItem = await cartService.updateItem(userId, cartItemId, req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'Cart item updated',
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id || 1;
    const cartItemId = parseInt(req.params.id, 10);
    await cartService.removeItem(userId, cartItemId);

    sendResponse(res, {
      statusCode: 200,
      message: 'Item removed from cart',
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id || 1;
    await cartService.clearCart(userId);

    sendResponse(res, {
      statusCode: 200,
      message: 'Cart cleared',
    });
  } catch (error) {
    next(error);
  }
};
