"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductSearch from "../components/products/productSearch";
import ProductFilters from "../components/products/productFilters";
import SortDropdown from "../components/products/sortDropdown";
import ProductGrid from "../components/products/productGrid";
import { products } from "../components/Data/product";

export default function ProductsPage() {
  const searchParams = useSearchParams();
const [searchTerm, setSearchTerm] = useState(
  searchParams.get("search") || ""
);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
useEffect(() => {
  const search = searchParams.get("search") || "";
  setSearchTerm(search);
}, [searchParams]);
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "rating":
          return b.rating - a.rating;

        case "discount":
          return b.discount - a.discount;

        default:
          return 0;
      }
    });
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        All Products
      </h1>

      <div className="mb-8">
        <ProductSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ProductFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <SortDropdown
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      <ProductGrid products={filteredProducts} />
      
    </main>
  );
}