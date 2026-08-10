import ProductCard from "../ui/productcard";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
};

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({
  products,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">
          No products found
        </h2>

        <p className="mt-2 text-gray-500">
          Try another search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          image={product.image}
          price={product.price}
          oldPrice={product.oldPrice ?? 0}
        />
      ))}
    </div>
  );
}