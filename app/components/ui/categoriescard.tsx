import Image from "next/image";

type CategoryCardProps = {
  name: string;
  image: string;
  products: number;
};

export default function CategoryCard({
  name,
  image,
  products,
}: CategoryCardProps) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{name}</h3>

        <p className="mt-2 text-sm text-gray-500">
          {products} Products
        </p>
      </div>
    </div>
  );
}