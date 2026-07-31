"use client";
import Image from "next/image";
import { useCart } from "@/app/context/cartcontext";
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
import { useRouter } from "next/navigation";
import { useWishlist } from "@/app/context/wishlistcontext";
export default function Navbar() {

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const handleSearch = () => {
    if (!search.trim()) return;

    router.push(
      `/products?search=${encodeURIComponent(search)}`
    );

    setSearch("");
  };
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          onClick={closeMenu}
        >
          <Image
            src="/images/logo/logo.png"
            alt="MobileVerse Logo"
            width={180}
            height={55}
            priority
            className="h-16 w-auto"


          />


        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="transition hover:text-blue-600">
            Home
          </Link>

          <Link href="/products" className="transition hover:text-blue-600">
            Products
          </Link>

          <Link href="/categories" className="transition hover:text-blue-600">
            Categories
          </Link>

          <Link
            href="/orders"
            className="transition hover:text-blue-600"
          >
            My Orders
          </Link>

          <Link href="/about" className="transition hover:text-blue-600">
            About
          </Link>

          <Link href="/contact" className="transition hover:text-blue-600">
            Contact
          </Link>
        </nav>

        {/* Desktop Search */}
        <div className="relative hidden w-full max-w-sm md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Desktop Icons */}
        <div className="hidden items-center gap-5 md:flex">
          {/* Wishlist */}
          <div className="relative">
            <Link href="/wishlist">
              <Heart className="cursor-pointer transition hover:text-red-500" />
            </Link>

            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </div>
          {/* Cart */}
          <div className="relative">
            <Link href="/cart">
              <ShoppingCart className="cursor-pointer transition hover:text-blue-600" />
            </Link>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartCount}
              </span>
            )}
          </div>

          {/* User */}
          <Link href="/login">
            <User className="cursor-pointer transition hover:text-blue-600" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="space-y-5 p-6">
            {/* Mobile Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
              />            </div>

            {/* Mobile Links */}
            <nav className="flex flex-col space-y-4">
              <Link href="/" onClick={closeMenu}>
                Home
              </Link>

              <Link href="/products" onClick={closeMenu}>
                Products
              </Link>

              <Link href="/categories" onClick={closeMenu}>
                Categories
              </Link>

              <Link href="/orders" onClick={closeMenu}>
                My Orders
              </Link>

              <Link href="/about" onClick={closeMenu}>
                About
              </Link>

              <Link href="/contact" onClick={closeMenu}>
                Contact
              </Link>



            </nav>

            <hr />

            {/* Mobile Icons */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <Link href="/wishlist" onClick={closeMenu}>
                  <Heart className="cursor-pointer transition hover:text-red-500" />
                </Link>

                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {wishlistCount}
                  </span>
                )}
              </div>

              <div className="relative">
                <Link href="/cart" onClick={closeMenu}>
                  <ShoppingCart className="cursor-pointer transition hover:text-blue-600" />
                </Link>

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </div>

              <Link href="/login" onClick={closeMenu}>
                <User className="cursor-pointer transition hover:text-blue-600" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}