import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";

type ProductCardProps = {
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  discount: number;
};

export default function ProductCard({
  name,
  image,
  price,
  oldPrice,
  rating,
  discount,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      
      {/* Product Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Discount Badge */}
        <span className="absolute left-3 top-3 rounded-md bg-red-500 px-3 py-1 text-sm font-semibold text-white">
          -{discount}%
        </span>
      </div>

      {/* Product Info */}
      <div className="space-y-3 p-5">
        <h3 className="text-lg font-semibold">{name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="text-sm text-gray-600">
            {rating}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-blue-600">
            ${price}
          </span>

          <span className="text-sm text-gray-400 line-through">
            ${oldPrice}
          </span>
        </div>

        {/* Button */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700">
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}