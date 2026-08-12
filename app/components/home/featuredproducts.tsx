import ProductCard from "../ui/productcard";
import { prisma } from "@/lib/prisma";

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      id: "asc",
    },
    take: 6,
  });

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Featured Products
          </h2>

          <p className="mt-3 text-gray-600">
            Discover our most popular mobile accessories.
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="py-10 text-center">
            <h2 className="text-xl font-semibold">
              No featured products found
            </h2>

            <p className="mt-2 text-gray-500">
              Products will appear here when they are added.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                oldPrice={product.oldPrice}
                stock={product.stock}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}