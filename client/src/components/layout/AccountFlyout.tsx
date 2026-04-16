"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AccountFlyoutProps {
  isAuthenticated: boolean;
  userName?: string;
  onSignOut: () => void;
  children: React.ReactNode;
}

const yourLists = [
  { label: "Your List", href: "/wishlist" },
  { label: "Create a Wish List", href: "/wishlist?action=create" },
  { label: "Find a Wish List", href: "/wishlist?action=find" },
];

const yourAccount = [
  { label: "Your Account", href: "/account" },
  { label: "Your Orders", href: "/orders" },
  { label: "Your Wishlist", href: "/wishlist" },
  { label: "Recommendations", href: "/recommendations" },
  { label: "Settings", href: "/account/settings" },
];

export default function AccountFlyout({
  isAuthenticated,
  userName,
  onSignOut,
  children,
}: AccountFlyoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}

      {open && (
        <div className="absolute right-0 top-full z-50 pt-2">
          {/* CSS triangle pointing up */}
          <div className="flex justify-center">
            <div
              className="h-0 w-0"
              style={{
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "10px solid #e0e0e0",
              }}
            />
          </div>

          <div className="relative -mt-[1px] w-[500px] rounded-md border border-gray-200 bg-white shadow-lg">
            {/* Authenticated greeting or Sign in CTA */}
            <div className="border-b border-gray-200 px-5 py-4">
              {isAuthenticated ? (
                <p className="text-sm font-bold text-gray-800">
                  Hello, {userName || "User"}
                </p>
              ) : (
                <Link
                  href="/login"
                  className="inline-block w-full rounded-md bg-amzn-gold px-4 py-2 text-center text-sm font-bold text-amzn-dark-nav hover:bg-amzn-gold-hover"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-2 px-5 py-3">
              {/* Left column - Your Lists */}
              <div className="pr-4 border-r border-gray-200">
                <h3 className="mb-2 text-sm font-bold text-gray-800">
                  Your Lists
                </h3>
                <ul className="space-y-1.5">
                  {yourLists.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-[13px] text-amzn-text-primary hover:text-amzn-orange hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right column - Your Account */}
              <div className="pl-4">
                <h3 className="mb-2 text-sm font-bold text-gray-800">
                  Your Account
                </h3>
                <ul className="space-y-1.5">
                  {yourAccount.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-[13px] text-amzn-text-primary hover:text-amzn-orange hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sign out button - only when authenticated */}
            {isAuthenticated && (
              <div className="border-t border-gray-200 px-5 py-3">
                <button
                  onClick={onSignOut}
                  className="text-[13px] text-amzn-text-primary hover:text-amzn-orange hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
