"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-green-100 p-6">
        <span className="text-6xl">✅</span>
      </div>

      <h1 className="mt-6 text-4xl font-bold text-green-600">
        Order Placed Successfully!
      </h1>

      <p className="mt-4 text-gray-600">
        Thank you for shopping with MobileStore.
        <br />
        Your order has been received.
      </p>

      <Link
        href="/products"
        className="mt-8 rounded-lg bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </main>
  );
}