'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle, MapPin, CreditCard, Package } from 'lucide-react';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import AddressForm from '@/components/checkout/AddressForm';
import Price from '@/components/ui/Price';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';
import { formatPrice, getEstimatedDelivery } from '@/lib/utils';
import type { Address, ShippingAddress, Order } from '@/types';

type PaymentMethod = 'cod' | 'credit_card' | 'debit_card' | 'upi';

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: 'cod', label: 'Cash on Delivery', description: 'Pay when your order is delivered' },
  { value: 'credit_card', label: 'Credit Card', description: 'Visa, Mastercard, Amex' },
  { value: 'debit_card', label: 'Debit Card', description: 'All major bank debit cards' },
  { value: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm, BHIM UPI' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, fetchCart, subtotal } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  const cartSubtotal = subtotal();
  const { formatted: subtotalFormatted } = formatPrice(cartSubtotal);
  const shippingCost = cartSubtotal >= 500 ? 0 : 49;
  const tax = Math.round(cartSubtotal * 0.18 * 100) / 100;
  const totalAmount = cartSubtotal + shippingCost + tax;
  const { formatted: totalFormatted } = formatPrice(totalAmount);

  // Fetch cart and addresses on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const fetchAddresses = async () => {
      try {
        const data = await api.get('/addresses');
        const addrs = data.data || [];
        setAddresses(addrs);
        const defaultAddr = addrs.find((a: Address) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setShippingAddress({
            fullName: defaultAddr.fullName,
            phone: defaultAddr.phone,
            addressLine1: defaultAddr.addressLine1,
            addressLine2: defaultAddr.addressLine2,
            city: defaultAddr.city,
            state: defaultAddr.state,
            postalCode: defaultAddr.postalCode,
            country: defaultAddr.country,
          });
        } else if (addrs.length > 0) {
          setSelectedAddressId(addrs[0].id);
          const a = addrs[0];
          setShippingAddress({
            fullName: a.fullName,
            phone: a.phone,
            addressLine1: a.addressLine1,
            addressLine2: a.addressLine2,
            city: a.city,
            state: a.state,
            postalCode: a.postalCode,
            country: a.country,
          });
        } else {
          setShowNewAddress(true);
        }
      } catch {
        setShowNewAddress(true);
      }
    };
    fetchAddresses();
  }, [isAuthenticated, router]);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setShippingAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    });
  };

  const handleNewAddress = (data: ShippingAddress) => {
    setShippingAddress(data);
    setShowNewAddress(false);
    // Save address to backend
    api.post('/addresses', data).then((res) => {
      const newAddr = res.data as Address;
      if (newAddr) {
        setAddresses((prev) => [...prev, newAddr]);
        setSelectedAddressId(newAddr.id);
      }
    }).catch(() => {
      // address saved locally even if API fails
    });
  };

  const handleStep1Continue = () => {
    if (!shippingAddress) return;
    setCurrentStep(2);
  };

  const handleStep2Continue = () => {
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) return;
    setPlacingOrder(true);
    try {
      const data = await api.post('/orders', {
        shippingAddress,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });
      const order = data.data as Order;
      setOrderData(order);
      setOrderConfirmed(true);
      useCartStore.getState().clearCart();
    } catch (err) {
      console.error('Failed to place order:', err);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Order confirmed view
  if (orderConfirmed && orderData) {
    return (
      <div className="min-h-screen bg-white">
        {/* Simplified header */}
        <div className="border-b border-amzn-border-primary">
          <div className="mx-auto max-w-amzn-container flex items-center justify-between px-4 py-3">
            <Link href="/" className="text-[22px] font-bold text-amzn-dark-nav hover:no-underline">
              amazon<span className="text-amzn-gold">.in</span>
            </Link>
            <div className="flex items-center gap-1.5 text-[13px] text-amzn-text-secondary">
              <ShieldCheck className="w-4 h-4 text-amzn-success" />
              Secure transaction
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-[700px] px-4 py-10">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-amzn-success mx-auto mb-4" />
            <h1 className="text-[28px] font-bold text-amzn-text-primary mb-2">
              Order placed, thank you!
            </h1>
            <p className="text-[14px] text-amzn-text-secondary">
              Confirmation will be sent to your email.
            </p>
          </div>

          <div className="bg-white border border-amzn-border-primary rounded-amzn-md p-6 space-y-4">
            <div>
              <p className="text-[14px] text-amzn-text-secondary">Order number</p>
              <p className="text-[16px] font-bold text-amzn-text-primary">{orderData.orderNumber}</p>
            </div>
            <div>
              <p className="text-[14px] text-amzn-text-secondary">Order total</p>
              <p className="text-[16px] font-bold text-amzn-text-primary">{formatPrice(orderData.totalAmount).formatted}</p>
            </div>
            <div>
              <p className="text-[14px] text-amzn-text-secondary">Estimated delivery</p>
              <p className="text-[16px] font-bold text-amzn-text-primary">{getEstimatedDelivery()}</p>
            </div>
            <div>
              <p className="text-[14px] text-amzn-text-secondary">Shipping to</p>
              <p className="text-[14px] text-amzn-text-primary">
                {orderData.shipFullName}, {orderData.shipCity}, {orderData.shipState} {orderData.shipPostal}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-6">
            <Link href="/orders">
              <Button variant="primary" size="sm">
                View your orders
              </Button>
            </Link>
            <Link
              href="/"
              className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Redirect if not authenticated or empty cart
  if (!isAuthenticated) return null;
  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-amzn-container px-4 py-16 text-center">
          <h1 className="text-[24px] font-bold text-amzn-text-primary mb-2">Your cart is empty</h1>
          <Link href="/" className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amzn-bg-secondary">
      {/* Simplified header */}
      <div className="border-b border-amzn-border-primary bg-white">
        <div className="mx-auto max-w-amzn-container flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-[22px] font-bold text-amzn-dark-nav hover:no-underline">
            amazon<span className="text-amzn-gold">.in</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[13px] text-amzn-text-secondary">
            <ShieldCheck className="w-4 h-4 text-amzn-success" />
            Secure transaction
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-amzn-container px-4 py-4">
        {/* Checkout Steps */}
        <CheckoutSteps currentStep={currentStep} />

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left: Step content */}
          <div className="flex-[7]">
            {/* STEP 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="bg-white border border-amzn-border-primary rounded-amzn-md p-5">
                <h2 className="text-[18px] font-bold text-amzn-text-primary mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Select a shipping address
                </h2>

                {/* Saved addresses */}
                {addresses.length > 0 && (
                  <div className="space-y-3 mb-5">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 border rounded-amzn-md cursor-pointer transition-colors ${
                          selectedAddressId === addr.id
                            ? 'border-amzn-input-focus bg-orange-50/30'
                            : 'border-amzn-border-primary hover:border-amzn-text-tertiary'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => handleSelectAddress(addr)}
                          className="mt-1 accent-amzn-input-focus"
                        />
                        <div className="flex-1">
                          <p className="text-[14px] font-bold text-amzn-text-primary">
                            {addr.fullName}
                            {addr.isDefault && (
                              <span className="ml-2 text-[12px] font-normal text-amzn-text-secondary bg-amzn-bg-tertiary px-2 py-0.5 rounded-amzn-sm">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="text-[14px] text-amzn-text-primary">
                            {addr.addressLine1}
                            {addr.addressLine2 && `, ${addr.addressLine2}`}
                          </p>
                          <p className="text-[14px] text-amzn-text-primary">
                            {addr.city}, {addr.state} {addr.postalCode}
                          </p>
                          <p className="text-[14px] text-amzn-text-secondary">
                            Phone: {addr.phone}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Toggle new address form */}
                {!showNewAddress && (
                  <button
                    onClick={() => setShowNewAddress(true)}
                    className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-0 p-0 mb-4"
                  >
                    + Add a new address
                  </button>
                )}

                {/* New address form */}
                {showNewAddress && (
                  <div className="border border-amzn-border-primary rounded-amzn-md p-5 mb-4 bg-amzn-bg-tertiary/30">
                    <h3 className="text-[14px] font-bold text-amzn-text-primary mb-3">
                      Add a new delivery address
                    </h3>
                    <AddressForm onSubmit={handleNewAddress} loading={loading} />
                  </div>
                )}

                {/* Continue button */}
                <div className="pt-2 border-t border-amzn-border-primary">
                  <Button
                    size="sm"
                    className="h-10"
                    onClick={handleStep1Continue}
                    disabled={!shippingAddress}
                  >
                    Deliver to this address
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {currentStep === 2 && (
              <div className="bg-white border border-amzn-border-primary rounded-amzn-md p-5">
                <h2 className="text-[18px] font-bold text-amzn-text-primary mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Select a payment method
                </h2>

                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-4 border rounded-amzn-md cursor-pointer transition-colors ${
                        paymentMethod === option.value
                          ? 'border-amzn-input-focus bg-orange-50/30'
                          : 'border-amzn-border-primary hover:border-amzn-text-tertiary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === option.value}
                        onChange={() => setPaymentMethod(option.value)}
                        className="mt-1 accent-amzn-input-focus"
                      />
                      <div>
                        <p className="text-[14px] font-bold text-amzn-text-primary">
                          {option.label}
                        </p>
                        <p className="text-[13px] text-amzn-text-secondary">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="pt-4 border-t border-amzn-border-primary mt-4">
                  <Button size="sm" className="h-10" onClick={handleStep2Continue}>
                    Use this payment method
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Place Order */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {/* Shipping address review */}
                <div className="bg-white border border-amzn-border-primary rounded-amzn-md p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[16px] font-bold text-amzn-text-primary">Shipping address</h3>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-[13px] text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-0 p-0"
                    >
                      Change
                    </button>
                  </div>
                  {shippingAddress && (
                    <div className="text-[14px] text-amzn-text-primary">
                      <p className="font-bold">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                      <p className="text-amzn-text-secondary">Phone: {shippingAddress.phone}</p>
                    </div>
                  )}
                </div>

                {/* Payment method review */}
                <div className="bg-white border border-amzn-border-primary rounded-amzn-md p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[16px] font-bold text-amzn-text-primary">Payment method</h3>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-[13px] text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-0 p-0"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-[14px] text-amzn-text-primary">
                    {PAYMENT_OPTIONS.find((o) => o.value === paymentMethod)?.label || 'Cash on Delivery'}
                  </p>
                </div>

                {/* Items review */}
                <div className="bg-white border border-amzn-border-primary rounded-amzn-md p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5" />
                    <h3 className="text-[16px] font-bold text-amzn-text-primary">
                      Review items and delivery
                    </h3>
                  </div>

                  <div className="space-y-4 divide-y divide-amzn-border-primary">
                    {items.map((item) => {
                      const product = item.product;
                      const price = item.effectivePrice || product?.basePrice || 0;
                      const imageUrl = product?.images?.[0]?.imageUrl || '/placeholder.png';
                      return (
                        <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                          <div className="w-[60px] h-[60px] flex items-center justify-center shrink-0">
                            <Image
                              src={imageUrl}
                              alt={product?.name || 'Product'}
                              width={60}
                              height={60}
                              className="max-h-[60px] max-w-[60px] object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] text-amzn-text-primary line-clamp-1">
                              {product?.name}
                            </p>
                            <p className="text-[13px] text-amzn-text-secondary">
                              Qty: {item.quantity}
                              {item.variant && ` | ${item.variant.variantName}`}
                            </p>
                          </div>
                          <p className="text-[14px] font-bold text-amzn-text-primary shrink-0">
                            {formatPrice(price * item.quantity).formatted}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-amzn-border-primary">
                    <Badge variant="prime" />
                    <p className="text-[13px] text-amzn-text-secondary mt-1">
                      FREE delivery: {getEstimatedDelivery()}
                    </p>
                  </div>
                </div>

                {/* Place Order */}
                <div className="bg-white border border-amzn-border-primary rounded-amzn-md p-5">
                  {/* Order total breakdown */}
                  <div className="space-y-2 mb-4 text-[14px]">
                    <div className="flex justify-between">
                      <span className="text-amzn-text-secondary">Items ({items.length}):</span>
                      <span className="text-amzn-text-primary">{subtotalFormatted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amzn-text-secondary">Delivery:</span>
                      <span className={shippingCost === 0 ? 'text-amzn-success' : 'text-amzn-text-primary'}>
                        {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost).formatted}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amzn-text-secondary">Estimated tax:</span>
                      <span className="text-amzn-text-primary">{formatPrice(tax).formatted}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-amzn-border-primary">
                      <span className="font-bold text-[18px] text-amzn-text-primary">Order total:</span>
                      <span className="font-bold text-[18px] text-amzn-text-primary">{totalFormatted}</span>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    size="lg"
                    className="h-11 font-bold"
                    onClick={handlePlaceOrder}
                    loading={placingOrder}
                  >
                    Place your order
                  </Button>

                  <p className="text-[12px] text-amzn-text-tertiary text-center mt-2">
                    By placing your order, you agree to Amazon&apos;s{' '}
                    <span className="text-amzn-teal">Conditions of Use</span> and{' '}
                    <span className="text-amzn-teal">Privacy Notice</span>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="flex-[3]">
            <div className="sticky top-[80px] bg-white border border-amzn-border-primary rounded-amzn-md p-5">
              <h3 className="text-[16px] font-bold text-amzn-text-primary mb-3">Order Summary</h3>

              <div className="space-y-2 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-amzn-text-secondary">Items ({items.length}):</span>
                  <span className="text-amzn-text-primary">{subtotalFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amzn-text-secondary">Delivery:</span>
                  <span className={shippingCost === 0 ? 'text-amzn-success' : 'text-amzn-text-primary'}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost).formatted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amzn-text-secondary">Estimated tax:</span>
                  <span className="text-amzn-text-primary">{formatPrice(tax).formatted}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-amzn-border-primary">
                  <span className="font-bold text-[18px] text-amzn-text-primary">Order total:</span>
                  <span className="font-bold text-[18px] text-amzn-text-primary">{totalFormatted}</span>
                </div>
              </div>

              {currentStep === 3 && (
                <div className="mt-4">
                  <Button
                    fullWidth
                    size="lg"
                    className="h-11 font-bold"
                    onClick={handlePlaceOrder}
                    loading={placingOrder}
                  >
                    Place your order
                  </Button>
                </div>
              )}

              <div className="mt-3 flex items-center justify-center gap-1 text-[12px] text-amzn-text-tertiary">
                <ShieldCheck className="w-3.5 h-3.5 text-amzn-success" />
                Secure transaction
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
