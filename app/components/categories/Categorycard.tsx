"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  image: string;
  productCount: number;
};

export default function CategoryCard({
  name,
  image,
  productCount,
}: Props) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(name)}`}
      className="group overflow-hidden rounded-xl border bg-white shadow transition-all hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="relative h-56 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-5 text-center">
        <h2 className="text-xl font-bold">
          {name}
        </h2>

        <p className="mt-2 text-gray-500">
          {productCount} Products
        </p>

        <button className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
          Browse Category
        </button>
      </div>
    </Link>
  );
}