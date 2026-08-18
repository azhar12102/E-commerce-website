"use client";
import Link from "next/link";
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
      <h1 className="mb-8 text-4xl font-bold">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <p className="text-lg text-gray-500">
            Your cart is empty.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => {
              const maximumReached =
                item.quantity >= item.stock;

              const outOfStock = item.stock <= 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-6 rounded-xl border bg-white p-6 shadow-sm md:flex-row"
                >
                  {/* Product Image */}
                  <div className="relative h-32 w-32 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Product Information */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">
                      {item.name}
                    </h2>

                    <p className="mt-2 font-bold text-blue-600">
                      Rs. {item.price}
                    </p>

                    {/* Stock */}
                    {outOfStock ? (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        Out of Stock
                      </p>
                    ) : item.stock <= 5 ? (
                      <p className="mt-2 text-sm font-semibold text-orange-600">
                        Only {item.stock} left
                      </p>
                    ) : (
                      <p className="mt-2 text-sm font-medium text-green-600">
                        {item.stock} available
                      </p>
                    )}

                    {/* Quantity Controls */}
                    <div className="mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          disabled={item.quantity <= 1}
                          className="rounded bg-gray-200 px-3 py-1 text-lg font-semibold transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          disabled={
                            maximumReached || outOfStock
                          }
                          className="rounded bg-gray-200 px-3 py-1 text-lg font-semibold transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      {/* Maximum Stock Message */}
                      {maximumReached &&
                        !outOfStock && (
                          <p className="mt-2 text-sm font-medium text-orange-600">
                            Maximum available stock reached
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Item Total
                    </p>

                    <p className="text-xl font-bold">
                      Rs.{" "}
                      {(
                        item.price * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="mt-10 rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-lg text-gray-600">
                Total
              </span>

              <span className="text-2xl font-bold">
                Rs. {totalPrice.toFixed(2)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-lg bg-blue-600 py-3 text-center font-medium text-white transition hover:bg-blue-700"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}