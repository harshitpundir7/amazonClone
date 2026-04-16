import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service';
import { sendResponse } from '../../utils/api-response';
import { AppError } from '../../middleware/error-handler';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await productService.findAll(req.query as any);

    sendResponse(res, {
      statusCode: 200,
      message: 'Products fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
      throw new AppError(400, 'Invalid product ID.');
    }

    const product = await productService.findById(id);

    if (!product) {
      throw new AppError(404, 'Product not found.');
    }

    sendResponse(res, {
      statusCode: 200,
      message: 'Product fetched successfully',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await productService.search(req.query as any);

    sendResponse(res, {
      statusCode: 200,
      message: 'Search results fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const products = await productService.findFeatured();

    sendResponse(res, {
      statusCode: 200,
      message: 'Featured products fetched successfully',
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};
