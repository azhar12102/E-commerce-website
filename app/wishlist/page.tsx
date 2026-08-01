"use client";
import Link from "next/link";
import { useWishlist } from "../context/wishlistcontext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">My Wishlist</h1>
        <p className="text-gray-600">Your wishlist is empty.</p>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-4 shadow-sm"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-48 w-full object-contain"
            />

            <h2 className="mt-4 font-semibold">{item.name}</h2>

            <p className="mt-2 text-blue-600 font-bold">
              Rs. {item.price}
            </p>

            <button
              onClick={() => removeFromWishlist(item.id)}
              className="mt-4 w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}