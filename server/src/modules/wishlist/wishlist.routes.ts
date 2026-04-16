import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from './wishlist.controller';
import { auth } from '../../middleware/auth';

export const wishlistRoutes = Router();

wishlistRoutes.get('/', auth, getWishlist);
wishlistRoutes.post('/:productId', auth, addToWishlist);
wishlistRoutes.delete('/:productId', auth, removeFromWishlist);
