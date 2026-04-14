'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SearchFilters from '@/components/search/SearchFilters';
import SortDropdown from '@/components/search/SortDropdown';
import ProductGrid from '@/components/product/ProductGrid';
import Skeleton from '@/components/ui/Skeleton';
import api from '@/lib/api';
import type { Product, Category, SearchFilters as FilterState, PaginatedResponse } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const sort = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters: FilterState = {
    category: slug,
    sort,
    minPrice,
    maxPrice,
    rating,
    page: currentPage,
    limit: 24,
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/categories');
        setAllCategories(data.data || []);
      } catch {
        // silently fail
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await api.get(`/categories/${slug}`);
        setCategory(data.data || null);
      } catch {
        setCategory(null);
      }
    };
    fetchCategory();
  }, [slug]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const catId = category?.id;
      if (!catId) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const queryParams = new URLSearchParams();
      queryParams.set('categoryId', String(catId));
      if (sort) queryParams.set('sort', sort);
      if (minPrice !== undefined) queryParams.set('minPrice', String(minPrice));
      if (maxPrice !== undefined) queryParams.set('maxPrice', String(maxPrice));
      if (rating !== undefined) queryParams.set('rating', String(rating));
      queryParams.set('page', String(currentPage));
      queryParams.set('limit', '24');

      const data = await api.get(`/products?${queryParams.toString()}`);
      const result = data.data as PaginatedResponse<Product>;
      setProducts(result?.data || []);
      setTotalResults(result?.total || 0);
      setTotalPages(result?.totalPages || 1);
    } catch {
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [category?.id, sort, minPrice, maxPrice, rating, currentPage]);

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [fetchProducts, category]);

  const buildBreadcrumbs = () => {
    const items: { label: string; href?: string }[] = [{ label: 'Home', href: '/' }];
    if (category) {
      if (category.parentId) {
        const parent = findCategoryById(allCategories, category.parentId);
        if (parent) {
          items.push({ label: parent.name, href: `/category/${parent.slug}` });
        }
      }
      items.push({ label: category.name });
    }
    return items;
  };

  const findCategoryById = (cats: Category[], id: number): Category | null => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateURL = (newFilters: FilterState) => {
    const urlParams = new URLSearchParams();
    if (newFilters.sort && newFilters.sort !== 'featured') urlParams.set('sort', newFilters.sort);
    if (newFilters.minPrice !== undefined) urlParams.set('minPrice', String(newFilters.minPrice));
    if (newFilters.maxPrice !== undefined) urlParams.set('maxPrice', String(newFilters.maxPrice));
    if (newFilters.rating !== undefined) urlParams.set('rating', String(newFilters.rating));
    if (newFilters.page && newFilters.page > 1) urlParams.set('page', String(newFilters.page));
    const qs = urlParams.toString();
    router.push(`/category/${slug}${qs ? `?${qs}` : ''}`);
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

  const startItem = (currentPage - 1) * 24 + 1;
  const endItem = Math.min(currentPage * 24, totalResults);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SubNav />

      <main className="mx-auto max-w-amzn-container px-4 py-3">
        {/* Breadcrumbs */}
        <div className="mb-3">
          <Breadcrumbs items={buildBreadcrumbs()} />
        </div>

        <div className="flex gap-5">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block">
            <SearchFilters
              categories={allCategories}
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
                  categories={allCategories}
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
            {/* Category Title */}
            <h1 className="text-[24px] font-bold text-amzn-text-primary mb-1">
              {category?.name || slug}
            </h1>

            {/* Results Header */}
            <div className="flex items-start justify-between mb-3 gap-4">
              <div>
                {loading ? (
                  <div className="h-5 w-48 bg-amzn-border-secondary animate-pulse rounded" />
                ) : (
                  <p className="text-[14px] text-amzn-text-primary">
                    {totalResults > 0 ? (
                      <>
                        {startItem}-{endItem} of {totalResults} results
                      </>
                    ) : (
                      'No products found in this category'
                    )}
                  </p>
                )}
              </div>
              <SortDropdown value={sort} onChange={handleSortChange} />
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-[13px] text-amzn-teal hover:text-amzn-teal-hover mb-3 cursor-pointer bg-transparent border border-amzn-border-primary rounded-amzn-lg px-3 py-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Product Grid */}
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {!loading && totalResults > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-6 border-t border-amzn-border-primary mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`px-3 py-1.5 text-[13px] rounded-amzn-lg border border-amzn-border-primary cursor-pointer ${
                    currentPage <= 1
                      ? 'text-amzn-text-tertiary border-amzn-border-secondary cursor-not-allowed'
                      : 'text-amzn-teal hover:bg-amzn-bg-tertiary'
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
                      className={`w-8 h-8 text-[13px] rounded-amzn-lg border cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-amzn-dark-nav text-white border-amzn-dark-nav'
                          : 'border-amzn-border-primary text-amzn-teal hover:bg-amzn-bg-tertiary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1.5 text-[13px] rounded-amzn-lg border border-amzn-border-primary cursor-pointer ${
                    currentPage >= totalPages
                      ? 'text-amzn-text-tertiary border-amzn-border-secondary cursor-not-allowed'
                      : 'text-amzn-teal hover:bg-amzn-bg-tertiary'
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
