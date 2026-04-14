"use client";

import React from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

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

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="sticky top-0 z-40 h-nav-height bg-amzn-dark-nav">
      <div className="mx-auto flex h-full max-w-amzn-container items-center justify-between px-2">
        {/* Left: Deliver to */}
        <Link href="/" className={`${navItemBase} shrink-0`}>
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
        <div className="mx-2 flex flex-1 max-w-[700px]">
          <div className="flex w-full overflow-hidden rounded-amzn-md shadow-amzn-sm">
            <select className="h-[40px] w-[130px] shrink-0 rounded-l-amzn-md border-0 bg-gray-200 px-2 text-[12px] text-amzn-text-primary outline-none">
              <option>All</option>
            </select>
            <input
              type="text"
              placeholder="Search Amazon.in"
              className="h-[40px] flex-1 border-0 px-3 text-[14px] text-amzn-text-primary outline-none placeholder:text-amzn-text-tertiary"
            />
            <button className="flex h-[40px] w-[45px] shrink-0 items-center justify-center rounded-r-amzn-md bg-amzn-gold hover:bg-amzn-gold-hover border-0 cursor-pointer">
              <SearchIcon />
            </button>
          </div>
        </div>

        {/* Right: Account, Orders, Cart */}
        <div className="flex items-center shrink-0">
          {/* Account & Lists */}
          <Link href="/account" className={navItemBase}>
            <UserIcon />
            <div className="ml-1 flex flex-col">
              <span className="text-[12px] text-gray-300">
                {isAuthenticated ? `Hello, ${user?.name?.split(" ")[0] || "User"}` : "Hello, Sign in"}
              </span>
              <span className="text-[14px] font-bold text-white">
                Account & Lists
              </span>
            </div>
          </Link>

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
              {totalItems > 0 && (
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
