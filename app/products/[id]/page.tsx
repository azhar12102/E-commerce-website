import AddToCartButton from "./Addtocart";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductGrid from "@/app/components/products/productGrid";
import ProductReviews from "@/app/components/products/productsreview";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      category: true,
      reviews: true,
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: {
        id: product.id,
      },
    },
    include: {
      category: true,
    },
    take: 4,
  });

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : 0;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
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

        <div>
          <h1 className="text-4xl font-bold">{product.name}</h1>

          <p className="mt-4 text-2xl font-semibold text-blue-600">
            Rs. {product.price}
          </p>

          {product.oldPrice && (
            <p className="mt-2 text-lg text-gray-500 line-through">
              Rs. {product.oldPrice}
            </p>
          )}

          {discount > 0 && (
            <span className="mt-4 inline-block rounded bg-red-100 px-3 py-1 text-red-600">
              {discount}% OFF
            </span>
          )}

          <p className="mt-8 text-gray-600">
            {product.description}
          </p>

          <AddToCartButton
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
          />
        </div>
      </div>

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