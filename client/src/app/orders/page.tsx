'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import type { Order } from '@/types';
import { formatMrp } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'stock'> = {
  pending: 'warning',
  confirmed: 'success',
  processing: 'warning',
  shipped: 'success',
  delivered: 'success',
  cancelled: 'stock',
  refunded: 'stock',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders') as any;
        const fetched: any[] = res?.data?.orders ?? res?.orders ?? [];
        setOrders(Array.isArray(fetched) ? fetched : []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-amzn-bg-secondary">
      <Header />
      <SubNav />

      <div className="max-w-amzn-container mx-auto px-6 py-8">
        <h1 className="text-[28px] font-bold text-amzn-text-primary mb-6">Your Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-amzn-md p-12 text-center">
            <p className="text-xl font-bold text-amzn-text-primary mb-2">No orders yet</p>
            <p className="text-sm text-amzn-text-secondary mb-4">
              Looks like you haven&apos;t placed any orders.
            </p>
            <Link
              href="/"
              className="text-amzn-teal hover:text-amzn-teal-hover hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-amzn-md border border-amzn-border-primary">
                {/* Order header */}
                <div className="flex items-center justify-between px-6 py-4 bg-amzn-bg-tertiary border-b border-amzn-border-primary rounded-t-amzn-md">
                  <div className="grid grid-cols-4 gap-8 text-sm flex-1">
                    <div>
                      <span className="text-amzn-text-secondary">ORDER PLACED</span>
                      <p className="text-amzn-text-primary font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-amzn-text-secondary">TOTAL</span>
                      <p className="text-amzn-text-primary font-medium">
                        {formatMrp(Number(order.totalAmount))}
                      </p>
                    </div>
                    <div>
                      <span className="text-amzn-text-secondary">SHIP TO</span>
                      <p className="text-amzn-text-primary font-medium">{order.shipFullName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-amzn-text-secondary">ORDER #</span>
                      <Link
                        href={`/orders/${order.id}`}
                        className="block text-amzn-teal hover:text-amzn-teal-hover hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order body */}
                <div className="px-6 py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant={STATUS_COLORS[order.status] || 'stock'}
                      text={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    />
                    <span className="text-sm text-amzn-text-secondary">
                      {order.status === 'delivered'
                        ? `Delivered on ${new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })}`
                        : order.status === 'shipped'
                        ? 'In transit'
                        : 'Processing'}
                    </span>
                  </div>
                  {order.orderItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-2">
                      <img
                        src={item.imageUrl || `https://picsum.photos/seed/oi${item.id}/80/80`}
                        alt={item.productName}
                        className="w-16 h-16 object-contain"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-amzn-text-primary">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-xs text-amzn-text-secondary">{item.variantName}</p>
                        )}
                        <p className="text-xs text-amzn-text-secondary">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold">{formatMrp(Number(item.totalPrice))}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}
