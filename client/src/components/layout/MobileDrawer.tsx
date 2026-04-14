"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import type { Category } from "@/types";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronDownIcon({ rotated }: { rotated: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-200 ${rotated ? "rotate-180" : ""}`}
    >
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" fill="currentColor" />
    </svg>
  );
}

const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    sortOrder: 1,
    isActive: true,
    children: [
      { id: 11, name: "Mobiles", slug: "mobiles", parentId: 1, sortOrder: 1, isActive: true },
      { id: 12, name: "Laptops", slug: "laptops", parentId: 1, sortOrder: 2, isActive: true },
    ],
  },
  {
    id: 2,
    name: "Books",
    slug: "books",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    name: "Fashion",
    slug: "fashion",
    sortOrder: 3,
    isActive: true,
    children: [
      { id: 31, name: "Men", slug: "men", parentId: 3, sortOrder: 1, isActive: true },
      { id: 32, name: "Women", slug: "women", parentId: 3, sortOrder: 2, isActive: true },
    ],
  },
  {
    id: 4,
    name: "Home & Kitchen",
    slug: "home-kitchen",
    sortOrder: 4,
    isActive: true,
  },
];

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [categories, setCategories] = useState<Category[]>(SAMPLE_CATEGORIES);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 z-50 h-full w-[80vw] max-w-[380px] bg-white overflow-y-auto transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between bg-amzn-dark-nav px-4 py-3">
          {isAuthenticated ? (
            <Link
              href="/account"
              className="text-[16px] font-bold text-white hover:no-underline"
              onClick={onClose}
            >
              Hello, {user?.name?.split(" ")[0] || "User"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[16px] font-bold text-white hover:no-underline"
              onClick={onClose}
            >
              Hello, Sign in
            </Link>
          )}
          <button
            onClick={onClose}
            className="text-white cursor-pointer bg-transparent border-0"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Trending section */}
        <div className="border-b border-amzn-border-primary py-3 px-4">
          <h3 className="text-[16px] font-bold text-amzn-text-primary mb-2">
            Trending
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/search?sort=bestselling"
                className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                onClick={onClose}
              >
                Best Sellers
              </Link>
            </li>
            <li>
              <Link
                href="/search?sort=newest"
                className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                onClick={onClose}
              >
                New Releases
              </Link>
            </li>
          </ul>
        </div>

        {/* Category list */}
        <div className="py-3 px-4">
          <h3 className="text-[16px] font-bold text-amzn-text-primary mb-2">
            Shop by Department
          </h3>
          <ul className="space-y-0">
            {categories.map((cat) => (
              <li key={cat.id}>
                <div className="flex items-center justify-between py-2 border-b border-amzn-border-secondary">
                  <Link
                    href={`/search?category=${cat.slug}`}
                    className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                    onClick={onClose}
                  >
                    {cat.name}
                  </Link>
                  {cat.children && cat.children.length > 0 && (
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className="text-amzn-text-tertiary cursor-pointer bg-transparent border-0 p-0"
                    >
                      <ChevronDownIcon rotated={expandedId === cat.id} />
                    </button>
                  )}
                </div>
                {cat.children && cat.children.length > 0 && expandedId === cat.id && (
                  <ul className="ml-4 space-y-0">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/search?category=${child.slug}`}
                          className="block py-2 text-[14px] text-amzn-text-secondary hover:text-amzn-teal border-b border-amzn-border-secondary"
                          onClick={onClose}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Help & Settings */}
        <div className="border-t border-amzn-border-primary py-3 px-4">
          <h3 className="text-[16px] font-bold text-amzn-text-primary mb-2">
            Help & Settings
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/account"
                className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                onClick={onClose}
              >
                Your Account
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                onClick={onClose}
              >
                Customer Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
