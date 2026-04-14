'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import type { Product, ProductVariant, ProductReview } from '@/types';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ReviewSection from '@/components/product/ReviewSection';
import Skeleton from '@/components/ui/Skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params?.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(`/products/${id}`);
        const productData: Product = data.data || data;
        setProduct(productData);

        // If product has reviews attached, use them; otherwise fetch separately
        if (productData.reviews && productData.reviews.length > 0) {
          setReviews(productData.reviews);
        } else {
          try {
            const reviewData = await api.get(`/products/${id}/reviews`);
            setReviews(reviewData.data || reviewData || []);
          } catch {
            // Reviews are optional, don't fail the page
            setReviews([]);
          }
        }
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading state with skeleton placeholders
  if (loading) {
    return (
      <div className="min-h-screen bg-amzn-bg-secondary">
        <Header />
        <SubNav />
        <div className="max-w-amzn-container mx-auto p-4 bg-white">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-[40%]">
              <Skeleton variant="image" className="h-[500px] w-full" />
            </div>
            <div className="md:w-[55%] space-y-4">
              <Skeleton variant="text" className="h-8 w-3/4" />
              <Skeleton variant="text" className="h-5 w-1/3" />
              <Skeleton variant="text" className="h-6 w-1/2" />
              <Skeleton variant="text" className="h-10 w-1/3" />
              <Skeleton variant="text" className="h-5 w-2/3" />
              <Skeleton variant="text" className="h-12 w-[260px]" />
              <Skeleton variant="text" className="h-12 w-[260px]" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-amzn-bg-secondary">
        <Header />
        <SubNav />
        <div className="max-w-amzn-container mx-auto p-8 bg-white text-center">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-4 text-amzn-text-tertiary"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
            />
          </svg>
          <h1 className="text-[24px] font-bold text-amzn-text-primary mb-2">
            Product not found
          </h1>
          <p className="text-[14px] text-amzn-text-secondary">
            We couldn&apos;t find the product you&apos;re looking for. It may have been removed or is temporarily unavailable.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Group specifications by groupName
  const specGroups: { groupName: string; specs: { key: string; value: string }[] }[] = [];
  if (product.specifications && product.specifications.length > 0) {
    const groupMap = new Map<string, { key: string; value: string }[]>();
    for (const spec of product.specifications) {
      if (!groupMap.has(spec.groupName)) {
        groupMap.set(spec.groupName, []);
      }
      groupMap.get(spec.groupName)!.push({
        key: spec.specKey,
        value: spec.specValue,
      });
    }
    for (const [groupName, specs] of groupMap) {
      specGroups.push({ groupName, specs });
    }
  }

  // Images for gallery: use product images, fallback to placeholder
  const images = product.images && product.images.length > 0
    ? product.images.sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  const avgRating = product.avgRating || 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <div className="min-h-screen bg-amzn-bg-secondary">
      <Header />
      <SubNav />

      <main className="max-w-amzn-container mx-auto bg-white">
        {/* Two-column product section */}
        <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
          {/* Left: Image gallery */}
          <div className="md:w-[40%] shrink-0">
            <ProductImageGallery images={images} />
          </div>

          {/* Right: Product info */}
          <div className="md:w-[55%]">
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />
          </div>
        </div>

        {/* Below two-column content */}
        <div className="border-t border-amzn-border-secondary mx-4 md:mx-6" />

        {/* Description section */}
        {product.longDesc && (
          <div className="px-4 md:px-6 py-6">
            <h2 className="text-[18px] font-bold text-amzn-text-primary mb-3">
              Product description
            </h2>
            <div
              className="text-[14px] text-amzn-text-primary leading-5 prose prose-sm max-w-none
                [&_a]:text-amzn-teal [&_a]:hover:text-amzn-teal-hover
                [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                [&_h1]:text-[18px] [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2
                [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2
                [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1
                [&_p]:mb-2 [&_li]:mb-1
                [&_table]:w-full [&_table]:border-collapse
                [&_th]:border [&_th]:border-amzn-border-primary [&_th]:px-3 [&_th]:py-2 [&_th]:bg-gray-100 [&_th]:text-left [&_th]:text-[13px]
                [&_td]:border [&_td]:border-amzn-border-primary [&_td]:px-3 [&_td]:py-2 [&_td]:text-[13px]
              "
              dangerouslySetInnerHTML={{ __html: product.longDesc }}
            />
          </div>
        )}

        {/* Specifications table */}
        {specGroups.length > 0 && (
          <div className="px-4 md:px-6 py-6 border-t border-amzn-border-secondary">
            <h2 className="text-[18px] font-bold text-amzn-text-primary mb-3">
              Product specifications
            </h2>
            <table className="w-full border-collapse text-[14px]">
              <tbody>
                {specGroups.map((group) => (
                  <React.Fragment key={group.groupName}>
                    {/* Group header row */}
                    <tr>
                      <th
                        colSpan={2}
                        className="bg-gray-100 text-left px-3 py-2 font-bold text-amzn-text-primary border border-amzn-border-primary"
                      >
                        {group.groupName}
                      </th>
                    </tr>
                    {/* Spec key-value rows */}
                    {group.specs.map((spec, idx) => (
                      <tr key={idx}>
                        <td className="border border-amzn-border-primary px-3 py-2 font-medium text-amzn-text-primary w-[35%] align-top">
                          {spec.key}
                        </td>
                        <td className="border border-amzn-border-primary px-3 py-2 text-amzn-text-secondary align-top">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews section */}
        <div className="px-4 md:px-6 border-t border-amzn-border-secondary">
          <ReviewSection
            reviews={reviews}
            avgRating={avgRating}
            reviewCount={reviewCount}
            productId={product.id}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
