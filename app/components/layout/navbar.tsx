"use client";

import Image from "next/image";
import { useCart } from "@/app/context/cartcontext";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import toast from "react-hot-toast";
export default function Navbar() {
  const { cartCount,clearCart } = useCart();
  const { wishlistCount } = useWishlist();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const [loadingUser, setLoadingUser] = useState(true);

  const closeMenu = () => setIsOpen(false);

  const handleSearch = () => {
    if (!search.trim()) return;

    router.push(
      `/products?search=${encodeURIComponent(search)}`
    );

    setSearch("");
  };

  // Check logged-in user
 useEffect(() => {
  const getUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to get user:", error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  getUser();

  const handleAuthChange = () => {
    getUser();
  };

  window.addEventListener("auth-change", handleAuthChange);

  return () => {
    window.removeEventListener(
      "auth-change",
      handleAuthChange
    );
  };
}, []);
  // Logout
  const handleLogout = async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    console.log("Logout status:", response.status);

    if (response.ok) {
      clearCart();
      localStorage.removeItem("cart");

      console.log(
        "Cart after logout:",
        localStorage.getItem("cart")
      );

      setUser(null);

      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/">
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
          <Link
            href="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="transition hover:text-blue-600"
          >
            Products
          </Link>

          <Link
            href="/categories"
            className="transition hover:text-blue-600"
          >
            Categories
          </Link>

          <Link
            href="/orders"
            className="transition hover:text-blue-600"
          >
            My Orders
          </Link>

          <Link
            href="/about"
            className="transition hover:text-blue-600"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-blue-600"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Search */}
        <div className="relative hidden w-full max-w-xs md:block">
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
          {!loadingUser &&
            (user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Hi, {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">
                <User className="cursor-pointer transition hover:text-blue-600" />
              </Link>
            ))}
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
                    closeMenu();
                  }
                }}
                className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </div>

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
              {/* Wishlist */}
              <div className="relative">
                <Link
                  href="/wishlist"
                  onClick={closeMenu}
                >
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
                <Link
                  href="/cart"
                  onClick={closeMenu}
                >
                  <ShoppingCart className="cursor-pointer transition hover:text-blue-600" />
                </Link>

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Mobile User */}
              {!loadingUser &&
                (user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      Hi, {user.name}
                    </span>

                    <button
                      onClick={handleLogout}
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                  >
                    <User className="cursor-pointer transition hover:text-blue-600" />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}