"use client";

import { useCart } from "../context/cartcontext";
import { useOrders } from "../context/ordercontext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const { addOrder } = useOrders();
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

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleOrder = () => {
  if (!name || !phone || !address || !city) {
    alert("Please fill in all fields.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  if (
    paymentMethod === "Credit / Debit Card" &&
    (!cardNumber || !expiryDate || !cvv)
  ) {
    alert("Please enter your card details.");
    return;
  }

  if (
    (paymentMethod === "EasyPaisa" ||
      paymentMethod === "JazzCash") &&
    !mobileNumber
  ) {
    alert("Please enter your mobile number.");
    return;
  }

  addOrder({
    id: Date.now().toString(),
    date: new Date().toLocaleDateString(),
    total,
    paymentMethod,
    items: cart,
  });

  clearCart();

  router.push("/orderSucess");
};
        

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

                       <div className="rounded-lg border p-4">
  <h3 className="mb-3 font-semibold">
    Select Payment Method
  </h3>

  <div className="space-y-3">
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        name="payment"
        value="Cash on Delivery"
        checked={paymentMethod === "Cash on Delivery"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      💵 Cash on Delivery
    </label>

    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        name="payment"
        value="EasyPaisa"
        checked={paymentMethod === "EasyPaisa"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      📱 EasyPaisa
    </label>

    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        name="payment"
        value="JazzCash"
        checked={paymentMethod === "JazzCash"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      📱 JazzCash
    </label>

    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        name="payment"
        value="Credit / Debit Card"
        checked={paymentMethod === "Credit / Debit Card"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      💳 Credit / Debit Card
    </label>
  </div>

  {/* Card Payment */}
  {paymentMethod === "Credit / Debit Card" && (
    <div className="mt-4 space-y-4">
      <input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        className="w-full rounded border p-3"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="MM/YY"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="rounded border p-3"
        />

        <input
          type="password"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
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
        onChange={(e) => setMobileNumber(e.target.value)}
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

                    <hr className="my-6" />

                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>Rs. {total}</span>
                    </div>

                    <button
                        onClick={handleOrder}
                        className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </main>
    );
}