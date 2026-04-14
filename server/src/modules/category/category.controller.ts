import { Request, Response, NextFunction } from 'express';
import { categoryService } from './category.service';
import { sendResponse } from '../../utils/api-response';
import { AppError } from '../../middleware/error-handler';

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const categories = await categoryService.findAll();

    sendResponse(res, {
      statusCode: 200,
      message: 'Categories fetched successfully',
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await categoryService.findBySlug(slug);

    if (!category) {
      throw new AppError(404, 'Category not found.');
    }

    sendResponse(res, {
      statusCode: 200,
      message: 'Category fetched successfully',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};
