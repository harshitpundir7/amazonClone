// TypeScript interfaces for the Amazon Clone

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  imageUrl?: string | null;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

export interface ProductImage {
  id: number;
  productId: number;
  variantId?: number | null;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface VariantAttribute {
  id: number;
  variantId: number;
  attributeName: string;
  attributeValue: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  variantName: string;
  priceOverride?: number | null;
  mrpOverride?: number | null;
  stock: number;
  isActive: boolean;
  attributes?: VariantAttribute[];
  effectivePrice?: number;
  effectiveMrp?: number;
}

export interface ProductSpecification {
  id: number;
  productId: number;
  groupName: string;
  specKey: string;
  specValue: string;
  sortOrder: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brandId?: number | null;
  categoryId: number;
  shortDesc?: string | null;
  longDesc?: string | null;
  basePrice: number;
  mrp: number;
  discountPercent?: number;
  isActive: boolean;
  avgRating: number;
  reviewCount: number;
  totalSold: number;
  isFeatured: boolean;
  createdAt: string;
  brand?: Brand | null;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  reviews?: ProductReview[];
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  variantId?: number | null;
  quantity: number;
  product?: Product;
  variant?: ProductVariant | null;
  effectivePrice?: number;
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  shipFullName: string;
  shipPhone: string;
  shipLine1: string;
  shipLine2?: string;
  shipCity: string;
  shipState: string;
  shipPostal: string;
  shipCountry: string;
  createdAt: string;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId?: number | null;
  productName: string;
  variantName?: string | null;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string | null;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title?: string | null;
  body?: string | null;
  isVerified: boolean;
  createdAt: string;
  user?: User;
}

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  product?: Product;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  brandId?: number;
  rating?: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
