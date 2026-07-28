"use client";

import { useCart } from "@/app/context/cartcontext";

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

  return (
    <button
      onClick={() =>
        addToCart({
          id,
          name,
          image,
          price,
        })
      }
      className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
    >
      Add to Cart
    </button>
  );
}