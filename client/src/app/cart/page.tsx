'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import Price from '@/components/ui/Price';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

// Local storage key for saved-for-later items
const SAVED_KEY = 'amazon_saved_for_later';

interface SavedItem {
  id: number;
  productId: number;
  product: CartItem['product'];
  variant: CartItem['variant'];
  effectivePrice: number;
  quantity: number;
}

function getSavedItems(): SavedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SAVED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSavedItems(items: SavedItem[]) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(items));
  } catch {}
}

export default function CartPage() {
  const { items, loading, fetchCart, updateQuantity, removeItem, addItem } = useCartStore();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [giftChecked, setGiftChecked] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    fetchCart();
    setSavedItems(getSavedItems());
  }, [fetchCart]);

  // Select all items by default when items load
  useEffect(() => {
    if (items.length > 0 && selectedIds.size === 0) {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  }, [items, selectedIds.size]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleSaveForLater = (item: CartItem) => {
    const saved: SavedItem = {
      id: item.id,
      productId: item.productId,
      product: item.product,
      variant: item.variant,
      effectivePrice: item.effectivePrice,
      quantity: item.quantity,
    };
    const updated = [...savedItems, saved];
    setSavedItems(updated);
    saveSavedItems(updated);
    removeItem(item.id);
  };

  const handleMoveToCart = (saved: SavedItem) => {
    addItem(saved.productId, null, saved.quantity);
    const updated = savedItems.filter((s) => s.id !== saved.id);
    setSavedItems(updated);
    saveSavedItems(updated);
  };

  const handleRemoveSaved = (saved: SavedItem) => {
    const updated = savedItems.filter((s) => s.id !== saved.id);
    setSavedItems(updated);
    saveSavedItems(updated);
  };

  const selectedItems = items.filter((item) => selectedIds.has(item.id));
  const subtotal = selectedItems.reduce((sum, item) => {
    const price = item.effectivePrice || item.product?.basePrice || 0;
    return sum + price * item.quantity;
  }, 0);

  const { formatted: subtotalFormatted } = formatPrice(subtotal);

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-amzn-bg-secondary">
        <Header />
        <SubNav />
        <main className="mx-auto max-w-amzn-container px-4 py-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-[7]">
              <Skeleton variant="card" className="h-[200px] mb-3" />
              <Skeleton variant="card" className="h-[200px] mb-3" />
            </div>
            <div className="flex-[3]">
              <Skeleton variant="card" className="h-[250px]" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amzn-bg-secondary">
      <Header />
      <SubNav />

      <main className="mx-auto max-w-amzn-container px-4 py-6">
        {items.length === 0 && savedItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-amzn-md p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-amzn-text-tertiary mx-auto mb-4" />
            <h2 className="text-[28px] font-bold text-amzn-text-primary mb-2">
              Your Amazon Cart is empty
            </h2>
            <p className="text-[14px] text-amzn-text-secondary mb-4">
              Your shopping cart is waiting. Give it purpose -- fill it with groceries, clothing, supplies, and more.
            </p>
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
              >
                Continue shopping on the Amazon.in homepage
              </Link>
              <Link
                href="/search?q=deals"
                className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
              >
                Today&apos;s Deals
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Left: Cart Items */}
            <div className="flex-[7]">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-[28px] font-bold text-amzn-text-primary">Shopping Cart</h1>
                <span className="text-[13px] text-amzn-text-secondary">Price</span>
              </div>

              {/* Deselect all */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={deselectAll}
                  className="text-[13px] text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Deselect all items
                </button>
                <span className="text-[13px] text-amzn-text-secondary">
                  {items.length === selectedIds.size ? 'All items selected' : `${selectedIds.size} of ${items.length} selected`}
                </span>
              </div>

              {/* Cart Items List */}
              {items.length > 0 && (
                <div className="bg-white rounded-amzn-md divide-y divide-amzn-border-primary">
                  {items.map((item) => (
                    <CartRow
                      key={item.id}
                      item={item}
                      selected={selectedIds.has(item.id)}
                      onToggleSelect={() => toggleSelect(item.id)}
                      onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeItem(item.id)}
                      onSaveForLater={() => handleSaveForLater(item)}
                    />
                  ))}
                </div>
              )}

              {/* Subtotal bottom */}
              <div className="py-4 text-right">
                <span className="text-[18px] text-amzn-text-primary">
                  Subtotal ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}):{' '}
                  <span className="font-bold">{subtotalFormatted}</span>
                </span>
              </div>

              {/* Saved for Later Section */}
              {savedItems.length > 0 && (
                <>
                  <h2 className="text-[20px] font-bold text-amzn-text-primary mt-6 mb-3">
                    Saved for Later ({savedItems.length})
                  </h2>
                  <div className="bg-white rounded-amzn-md divide-y divide-amzn-border-primary">
                    {savedItems.map((saved) => (
                      <SavedRow
                        key={saved.id}
                        item={saved}
                        onMoveToCart={() => handleMoveToCart(saved)}
                        onRemove={() => handleRemoveSaved(saved)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right: Cart Summary Sidebar */}
            <div className="flex-[3]">
              <div className="sticky top-[110px] bg-white border border-amzn-border-primary rounded-amzn-md p-5">
                {/* Gift checkbox */}
                <label className="flex items-center gap-2 text-[13px] text-amzn-text-primary mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giftChecked}
                    onChange={(e) => setGiftChecked(e.target.checked)}
                    className="w-4 h-4 accent-amzn-input-focus"
                  />
                  Add a gift message
                </label>

                {/* Subtotal */}
                <p className="text-[18px] text-amzn-text-primary mb-4">
                  Subtotal ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}):{' '}
                  <span className="font-bold">{subtotalFormatted}</span>
                </p>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button fullWidth size="sm" className="h-10">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Prime badge */}
                <div className="mt-3 flex items-center justify-center">
                  <Badge variant="prime" />
                </div>

                {/* Free delivery note */}
                <p className="mt-2 text-[13px] text-amzn-text-secondary text-center">
                  FREE delivery on eligible orders
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* Individual Cart Item Row */
interface CartRowProps {
  item: CartItem;
  selected: boolean;
  onToggleSelect: () => void;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
  onSaveForLater: () => void;
}

function CartRow({ item, selected, onToggleSelect, onQuantityChange, onRemove, onSaveForLater }: CartRowProps) {
  const product = item.product;
  const price = item.effectivePrice || product?.basePrice || 0;
  const { formatted: priceFormatted } = formatPrice(price * item.quantity);
  const imageUrl = product?.images?.[0]?.imageUrl || `/placeholder.png`;
  const stock = item.variant?.stock ?? product?.variants?.[0]?.stock ?? 10;
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="flex items-start gap-4 py-5 px-4">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        className="w-4 h-4 mt-1 accent-amzn-input-focus shrink-0 cursor-pointer"
      />

      {/* Product Image */}
      <Link
        href={`/product/${item.productId}`}
        className="shrink-0 w-[180px] h-[180px] flex items-center justify-center"
      >
        <Image
          src={imageUrl}
          alt={product?.name || 'Product'}
          width={180}
          height={180}
          className="max-h-[180px] max-w-[180px] object-contain"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.productId}`}
          className="text-[16px] text-amzn-teal hover:text-amzn-teal-hover hover:underline line-clamp-2 leading-5 block mb-1"
        >
          {product?.name || 'Product'}
        </Link>

        {/* Stock status */}
        <p className="text-[14px] mb-1">
          {isInStock ? (
            isLowStock ? (
              <Badge variant="stock" text={`Only ${stock} left in stock - order soon`} />
            ) : (
              <Badge variant="stock" text="In Stock" />
            )
          ) : (
            <Badge variant="stock" text="Out of Stock" />
          )}
        </p>

        {/* Variant info */}
        {item.variant && (
          <p className="text-[14px] text-amzn-text-secondary mb-1">
            {item.variant.variantName}
          </p>
        )}

        {/* Action row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[13px] mt-2">
          <QuantitySelector
            value={item.quantity}
            onChange={onQuantityChange}
            max={Math.max(stock, 10)}
          />
          <span className="text-amzn-border-primary">|</span>
          <button
            onClick={onRemove}
            className="text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Delete
          </button>
          <span className="text-amzn-border-primary hidden sm:inline">|</span>
          <button
            onClick={onSaveForLater}
            className="text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Save for Later
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        <Price price={price} mrp={product?.mrp} size="sm" />
        {item.quantity > 1 && (
          <p className="text-[12px] text-amzn-text-tertiary mt-0.5">
            ({formatPrice(price).formatted} x {item.quantity})
          </p>
        )}
      </div>
    </div>
  );
}

/* Saved for Later Row */
interface SavedRowProps {
  item: SavedItem;
  onMoveToCart: () => void;
  onRemove: () => void;
}

function SavedRow({ item, onMoveToCart, onRemove }: SavedRowProps) {
  const product = item.product;
  const price = item.effectivePrice || product?.basePrice || 0;
  const imageUrl = product?.images?.[0]?.imageUrl || `/placeholder.png`;

  return (
    <div className="flex items-start gap-4 py-4 px-4">
      {/* Product Image */}
      <Link
        href={`/product/${item.productId}`}
        className="shrink-0 w-[140px] h-[140px] flex items-center justify-center"
      >
        <Image
          src={imageUrl}
          alt={product?.name || 'Product'}
          width={140}
          height={140}
          className="max-h-[140px] max-w-[140px] object-contain"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.productId}`}
          className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline line-clamp-2 leading-5 block mb-1"
        >
          {product?.name || 'Product'}
        </Link>

        {item.variant && (
          <p className="text-[13px] text-amzn-text-secondary mb-1">
            {item.variant.variantName}
          </p>
        )}

        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[13px] mt-2">
          <button
            onClick={onMoveToCart}
            className="text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Move to Cart
          </button>
          <span className="text-amzn-border-primary">|</span>
          <button
            onClick={onRemove}
            className="text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        <Price price={price} mrp={product?.mrp} size="sm" />
      </div>
    </div>
  );
}
