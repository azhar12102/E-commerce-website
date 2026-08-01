"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/app/context/wishlistcontext";

type ProductCardProps = {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  oldPrice,
}: ProductCardProps) {
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const wished = wishlist.some((item) => item.id === id);

  const discount =
    oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const handleWishlist = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (wished) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        image,
        price,
      });
    }
  };

  return (
    <Link href={`/products/${id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          <button
            type="button"
            onClick={handleWishlist}
            className="absolute right-3 top-3 z-20 rounded-full bg-white p-2 shadow-md"
          >
            <Heart
              size={20}
              className={
                wished
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500"
              }
            />
          </button>

          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="line-clamp-2 text-lg font-semibold">
            {name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">
              Rs. {price}
            </span>

            {oldPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                Rs. {oldPrice}
              </span>
            )}
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              View Product
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}