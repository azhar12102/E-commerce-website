import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  discount: number;
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  oldPrice,
  rating,
  discount,
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
        {/* Product Image */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Discount Badge */}
          <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            {discount}% OFF
          </span>
        </div>

        {/* Product Details */}
        <div className="p-5">
          <h3 className="line-clamp-2 text-lg font-semibold">{name}</h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">
              ${price}
            </span>

            <span className="text-sm text-gray-500 line-through">
              ${oldPrice}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="rounded bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-700">
              ⭐ {rating}
            </span>

            <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}