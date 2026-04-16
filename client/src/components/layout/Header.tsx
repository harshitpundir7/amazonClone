"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";
import AccountFlyout from "@/components/layout/AccountFlyout";
import LanguageSelector from "@/components/layout/LanguageSelector";

function MapPinIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        fill="#131921"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill="currentColor"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.04-.12.94-1.7h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z"
        fill="currentColor"
      />
    </svg>
  );
}

const navItemBase =
  "flex items-center border border-transparent hover:border-white rounded-amzn-xs px-2 py-1.5 cursor-pointer transition-colors";

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
}

export default function Header() {
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch top-level categories for search dropdown
  useEffect(() => {
    api.get("/categories")
      .then((res: any) => {
        const cats: Category[] = res.data?.categories || res.categories || res.data || [];
        const topLevel = cats.filter((c: Category) => !c.parentId);
        setCategories(topLevel);
      })
      .catch(() => {});
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(() => {
      api
        .get(`/products/search?q=${encodeURIComponent(q)}&limit=7`)
        .then((res: any) => {
          const products = res.data?.products || res.products || [];
          setSearchSuggestions(products);
          setShowSuggestions(products.length > 0);
        })
        .catch(() => {
          setSearchSuggestions([]);
          setShowSuggestions(false);
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions dropdown
  useEffect(() => {
    if (!showSuggestions) return;
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showSuggestions]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setShowSuggestions(false);
      const q = searchQuery.trim();
      if (!q) return;
      const params = new URLSearchParams({ q });
      if (selectedCategory && selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }
      router.push(`/search?${params.toString()}`);
      setSearchQuery("");
    },
    [searchQuery, selectedCategory, router]
  );

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 h-nav-height bg-amzn-dark-nav">
      <div className="mx-auto flex h-full max-w-amzn-container items-center justify-between px-2">
        {/* Left: Deliver to */}
        <Link href="/account" className={`${navItemBase} shrink-0`}>
          <MapPinIcon />
          <div className="ml-1 flex flex-col">
            <span className="text-[12px] text-gray-300">Hello</span>
            <span className="text-[14px] font-bold text-white">
              Select your address
            </span>
          </div>
        </Link>

        {/* Center-left: Logo */}
        <Link
          href="/"
          className={`${navItemBase} shrink-0 px-2 pt-2`}
        >
          <span className="text-[22px] font-bold text-white tracking-tight">
            amazon
          </span>
          <span className="relative -ml-0.5 text-[22px] text-white">
            .in
            <span className="absolute -bottom-0.5 right-0 text-amzn-gold text-[9px]">
              &#xe009;
            </span>
          </span>
        </Link>

        {/* Center: Search bar */}
        <div ref={suggestionsRef} className="relative mx-2 flex flex-1 max-w-[700px]">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="flex w-full overflow-hidden rounded-amzn-md shadow-amzn-sm">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-[40px] w-[130px] shrink-0 rounded-l-amzn-md border-0 bg-gray-200 px-2 text-[12px] text-amzn-text-primary outline-none"
              >
                <option value="all">All</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchSuggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Search Amazon.in"
                className="h-[40px] flex-1 border-0 px-3 text-[14px] text-amzn-text-primary outline-none focus:shadow-[0_0_0_3px_#f3a847_inset] placeholder:text-amzn-text-tertiary"
              />
              <button
                type="submit"
                className="flex h-[40px] w-[45px] shrink-0 items-center justify-center rounded-r-amzn-md bg-amzn-gold hover:bg-amzn-gold-hover border-0 cursor-pointer"
              >
                <SearchIcon />
              </button>
            </div>
          </form>
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute left-0 top-full z-50 w-full bg-white border border-amzn-border-primary border-t-0 rounded-b-amzn-md shadow-lg">
              {searchSuggestions.map((product: any) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setShowSuggestions(false);
                    router.push(`/product/${product.id}`);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-amzn-bg-tertiary cursor-pointer bg-transparent border-none"
                >
                  {product.images?.[0]?.imageUrl && (
                    <img
                      src={product.images[0].imageUrl}
                      alt={product.name}
                      className="h-[36px] w-[36px] shrink-0 object-contain"
                    />
                  )}
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-[13px] text-amzn-text-primary">
                      {product.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {product.category?.name && (
                        <span className="text-[11px] text-amzn-text-tertiary">
                          {product.category.name}
                        </span>
                      )}
                      <span className="text-[13px] text-amzn-text-primary">
                        ₹{product.basePrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  setShowSuggestions(false);
                  handleSearch({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="block w-full text-left px-3 py-2 text-[13px] text-amzn-link hover:bg-amzn-bg-tertiary cursor-pointer bg-transparent border-none border-t border-amzn-border-secondary"
              >
                See all results for &quot;{searchQuery.trim()}&quot;
              </button>
            </div>
          )}
        </div>

        {/* Right: Account, Orders, Cart */}
        <div className="flex items-center shrink-0">
          {/* Language selector */}
          <LanguageSelector />

          {/* Account & Lists */}
          <AccountFlyout
            isAuthenticated={!!(mounted && isAuthenticated)}
            userName={user?.name?.split(" ")[0]}
            onSignOut={handleSignOut}
          >
            <div className={navItemBase}>
              <UserIcon />
              <div className="ml-1 flex flex-col text-left">
                <span className="text-[12px] text-gray-300">
                  {mounted && isAuthenticated ? `Hello, ${user?.name?.split(" ")[0] || "User"}` : "Hello, Sign in"}
                </span>
                <span className="text-[14px] font-bold text-white">
                  Account & Lists
                </span>
              </div>
            </div>
          </AccountFlyout>

          {/* Returns & Orders */}
          <Link href="/orders" className={navItemBase}>
            <div className="flex flex-col">
              <span className="text-[12px] text-gray-300">Returns</span>
              <span className="text-[14px] font-bold text-white">& Orders</span>
            </div>
          </Link>

          {/* Cart */}
          <Link href="/cart" className={navItemBase}>
            <div className="relative">
              <CartIcon />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 left-[12px] text-[16px] font-bold text-amzn-orange">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="ml-1 text-[14px] font-bold text-white">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
