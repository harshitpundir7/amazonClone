"use client";

import React, { useState } from "react";
import { CATEGORY_NAV_LINKS } from "@/lib/constants";
import MobileDrawer from "./MobileDrawer";

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

export default function SubNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

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

          {/* Category links */}
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {CATEGORY_NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="whitespace-nowrap text-[14px] text-white border border-transparent hover:border-white rounded-amzn-xs px-2 py-1 cursor-pointer transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right promotional text */}
          <div className="ml-auto shrink-0">
            <span className="text-[13px] italic text-gray-300">
              Shop deals in Electronics
            </span>
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
