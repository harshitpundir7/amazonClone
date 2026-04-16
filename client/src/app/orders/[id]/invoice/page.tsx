'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { formatMrp } from '@/lib/utils';
import type { Order } from '@/types';

export default function InvoicePage() {
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-[800px] mx-auto">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-[18px] font-bold text-amzn-text-primary mb-2">Order not found</p>
          <Link href="/orders" className="text-amzn-teal hover:text-amzn-teal-hover hover:underline text-[14px]">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const igstRate = 18;
  const subtotal = Number(order.subtotal);
  const totalAmount = Number(order.totalAmount);
  const shippingCost = Number(order.shippingCost);
  const discount = Number(order.discount);
  const taxableAmount = subtotal - discount;
  const igstAmount = Number(order.tax);

  return (
    <div className="min-h-screen bg-white">
      {/* Action bar - hidden on print */}
      <div className="print:hidden border-b border-amzn-border-primary bg-amzn-bg-tertiary">
        <div className="mx-auto max-w-[800px] flex items-center justify-between px-4 py-3">
          <Link
            href={`/orders/${params.id}`}
            className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
          >
            &larr; Back to order
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-amzn-cart-btn hover:bg-amzn-cart-btn-hover border border-amzn-cart-btn-border rounded-amzn-lg px-4 py-1.5 text-[13px] font-semibold text-amzn-text-primary cursor-pointer shadow-[0_1px_0_rgba(255,255,255,0.4)_inset]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" fill="currentColor" />
            </svg>
            Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice content */}
      <div className="mx-auto max-w-[800px] px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-amzn-text-primary mb-1">TAX INVOICE</h1>
            <p className="text-[14px] text-amzn-text-secondary">
              amazon.in
            </p>
          </div>
          <div className="text-right">
            <p className="text-[14px] text-amzn-text-secondary">Invoice No: <span className="font-bold text-amzn-text-primary">{order.orderNumber}</span></p>
            <p className="text-[14px] text-amzn-text-secondary">Date: <span className="font-bold text-amzn-text-primary">{formattedDate}</span></p>
          </div>
        </div>

        {/* Sold by / Billing info - two columns */}
        <div className="grid grid-cols-2 gap-8 mb-8 border-t border-b border-amzn-border-primary py-4">
          <div>
            <h3 className="text-[13px] font-bold text-amzn-text-primary uppercase tracking-wide mb-2">Sold By</h3>
            <p className="text-[14px] text-amzn-text-primary font-medium">Amazon.in</p>
            <p className="text-[13px] text-amzn-text-secondary">
              Amazon Seller Services Private Limited<br />
              Vipin Trade Centre, 3rd Floor<br />
              Andheri East, Mumbai 400069<br />
              Maharashtra, India<br />
              GSTIN: 27AABCA1234F1ZP
            </p>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-amzn-text-primary uppercase tracking-wide mb-2">Billing Address</h3>
            <p className="text-[14px] text-amzn-text-primary font-medium">{order.shipFullName}</p>
            <p className="text-[13px] text-amzn-text-secondary">
              {order.shipLine1}
              {order.shipLine2 && <><br />{order.shipLine2}</>}<br />
              {order.shipCity}, {order.shipState} {order.shipPostal}<br />
              {order.shipCountry}<br />
              Phone: {order.shipPhone}
            </p>
          </div>
        </div>

        {/* Order details */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4 text-[13px]">
            <div>
              <span className="text-amzn-text-secondary">Order Number</span>
              <p className="font-medium text-amzn-text-primary">{order.orderNumber}</p>
            </div>
            <div>
              <span className="text-amzn-text-secondary">Payment Method</span>
              <p className="font-medium text-amzn-text-primary uppercase">{order.paymentMethod.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-amzn-text-secondary">Order Status</span>
              <p className="font-medium text-amzn-text-primary capitalize">{order.status}</p>
            </div>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full border-collapse text-[13px] mb-6">
          <thead>
            <tr className="border-b-2 border-amzn-text-primary">
              <th className="text-left py-2 px-2 font-bold text-amzn-text-primary">S.No</th>
              <th className="text-left py-2 px-2 font-bold text-amzn-text-primary">Description</th>
              <th className="text-center py-2 px-2 font-bold text-amzn-text-primary">Qty</th>
              <th className="text-right py-2 px-2 font-bold text-amzn-text-primary">Unit Price</th>
              <th className="text-right py-2 px-2 font-bold text-amzn-text-primary">Tax ({igstRate}% IGST)</th>
              <th className="text-right py-2 px-2 font-bold text-amzn-text-primary">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems?.map((item, idx) => {
              const itemTotal = Number(item.totalPrice);
              const itemTax = itemTotal - (itemTotal * 100) / (100 + igstRate);
              const itemBeforeTax = itemTotal - itemTax;
              return (
                <tr key={item.id} className="border-b border-amzn-border-secondary">
                  <td className="py-2 px-2 text-amzn-text-secondary">{idx + 1}</td>
                  <td className="py-2 px-2 text-amzn-text-primary">
                    <p className="font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-[12px] text-amzn-text-secondary">Variant: {item.variantName}</p>
                    )}
                    <p className="text-[12px] text-amzn-text-secondary">SKU: {item.sku}</p>
                  </td>
                  <td className="py-2 px-2 text-center text-amzn-text-primary">{item.quantity}</td>
                  <td className="py-2 px-2 text-right text-amzn-text-primary">{formatMrp(Number(item.unitPrice))}</td>
                  <td className="py-2 px-2 text-right text-amzn-text-secondary">{formatMrp(Math.round(itemTax * 100) / 100)}</td>
                  <td className="py-2 px-2 text-right font-medium text-amzn-text-primary">{formatMrp(itemTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals breakdown */}
        <div className="flex justify-end mb-8">
          <div className="w-[320px] text-[13px]">
            <div className="flex justify-between py-1.5">
              <span className="text-amzn-text-secondary">Subtotal</span>
              <span className="text-amzn-text-primary">{formatMrp(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-1.5">
                <span className="text-amzn-text-secondary">Discount</span>
                <span className="text-amzn-success">-{formatMrp(discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5">
              <span className="text-amzn-text-secondary">Shipping</span>
              <span className="text-amzn-text-primary">{shippingCost === 0 ? 'FREE' : formatMrp(shippingCost)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-amzn-text-secondary">IGST ({igstRate}%)</span>
              <span className="text-amzn-text-primary">{formatMrp(igstAmount)}</span>
            </div>
            <div className="flex justify-between py-2 mt-2 border-t-2 border-amzn-text-primary">
              <span className="font-bold text-[16px] text-amzn-text-primary">Grand Total</span>
              <span className="font-bold text-[16px] text-amzn-text-primary">{formatMrp(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Tax breakdown note */}
        <div className="border-t border-amzn-border-secondary pt-4 mb-4">
          <h3 className="text-[13px] font-bold text-amzn-text-primary mb-2">Tax Breakup</h3>
          <table className="w-auto text-[12px]">
            <thead>
              <tr className="text-amzn-text-secondary">
                <th className="text-left pr-4 py-1">Tax Type</th>
                <th className="text-right pr-4 py-1">Taxable Amount</th>
                <th className="text-right pr-4 py-1">Rate</th>
                <th className="text-right py-1">Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-amzn-text-primary">
                <td className="pr-4 py-1">IGST</td>
                <td className="text-right pr-4 py-1">{formatMrp(Math.round(taxableAmount * 100) / 100)}</td>
                <td className="text-right pr-4 py-1">{igstRate}%</td>
                <td className="text-right py-1">{formatMrp(igstAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-amzn-border-secondary pt-4 text-[12px] text-amzn-text-tertiary">
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p className="mt-1">For queries, contact Amazon Customer Service at amazon.in/help</p>
        </div>
      </div>
    </div>
  );
}
