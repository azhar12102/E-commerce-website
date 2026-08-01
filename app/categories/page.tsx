"use client";

import CategoryCard from "../components/categories/Categorycard";
import { categories } from "../components/Data/categories";
import { products } from "../components/Data/product";

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-3 text-4xl font-bold">
        Shop by Category
      </h1>

      <p className="mb-10 text-gray-500">
        Browse our collection by category.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const productCount = products.filter(
            (product) => product.category === category.name
          ).length;

          return (
            <CategoryCard
              key={category.id}
              name={category.name}
              image={category.image}
              productCount={productCount}
            />
          );
        })}
      </div>
    </main>
  );
}