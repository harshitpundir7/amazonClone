'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { Product, ProductVariant } from '@/types';
import { formatPrice, formatMrp, calculateDiscount, getEstimatedDelivery } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import StarRating from '@/components/ui/StarRating';
import Price from '@/components/ui/Price';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import VariantSelector from '@/components/product/VariantSelector';

interface ProductInfoProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
}

function ShieldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block text-amzn-teal"
    >
      <path
        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.23 9.36-7 10.57-3.77-1.21-7-5.74-7-10.57V6.3l7-3.12zm-1 5.82v2h2v-2h-2zm0 4v4h2v-4h-2z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ProductInfo({
  product,
  selectedVariant,
  onVariantChange,
}: ProductInfoProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addWishlist, isInWishlist, removeItem: removeWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Compute effective price / mrp from variant or product
  const effectivePrice =
    selectedVariant?.priceOverride ?? selectedVariant?.effectivePrice ?? product.basePrice;
  const effectiveMrp =
    selectedVariant?.mrpOverride ?? selectedVariant?.effectiveMrp ?? product.mrp;
  const discount = calculateDiscount(effectiveMrp, effectivePrice);
  const deliveryDate = getEstimatedDelivery();

  // Stock
  const stock = selectedVariant?.stock ?? product.variants?.[0]?.stock ?? 999;
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 10;

  // Breadcrumb items
  const breadcrumbItems = [];
  breadcrumbItems.push({ label: 'Home', href: '/' });
  if (product.category) {
    if (product.category.parentId !== null && product.category.parentId !== undefined) {
      breadcrumbItems.push({
        label: product.category.name,
        href: `/category/${product.category.slug}`,
      });
    } else {
      breadcrumbItems.push({
        label: product.category.name,
        href: `/category/${product.category.slug}`,
      });
    }
  }
  breadcrumbItems.push({ label: product.name });

  // Handlers
  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addItem(product.id, selectedVariant?.id ?? null, quantity);
      toast.success('Added to Cart');
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setAddingToCart(true);
    try {
      await addItem(product.id, selectedVariant?.id ?? null, quantity);
      router.push('/checkout');
    } catch (err) {
      toast.error('Failed to proceed');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeWishlist(product.id);
      toast.success('Removed from Wish List');
    } else {
      addWishlist(product.id);
      toast.success('Added to Wish List');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* 2. Title */}
      <h1 className="text-[24px] font-normal text-amzn-text-primary leading-7">
        {product.name}
      </h1>

      {/* 3. Brand link */}
      {product.brand && (
        <a
          href="#"
          className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline w-fit"
        >
          Visit the {product.brand.name} Store
        </a>
      )}

      {/* 4. Rating summary */}
      <div className="flex items-center gap-2 flex-wrap">
        <StarRating rating={product.avgRating} size="md" />
        <span className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover cursor-pointer">
          {product.avgRating.toFixed(1)} out of 5
        </span>
        <a
          href="#reviews"
          className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
        >
          {product.reviewCount.toLocaleString('en-IN')} ratings
        </a>
        {product.isFeatured && (
          <Badge variant="amazonChoice" text="Amazon's Choice" />
        )}
      </div>

      {/* 5. Price section */}
      <div className="border-t border-b border-amzn-border-secondary py-3 space-y-1.5">
        {/* Effective price */}
        <Price price={effectivePrice} mrp={effectiveMrp} size="lg" />

        {/* Savings line */}
        {discount > 0 && (
          <div className="text-[14px]">
            <span className="text-amzn-success font-medium">
              You Save: {formatMrp(effectiveMrp - effectivePrice)} ({discount}%)
            </span>
          </div>
        )}

        {/* Prime badge */}
        <div>
          <Badge variant="prime" />
        </div>

        {/* FREE Delivery */}
        <div className="text-[14px] text-amzn-text-primary">
          <span className="font-medium">FREE Delivery</span>{' '}
          <span className="text-amzn-text-secondary">
            by {deliveryDate}
          </span>
        </div>
      </div>

      {/* 6. Variant selector */}
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelect={onVariantChange}
        />
      )}

      {/* 7. Stock status */}
      <div>
        {isInStock ? (
          isLowStock ? (
            <Badge variant="stock" text={`Only ${stock} left in stock (more on the way)`} />
          ) : (
            <span className="text-[18px] font-bold text-amzn-success">In Stock</span>
          )
        ) : (
          <Badge variant="stock" text="Currently unavailable" />
        )}
      </div>

      {/* 8. Quantity selector */}
      {isInStock && (
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={Math.min(stock, 10)}
        />
      )}

      {/* 9. Action buttons */}
      <div className="flex flex-col gap-2 max-w-[260px] mt-1">
        <Button
          variant="primary"
          size="md"
          fullWidth
          loading={addingToCart}
          disabled={!isInStock}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          disabled={!isInStock}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      {/* 10. Add to List (wishlist) */}
      <div className="max-w-[260px]">
        <button
          onClick={handleWishlistToggle}
          className="text-[13px] text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          {isInWishlist(product.id) ? 'Remove from Wish List' : 'Add to Wish List'}
        </button>
      </div>

      {/* 11. Secure transaction */}
      <div className="flex items-center gap-1 text-[13px] text-amzn-text-secondary mt-1">
        <ShieldIcon />
        <span>Secure transaction</span>
      </div>
    </div>
  );
}
