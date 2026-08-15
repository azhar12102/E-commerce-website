"use client";

import toast from "react-hot-toast";
import { useCart } from "@/app/context/cartcontext";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
};

export default function AddToCartButton({
  id,
  name,
  image,
  price,
  stock,
}: Props) {
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      // Check stock first
      if (stock <= 0) {
        toast.error("This product is out of stock.");
        return;
      }

      // Check whether the user is logged in
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      // User is not logged in
      if (!response.ok) {
        const toastId = toast.error(
          "Please login to buy this product."
        );

        setTimeout(() => {
          toast.dismiss(toastId);
          router.push("/login");
        }, 1200);

        return;
      }

      // Check existing quantity in cart
      const existingItem = cart.find(
        (item) => item.id === id
      );

      const currentQuantity = existingItem
        ? existingItem.quantity
        : 0;

      // Don't allow more than available stock
      if (currentQuantity >= stock) {
        toast.error(
          `Only ${stock} item${
            stock === 1 ? "" : "s"
          } available.`
        );
        return;
      }

      // Add product to cart
      addToCart({
        id,
        name,
        image,
        price,
        stock,
      });

      toast.success(`${name} added to cart!`);
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error
      );

      const toastId = toast.error(
        "Please login to continue."
      );

      setTimeout(() => {
        toast.dismiss(toastId);
        router.push("/login");
      }, 1200);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={stock <= 0}
      className={`mt-8 rounded-lg px-6 py-3 text-white transition ${
        stock <= 0
          ? "cursor-not-allowed bg-gray-400"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {stock <= 0 ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}