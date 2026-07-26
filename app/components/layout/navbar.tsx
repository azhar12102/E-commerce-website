"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
} from "lucide-react";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MobileStore
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          <Link href="/products" className="hover:text-blue-600 transition">
            Products
          </Link>

          <Link href="/categories" className="hover:text-blue-600 transition">
            Categories
          </Link>

          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>

          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </nav>

        {/* Search */}
        <div className="hidden flex-1 max-w-md md:flex">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Heart className="cursor-pointer hover:text-red-500 transition" />

          <ShoppingCart className="cursor-pointer hover:text-blue-600 transition" />

          <User className="cursor-pointer hover:text-blue-600 transition" />
        </div>
      </div>
    </header>
  );
}