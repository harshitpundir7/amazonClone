"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MobileDrawer from "./MobileDrawer";
import api from "@/lib/api";

interface TopCategory {
  id: number;
  name: string;
  slug: string;
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor" />
    </svg>
  );
}

const navItemBase =
  "flex items-center border border-transparent hover:border-white rounded-amzn-xs px-2 py-1 cursor-pointer transition-colors";

// Static links that are always shown (Amazon standard nav items)
const STATIC_LINKS = [
  { label: "Today's Deals", href: "/search?sort=price_asc" },
  { label: "Customer Service", href: "#" },
];

export default function SubNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<TopCategory[]>([]);

  useEffect(() => {
    api.get("/categories")
      .then((res: any) => {
        const cats = res.data?.categories || res.categories || res.data || [];
        const topLevel = cats
          .filter((c: any) => !c.parentId)
          .map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }));
        setCategories(topLevel);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <nav className="sticky top-[60px] z-30 h-subnav-height bg-amzn-sub-nav">
        <div className="mx-auto flex h-full max-w-amzn-container items-center px-2">
          {/* Hamburger All button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`${navItemBase} font-bold text-white`}
          >
            <MenuIcon />
            <span className="ml-1 text-[14px]">All</span>
          </button>

          {/* Static nav links */}
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {STATIC_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-[14px] text-white border border-transparent hover:border-white rounded-amzn-xs px-2 py-1 cursor-pointer transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Dynamic category links */}
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="whitespace-nowrap text-[14px] text-white border border-transparent hover:border-white rounded-amzn-xs px-2 py-1 cursor-pointer transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Right promotional text */}
          <div className="ml-auto shrink-0">
            <Link
              href="/search?sort=price_asc"
              className="text-[13px] italic text-gray-300 hover:text-white"
            >
              Shop deals in Electronics
            </Link>
          </div>
        </div>
      </nav>

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
