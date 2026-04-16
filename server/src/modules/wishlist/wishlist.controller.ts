import { Request, Response, NextFunction } from 'express';
import { wishlistService } from './wishlist.service';
import { sendResponse } from '../../utils/api-response';
import { AppError } from '../../middleware/error-handler';

export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data = await wishlistService.findByUser(userId);
    sendResponse(res, { statusCode: 200, message: 'Wishlist fetched successfully', data });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) throw new AppError(400, 'Invalid product ID');

    const data = await wishlistService.addItem(userId, productId);
    sendResponse(res, { statusCode: 201, message: 'Added to wishlist', data });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) throw new AppError(400, 'Invalid product ID');

    await wishlistService.removeItem(userId, productId);
    sendResponse(res, { statusCode: 200, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};
