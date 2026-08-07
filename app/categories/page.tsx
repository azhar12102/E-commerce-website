"use client";

import { useEffect, useState } from "react";
import CategoryCard from "../components/categories/Categorycard";

type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  products: {
    id: number;
  }[];
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-3 text-4xl font-bold">
          Shop by Category
        </h1>

        <p className="text-gray-500">
          Loading categories...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-3 text-4xl font-bold">
        Shop by Category
      </h1>

      <p className="mb-10 text-gray-500">
        Browse our collection by category.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            image={category.image}
            productCount={category.products.length}
          />
        ))}
      </div>
    </main>
  );
}