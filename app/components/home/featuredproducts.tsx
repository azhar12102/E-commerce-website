import ProductCard from "../ui/productcard";
import { products } from "../Data/product";

export default function FeaturedProducts() {
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              oldPrice={product.oldPrice}
              rating={product.rating}
              discount={product.discount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}