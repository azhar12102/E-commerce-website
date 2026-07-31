import AddToCartButton from "./Addtocart";
import { products } from "@/app/components/Data/product";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductGrid from "@/app/components/products/productGrid";
import ProductReviews from "@/app/components/products/productsreview";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    notFound();
  }
  const relatedProducts = products
  .filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  )
  .slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="relative h-[500px] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold">{product.name}</h1>

          <p className="mt-4 text-2xl font-semibold text-blue-600">
            Rs {product.price}
          </p>

          <p className="mt-2 text-lg text-gray-500 line-through">
            Rs {product.oldPrice}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <span className="rounded bg-yellow-100 px-3 py-1 text-yellow-700">
              ⭐ {product.rating}
            </span>

            <span className="rounded bg-red-100 px-3 py-1 text-red-600">
              {product.discount}% OFF
            </span>
          </div>

          <p className="mt-8 text-gray-600">
            Premium quality mobile accessory with excellent durability and
            performance.
          </p>

          <AddToCartButton
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
          />
        </div>
      </div>
          {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-3xl font-bold">
            Related Products
          </h2>

          <ProductGrid products={relatedProducts} />
          <ProductReviews productId={product.id} />
        </section>
      )}
    </main>
  );
}