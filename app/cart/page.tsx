"use client";

import Image from "next/image";
import { useCart } from "../context/cartcontext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-lg text-gray-500">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center gap-6 rounded-xl border p-6 shadow-sm md:flex-row"
              >
                <div className="relative h-32 w-32">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {item.name}
                  </h2>

                  <p className="mt-2 text-blue-600 font-bold">
                    ${item.price}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="rounded bg-gray-200 px-3 py-1"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="rounded bg-gray-200 px-3 py-1"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border p-6">
            <h2 className="text-2xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </h2>

            <button className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700">
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}