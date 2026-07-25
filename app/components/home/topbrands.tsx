import BrandCard from "../ui/brandcards";
import { brands } from "../Data/brands";

export default function TopBrands() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Shop by Brands
          </h2>

          <p className="mt-3 text-gray-600">
            Discover premium mobile accessories from trusted global brands.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              name={brand.name}
              logo={brand.logo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}