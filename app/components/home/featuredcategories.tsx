import CategoryCard from "../ui/categoriescard";
import { categories } from "../Data/card"; 

export default function FeaturedCategories() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Shop by Category
          </h2>

          <p className="mt-3 text-gray-600">
            Browse our popular mobile accessories.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              image={category.image}
              products={category.products}
            />
          ))}
        </div>

      </div>
    </section>
  );
}