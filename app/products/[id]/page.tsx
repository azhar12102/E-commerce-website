import { products } from "@/app/components/Data/product";
import { notFound } from "next/navigation";
import Image from "next/image";


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
            ${product.price}
          </p>

          <p className="mt-2 text-lg text-gray-500 line-through">
            ${product.oldPrice}
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

          <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}