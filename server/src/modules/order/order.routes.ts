import { Router } from 'express';
import { placeOrder, getOrders, getOrder } from './order.controller';
import { validate } from '../../middleware/validate';
import { auth } from '../../middleware/auth';
import { createOrderSchema } from './order.validation';

const router = Router();

router.post('/', auth, validate(createOrderSchema), placeOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrder);

export const orderRoutes = router;
