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
oldPrice: number | null;
  stock: number;
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  oldPrice,
  stock,
}: ProductCardProps) {
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const wished = wishlist.some((item) => item.id === id);

  const discount =
  oldPrice !== null && oldPrice > price
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

  const isOutOfStock = stock <= 0;

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

          {/* Wishlist */}
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

          {/* Discount */}
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              {discount}% OFF
            </span>
          )}

          {/* Out of Stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
              <span className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white">
                Out of Stock
              </span>
            </div>
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

            {oldPrice !== null && oldPrice > price && (
  <span className="text-sm text-gray-500 line-through">
    Rs. {oldPrice}
  </span>
)}
            
          </div>

          {/* Stock Information */}
          <div className="mt-3">
            {stock <= 0 ? (
              <p className="text-sm font-semibold text-red-600">
                Out of Stock
              </p>
            ) : stock <= 5 ? (
              <p className="text-sm font-semibold text-orange-600">
                Only {stock} left
              </p>
            ) : (
              <p className="text-sm font-medium text-green-600">
                In Stock
              </p>
            )}
          </div>

          <div className="mt-4">
            <button
              type="button"
              disabled={isOutOfStock}
              className={`w-full rounded-lg px-3 py-2 text-sm font-medium text-white transition ${
                isOutOfStock
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : "View Product"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}