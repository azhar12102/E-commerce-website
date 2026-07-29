"use client";

import { useCart } from "../context/cartcontext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");

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

                        <div className="rounded bg-gray-100 p-3">
                            <strong>Payment Method:</strong> Cash on Delivery
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