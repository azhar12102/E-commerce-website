"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../context/cartcontext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!customerName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!customerPhone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!customerAddress.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total: totalPrice,
          paymentMethod: "Cash on Delivery",

          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress.trim(),

          items: cart.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to place your order."
        );
        return;
      }

      // Clear cart only after successful order
      clearCart();

      toast.success("Order placed successfully!");

      router.push("/orderSucess");
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold">
            Your Cart Is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some products before proceeding to checkout.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">

        {/* Customer Information */}
        <section className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Delivery Information
            </h2>

            <div className="space-y-5">

              {/* Name */}
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="customerPhone"
                  className="mb-2 block text-sm font-semibold"
                >
                  Phone Number
                </label>

                <input
                  id="customerPhone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(e.target.value)
                  }
                  placeholder="03XX XXXXXXX"
                  className="w-full rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  disabled={loading}
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="customerAddress"
                  className="mb-2 block text-sm font-semibold"
                >
                  Delivery Address
                </label>

                <textarea
                  id="customerAddress"
                  value={customerAddress}
                  onChange={(e) =>
                    setCustomerAddress(e.target.value)
                  }
                  placeholder="Enter your complete delivery address"
                  rows={4}
                  className="w-full resize-none rounded-lg border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  disabled={loading}
                />
              </div>

            </div>
          </div>

          {/* Products */}
          <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Your Order
            </h2>

            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Rs. {item.price} each
                    </p>
                  </div>

                  <p className="font-bold">
                    Rs.{" "}
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <aside>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>
                  Rs. {totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>

                <span>Free</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-blue-600">
                    Rs. {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-8">
              <h3 className="mb-3 font-semibold">
                Payment Method
              </h3>

              <div className="rounded-lg border-2 border-blue-600 bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-600">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-600">
                      Pay when your order is delivered.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`mt-8 w-full rounded-lg px-6 py-3 font-semibold text-white transition ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <Link
              href="/cart"
              className="mt-3 block text-center text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              ← Back to Cart
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}