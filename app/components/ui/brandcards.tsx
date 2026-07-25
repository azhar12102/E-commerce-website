import Image from "next/image";

type BrandCardProps = {
  name: string;
  logo: string;
};

export default function BrandCard({
  name,
  logo,
}: BrandCardProps) {
  return (
    <div className="group flex h-40 items-center justify-center rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      <Image
        src={logo}
        alt={name}
        width={140}
        height={70}
         className="object-contain transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
}