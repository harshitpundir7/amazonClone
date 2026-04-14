import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): { whole: string; fraction: string; formatted: string } {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  const str = num.toFixed(2);
  const [whole, fraction] = str.split('.');
  return {
    whole: parseInt(whole).toLocaleString('en-IN'),
    fraction,
    formatted: `₹${parseInt(whole).toLocaleString('en-IN')}.${fraction}`,
  };
}

export function formatMrp(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

export function calculateDiscount(mrp: number, sellingPrice: number): number {
  if (mrp <= 0) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${random}`;
}

export function getEstimatedDelivery(): string {
  const date = new Date();
  date.setDate(date.getDate() + 3 + Math.floor(Math.random() * 4));
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
