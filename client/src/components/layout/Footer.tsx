"use client";

import React from "react";
import Link from "next/link";
import { FOOTER_COLUMNS } from "@/lib/constants";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto">
      {/* Back to top bar */}
      <button
        onClick={scrollToTop}
        className="w-full h-[40px] bg-amzn-back-to-top text-[13px] text-white hover:bg-[#485769] transition-colors cursor-pointer border-0"
      >
        Back to top
      </button>

      {/* Main footer */}
      <div className="bg-amzn-sub-nav py-10">
        <div className="mx-auto max-w-amzn-container grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-[16px] font-bold text-white mb-3">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[14px] text-amzn-border-primary hover:text-white hover:underline transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-amzn-dark-nav py-5">
        <div className="flex flex-col items-center justify-center gap-2">
          <Link href="/" className="text-[18px] font-bold text-white hover:no-underline">
            amazon<span className="text-amzn-gold">.in</span>
          </Link>
          <span className="text-[12px] text-gray-400">
            &copy; {new Date().getFullYear()}, Amazon Clone. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
