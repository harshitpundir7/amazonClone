import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from './cart.controller';
import { validate } from '../../middleware/validate';
import { optionalAuth } from '../../middleware/auth';
import { addToCartSchema, updateCartItemSchema } from './cart.validation';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, validate(addToCartSchema), addToCart);
router.put('/items/:id', optionalAuth, validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:id', optionalAuth, removeCartItem);
router.delete('/', optionalAuth, clearCart);

export const cartRoutes = router;
