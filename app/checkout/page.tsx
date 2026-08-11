"use client";

import toast from "react-hot-toast";
import { useCart } from "../context/cartcontext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  // Check whether the user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          toast.error("Please login to continue.");
          router.push("/login");
          return;
        }

        const data = await response.json();

        setUser(data.user);

        // Automatically fill the user's name
        if (data.user?.name) {
          setName(data.user.name);
        }
      } catch (error) {
        console.error("Auth check failed:", error);

        toast.error("Please login to continue.");
        router.push("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, [router]);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    // Extra frontend authentication check
    if (!user) {
      toast.error("Please login to place an order.");
      router.push("/login");
      return;
    }

    // Check customer information
    if (!name || !phone || !address || !city) {
      toast.error("Please fill in all customer details.");
      return;
    }

    // Check cart
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Check card information
    if (
      paymentMethod === "Credit / Debit Card" &&
      (!cardNumber || !expiryDate || !cvv)
    ) {
      toast.error("Please enter your card details.");
      return;
    }

    // Check EasyPaisa / JazzCash number
    if (
      (paymentMethod === "EasyPaisa" ||
        paymentMethod === "JazzCash") &&
      !mobileNumber
    ) {
      toast.error("Please enter your mobile number.");
      return;
    }

    try {
      setPlacingOrder(true);

      // Send order to our backend API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total,
          paymentMethod,
          items: cart,
        }),
      });

      const data = await response.json();

      console.log("ORDER STATUS:", response.status);
      console.log("ORDER RESPONSE:", data);

      // If backend returns an error
      if (!response.ok) {
        toast.error(data.error || "Failed to place order.");
        return;
      }

      // Order was successfully saved in Neon
      clearCart();

      // Also remove the saved cart from localStorage
      localStorage.removeItem("cart");

      toast.success("Order placed successfully!");

      // Go to success page
      router.push("/orderSucess");
    } catch (error) {
      console.error("ORDER ERROR:", error);

      toast.error(
        "Something went wrong while placing your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // While checking login
  if (checkingAuth) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-lg text-gray-600">
          Checking login...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Customer Details */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Customer Details
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border p-3"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded border p-3"
            />

            <textarea
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded border p-3"
              rows={4}
            />

            {/* Payment Methods */}
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">
                Payment Method
              </h3>

              <div className="space-y-3">

                {/* Cash on Delivery */}
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={
                      paymentMethod === "Cash on Delivery"
                    }
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <span>💵 Cash on Delivery</span>
                </label>

                {/* EasyPaisa */}
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="EasyPaisa"
                    checked={paymentMethod === "EasyPaisa"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <span>📱 EasyPaisa</span>
                </label>

                {/* JazzCash */}
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="JazzCash"
                    checked={paymentMethod === "JazzCash"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <span>📱 JazzCash</span>
                </label>

                {/* Card */}
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Credit / Debit Card"
                    checked={
                      paymentMethod ===
                      "Credit / Debit Card"
                    }
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <span>💳 Credit / Debit Card</span>
                </label>

              </div>

              {/* Card Payment */}
              {paymentMethod === "Credit / Debit Card" && (
                <div className="mt-4 space-y-4">

                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(e.target.value)
                    }
                    className="w-full rounded border p-3"
                  />

                  <div className="grid grid-cols-2 gap-4">

                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) =>
                        setExpiryDate(e.target.value)
                      }
                      className="rounded border p-3"
                    />

                    <input
                      type="password"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value)
                      }
                      className="rounded border p-3"
                    />

                  </div>

                </div>
              )}

              {/* EasyPaisa / JazzCash */}
              {(paymentMethod === "EasyPaisa" ||
                paymentMethod === "JazzCash") && (
                <div className="mt-4">

                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) =>
                      setMobileNumber(e.target.value)
                    }
                    className="w-full rounded border p-3"
                  />

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-3">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-2"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}

            </div>
          )}

          <hr className="my-6" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>

            <span>
              Rs. {total}
            </span>
          </div>

          <button
            onClick={handleOrder}
            disabled={placingOrder || cart.length === 0}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}
          </button>
        </div>
      </div>
    </main>
  );
}