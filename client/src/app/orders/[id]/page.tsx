'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${params.id}`) as any;
        setOrder(res?.data ?? res);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchOrder();
  }, [params.id]);

  if (loading) return <ProtectedRoute><div className="min-h-screen bg-amzn-bg-secondary"><Header /><SubNav /><div className="max-w-amzn-container mx-auto px-6 py-8"><Skeleton variant="card" /></div><Footer /></div></ProtectedRoute>;

  if (!order) return <ProtectedRoute><div className="min-h-screen bg-amzn-bg-secondary"><Header /><SubNav /><div className="max-w-amzn-container mx-auto px-6 py-8"><p>Order not found</p></div><Footer /></div></ProtectedRoute>;

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-amzn-bg-secondary">
      <Header />
      <SubNav />

      <div className="max-w-amzn-container mx-auto px-6 py-8">
        <div className="mb-4">
          <Link href="/orders" className="text-amzn-teal hover:text-amzn-teal-hover hover:underline text-sm">
            &larr; Back to orders
          </Link>
        </div>

        <div className="bg-white rounded-amzn-md border border-amzn-border-primary">
          {/* Order header */}
          <div className="p-6 border-b border-amzn-border-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-[24px] font-bold text-amzn-text-primary">Order {order.orderNumber}</h1>
                <Badge
                  variant={order.status === 'delivered' || order.status === 'shipped' ? 'success' : 'warning'}
                  text={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                />
              </div>
              <Link
                href={`/orders/${params.id}/invoice`}
                className="text-[13px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
              >
                View Invoice
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-amzn-text-secondary">Order placed</span>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div>
                <span className="text-amzn-text-secondary">Payment method</span>
                <p className="font-medium uppercase">{order.paymentMethod.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-amzn-text-secondary">Total</span>
                <p className="font-bold text-lg">{formatMrp(Number(order.totalAmount))}</p>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="p-6 border-b border-amzn-border-primary">
            <h2 className="text-lg font-bold mb-2">Shipping address</h2>
            <p className="text-sm text-amzn-text-primary">{order.shipFullName}</p>
            <p className="text-sm text-amzn-text-primary">{order.shipLine1}</p>
            {order.shipLine2 && <p className="text-sm text-amzn-text-primary">{order.shipLine2}</p>}
            <p className="text-sm text-amzn-text-primary">
              {order.shipCity}, {order.shipState} {order.shipPostal}
            </p>
            <p className="text-sm text-amzn-text-primary">{order.shipCountry}</p>
            <p className="text-sm text-amzn-text-secondary">Phone: {order.shipPhone}</p>
          </div>

          {/* Order items */}
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Items in this order</h2>
            <div className="space-y-4">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-amzn-border-secondary last:border-0">
                  <img
                    src={item.imageUrl || `https://picsum.photos/seed/oi${item.id}/80/80`}
                    alt={item.productName}
                    className="w-20 h-20 object-contain"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amzn-text-primary">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-xs text-amzn-text-secondary">{item.variantName}</p>
                    )}
                    <p className="text-xs text-amzn-text-secondary mt-1">
                      Qty: {item.quantity} &middot; {formatMrp(Number(item.unitPrice))} each
                    </p>
                  </div>
                  <p className="font-bold">{formatMrp(Number(item.totalPrice))}</p>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="mt-6 pt-4 border-t border-amzn-border-primary">
              <div className="max-w-xs ml-auto space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-amzn-text-secondary">Subtotal</span>
                  <span>{formatMrp(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-amzn-success">
                    <span>Discount</span>
                    <span>-{formatMrp(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-amzn-text-secondary">Shipping</span>
                  <span>{Number(order.shippingCost) === 0 ? 'FREE' : formatMrp(Number(order.shippingCost))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amzn-text-secondary">Tax</span>
                  <span>{formatMrp(Number(order.tax))}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-amzn-border-primary">
                  <span>Total</span>
                  <span>{formatMrp(Number(order.totalAmount))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}
