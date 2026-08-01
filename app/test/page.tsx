import { prisma } from "@/lib/prisma";

export default async function TestPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Database Test
      </h1>

      {products.map((product) => (
        <div key={product.id} className="mb-6 border p-4 rounded">
          <h2 className="font-bold">{product.name}</h2>
          <p>Price: Rs. {product.price}</p>
          <p>Category: {product.category.name}</p>
        </div>
      ))}
    </main>
  );
}