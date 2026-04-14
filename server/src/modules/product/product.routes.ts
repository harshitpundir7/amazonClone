import { Router } from 'express';
import { getProducts, getProduct, searchProducts, getFeaturedProducts } from './product.controller';
import { validate } from '../../middleware/validate';
import { productQuerySchema, productSearchSchema, productIdSchema } from './product.validation';

const router = Router();

router.get('/', validate(productQuerySchema), getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', validate(productSearchSchema), searchProducts);
router.get('/:id', validate(productIdSchema), getProduct);

export const productRoutes = router;
