"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";
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

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-amzn-text-tertiary"
    >
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor" />
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

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Fetch categories from API
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      api.get("/categories")
        .then((res: any) => {
          const cats = res.data?.categories || res.categories || res.data || [];
          const topLevel = cats.filter((c: Category) => !c.parentId);
          setCategories(topLevel);
        })
        .catch(() => {});
    }
  }, [isOpen, categories.length]);

  const handleSignOut = () => {
    onClose();
    logout();
    router.push("/");
  };

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
        className="fixed inset-0 z-[2000] bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 z-[2000] h-full w-[80vw] max-w-[380px] bg-white overflow-y-auto animate-[slideIn_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between bg-amzn-sub-nav px-4 py-3">
          {isAuthenticated ? (
            <Link
              href="/account"
              className="flex items-center gap-2 text-[16px] font-bold text-white hover:no-underline"
              onClick={onClose}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="rounded-full bg-amzn-dark-nav p-0.5">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
              </svg>
              Hello, {user?.name?.split(" ")[0] || "User"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-[16px] font-bold text-white hover:no-underline"
              onClick={onClose}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="rounded-full bg-amzn-dark-nav p-0.5">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
              </svg>
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
            <li className="flex items-center justify-between">
              <Link
                href="/search?sort=bestselling"
                className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                onClick={onClose}
              >
                Best Sellers
              </Link>
              <ChevronRightIcon />
            </li>
            <li className="flex items-center justify-between">
              <Link
                href="/search?sort=newest"
                className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                onClick={onClose}
              >
                New Releases
              </Link>
              <ChevronRightIcon />
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
                    href={`/category/${cat.slug}`}
                    className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                    onClick={onClose}
                  >
                    {cat.name}
                  </Link>
                  {cat.children && cat.children.length > 0 ? (
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className="text-amzn-text-tertiary cursor-pointer bg-transparent border-0 p-0"
                    >
                      <ChevronDownIcon rotated={expandedId === cat.id} />
                    </button>
                  ) : (
                    <ChevronRightIcon />
                  )}
                </div>
                {cat.children && cat.children.length > 0 && expandedId === cat.id && (
                  <ul className="ml-4 space-y-0">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/category/${child.slug}`}
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
            <li className="flex items-center justify-between">
              <Link
                href="/account"
                className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                onClick={onClose}
              >
                Your Account
              </Link>
              <ChevronRightIcon />
            </li>
            <li className="flex items-center justify-between">
              <Link
                href="/orders"
                className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                onClick={onClose}
              >
                Your Orders
              </Link>
              <ChevronRightIcon />
            </li>
            <li className="flex items-center justify-between">
              <Link
                href="/wishlist"
                className="text-[14px] text-amzn-text-primary hover:text-amzn-teal"
                onClick={onClose}
              >
                Your Wishlist
              </Link>
              <ChevronRightIcon />
            </li>
            {isAuthenticated && (
              <li>
                <button
                  onClick={handleSignOut}
                  className="text-[14px] text-amzn-text-primary hover:text-amzn-teal cursor-pointer bg-transparent border-none p-0"
                >
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
