import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from './wishlist.controller';
import { optionalAuth } from '../../middleware/auth';

export const wishlistRoutes = Router();

wishlistRoutes.get('/', optionalAuth, getWishlist);
wishlistRoutes.post('/:productId', optionalAuth, addToWishlist);
wishlistRoutes.delete('/:productId', optionalAuth, removeFromWishlist);
