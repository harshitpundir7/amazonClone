'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { X, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import SearchFilters from '@/components/search/SearchFilters';
import SortDropdown from '@/components/search/SortDropdown';
import ProductGrid from '@/components/product/ProductGrid';
import ProductCard from '@/components/product/ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import Price from '@/components/ui/Price';
import api from '@/lib/api';
import type { Product, Category, SearchFilters as FilterState } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get('q') || '';
  const categorySlug = searchParams.get('category') || undefined;
  const sort = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filters: FilterState = {
    q: q || undefined,
    category: categorySlug,
    sort,
    minPrice,
    maxPrice,
    rating,
    page: currentPage,
    limit: 24,
  };

  // Compute active filter tags
  const activeFilterTags: { key: string; label: string; param: string }[] = [];
  if (categorySlug) {
    const cat = categories.find((c) => c.slug === categorySlug);
    activeFilterTags.push({ key: 'category', label: cat?.name || categorySlug, param: 'category' });
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    const label = `₹${minPrice || 0} - ₹${maxPrice || '+'}`;
    activeFilterTags.push({ key: 'price', label, param: 'price' });
  }
  if (rating !== undefined) {
    activeFilterTags.push({ key: 'rating', label: `${rating}★ & Up`, param: 'rating' });
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/categories') as any;
        setCategories(data?.data?.categories || []);
      } catch {
        // silently fail
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (categorySlug) params.set('category', categorySlug);
      if (sort) params.set('sort', sort);
      if (minPrice !== undefined) params.set('minPrice', String(minPrice));
      if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice));
      if (rating !== undefined) params.set('rating', String(rating));
      params.set('page', String(currentPage));
      params.set('limit', '24');

      const data = await api.get(`/products/search?${params.toString()}`) as any;
      const result = data?.data;
      setProducts(result?.products || []);
      setTotalResults(result?.pagination?.total || 0);
      setTotalPages(result?.pagination?.totalPages || 1);
    } catch {
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [q, categorySlug, sort, minPrice, maxPrice, rating, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (newFilters.q) params.set('q', newFilters.q);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.sort && newFilters.sort !== 'featured') params.set('sort', newFilters.sort);
    if (newFilters.minPrice !== undefined) params.set('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice !== undefined) params.set('maxPrice', String(newFilters.maxPrice));
    if (newFilters.rating !== undefined) params.set('rating', String(newFilters.rating));
    if (newFilters.page && newFilters.page > 1) params.set('page', String(newFilters.page));
    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    updateURL({ ...newFilters, page: 1 });
  };

  const handleSortChange = (newSort: string) => {
    updateURL({ ...filters, sort: newSort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFilterTag = (param: string) => {
    const newFilters = { ...filters, page: 1 };
    if (param === 'category') delete newFilters.category;
    if (param === 'price') { delete newFilters.minPrice; delete newFilters.maxPrice; }
    if (param === 'rating') delete newFilters.rating;
    updateURL(newFilters);
  };

  const clearAllFilters = () => {
    updateURL({ q: q || undefined, sort, page: 1, limit: 24 });
  };

  const startItem = (currentPage - 1) * 24 + 1;
  const endItem = Math.min(currentPage * 24, totalResults);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SubNav />

      <main className="mx-auto max-w-amzn-container px-4 py-3">
        <div className="flex gap-5">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block">
            <SearchFilters
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Mobile Filter Modal */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto p-4 shadow-amzn-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[18px] font-bold">Filters</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 border-0 bg-transparent cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <SearchFilters
                  categories={categories}
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    handleFilterChange(newFilters);
                    setMobileFiltersOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-start justify-between mb-3 gap-4">
              <div>
                {loading ? (
                  <div className="h-5 w-64 bg-amzn-border-secondary animate-pulse rounded" />
                ) : (
                  <p className="text-[14px] text-amzn-text-primary">
                    {totalResults > 0 ? (
                      <>
                        {startItem}-{endItem} of {totalResults} results for{' '}
                        <span className="font-bold">&quot;{q || 'all products'}&quot;</span>
                      </>
                    ) : (
                      <>No results for &quot;{q}&quot;</>
                    )}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Grid/List Toggle */}
                <div className="flex border border-amzn-border-primary rounded-amzn-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 cursor-pointer border-0 ${viewMode === 'grid' ? 'bg-amzn-bg-tertiary' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <LayoutGrid className="w-4 h-4 text-amzn-text-primary" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 cursor-pointer border-0 ${viewMode === 'list' ? 'bg-amzn-bg-tertiary' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4 text-amzn-text-primary" />
                  </button>
                </div>
                <SortDropdown value={sort} onChange={handleSortChange} />
              </div>
            </div>

            {/* Active filter tags */}
            {activeFilterTags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 mb-3">
                {activeFilterTags.map((tag) => (
                  <span
                    key={tag.key}
                    className="inline-flex items-center gap-1 bg-[#e6f3f7] text-amzn-teal text-[12px] px-2 py-0.5 rounded-amzn-xs border border-[#b8d9e3]"
                  >
                    {tag.label}
                    <button
                      onClick={() => removeFilterTag(tag.param)}
                      className="hover:text-amzn-teal-hover cursor-pointer bg-transparent border-0 p-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-[13px] text-amzn-teal hover:text-amzn-teal-hover hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-[13px] text-amzn-teal hover:text-amzn-teal-hover mb-3 cursor-pointer bg-transparent border border-amzn-border-primary rounded-amzn-lg px-3 py-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Product Grid / List */}
            {viewMode === 'grid' ? (
              <ProductGrid products={products} loading={loading} />
            ) : (
              <div className="divide-y divide-amzn-border-secondary">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4 py-4">
                      <Skeleton className="w-[200px] h-[200px]" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  ))
                ) : (
                  products.map((product) => (
                    <ProductListItem key={product.id} product={product} />
                  ))
                )}
              </div>
            )}

            {/* No results */}
            {!loading && totalResults === 0 && q && (
              <div className="py-10 text-center">
                <p className="text-[18px] font-bold text-amzn-text-primary mb-2">
                  No results found
                </p>
                <p className="text-[14px] text-amzn-text-secondary">
                  Try checking your spelling or use more general terms.
                </p>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalResults > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 py-6 border-t border-amzn-border-primary mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`px-3 py-1.5 text-[13px] rounded-l-amzn-lg border border-amzn-border-primary cursor-pointer ${
                    currentPage <= 1
                      ? 'text-amzn-text-tertiary border-amzn-border-secondary cursor-not-allowed'
                      : 'text-amzn-teal hover:bg-[#FFEBC1]'
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 text-[13px] border cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#FFEBC1] border-[#e77600] font-bold text-amzn-text-primary'
                          : 'border-amzn-border-primary text-amzn-teal hover:bg-[#FFEBC1]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1.5 text-[13px] rounded-r-amzn-lg border border-amzn-border-primary cursor-pointer ${
                    currentPage >= totalPages
                      ? 'text-amzn-text-tertiary border-amzn-border-secondary cursor-not-allowed'
                      : 'text-amzn-teal hover:bg-[#FFEBC1]'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* List view item component */
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import Image from 'next/image';
import Link from 'next/link';

function ProductListItem({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]?.imageUrl || '/placeholder.png';

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="shrink-0 w-[200px] h-[200px] flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="max-h-[200px] max-w-[200px] object-contain"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${product.id}`}
          className="text-[15px] text-amzn-teal hover:text-amzn-teal-hover hover:underline line-clamp-2 leading-5 block mb-1"
        >
          {product.name}
        </Link>
        <div className="mb-1">
          <StarRating
            rating={Number(product.avgRating || 0)}
            size="sm"
            count={product.reviewCount}
            showCount
          />
        </div>
        <div className="mb-1">
          <Price price={Number(product.basePrice || 0)} mrp={Number(product.mrp || 0)} size="sm" />
        </div>
        <div className="mb-1">
          <Badge variant="prime" />
        </div>
        {product.shortDesc && (
          <p className="text-[13px] text-amzn-text-secondary line-clamp-2">
            {product.shortDesc}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="shrink-0 w-[180px] flex flex-col items-end gap-2">
        <Link
          href={`/product/${product.id}`}
          className="w-full bg-amzn-cart-btn hover:bg-amzn-cart-btn-hover border border-amzn-cart-btn-border rounded-amzn-lg py-1.5 text-[13px] font-semibold text-amzn-text-primary text-center shadow-[0_1px_0_rgba(255,255,255,0.4)_inset]"
        >
          Add to Cart
        </Link>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white p-8">
          <div className="max-w-amzn-container mx-auto">
            <div className="flex gap-5">
              <div className="hidden md:block w-[220px] shrink-0">
                <Skeleton variant="card" className="h-[500px]" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-5 w-64 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="p-3">
                      <Skeleton variant="card" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
