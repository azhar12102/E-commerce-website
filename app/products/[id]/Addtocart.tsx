"use client";

import toast from "react-hot-toast";
import { useCart } from "@/app/context/cartcontext";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  name: string;
  image: string;
  price: number;
};

export default function AddToCartButton({
  id,
  name,
  image,
  price,
}: Props) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      // Check whether the user is logged in
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      // User is not logged in
      if (!response.ok) {
        toast.error("Please login to buy this product.");
        router.push("/login");
        return;
      }

      // User is logged in
      addToCart({
        id,
        name,
        image,
        price,
      });

      toast.success(`${name} added to cart!`);
    } catch (error) {
      console.error("Authentication check failed:", error);
      toast.error("Please login to continue.");
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
    >
      Add to Cart
    </button>
  );
}