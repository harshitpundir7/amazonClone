import { Router } from 'express';
import { placeOrder, getOrders, getOrder } from './order.controller';
import { validate } from '../../middleware/validate';
import { optionalAuth } from '../../middleware/auth';
import { createOrderSchema } from './order.validation';

const router = Router();

router.post('/', optionalAuth, validate(createOrderSchema), placeOrder);
router.get('/', optionalAuth, getOrders);
router.get('/:id', optionalAuth, getOrder);

export const orderRoutes = router;
