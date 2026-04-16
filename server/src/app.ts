import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/error-handler';
import { authRoutes } from './modules/auth/auth.routes';

// Route imports — uncomment as modules are implemented
import { productRoutes } from './modules/product/product.routes';
import { categoryRoutes } from './modules/category/category.routes';
import { cartRoutes } from './modules/cart/cart.routes';
import { orderRoutes } from './modules/order/order.routes';
import { reviewRoutes } from './modules/review/review.routes';
import { wishlistRoutes } from './modules/wishlist/wishlist.routes';

const app = express();

// ── Global middleware ──────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Static files ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'The requested resource was not found',
  });
});

// ── Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────────────────
app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

export default app;
