import cors from 'cors';
import { env } from '../config/env';

const allowedOrigins = env.CLIENT_URL.split(',').map((url) => url.trim());

export const corsMiddleware = cors({
  origin: "*",
  credentials: true,
});
