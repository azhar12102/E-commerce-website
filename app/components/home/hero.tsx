import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 py-20 md:flex-row">
        
        {/* Left Content */}
        <div className="max-w-xl">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-600">
            New Collection 2026
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Premium Mobile Accessories for Every Device
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Shop high-quality phone cases, chargers, earbuds, power banks,
            screen protectors, and much more at affordable prices.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              Shop Now
            </Link>

            <Link
              href="/categories"
              className="rounded-lg border border-blue-600 px-6 py-3 text-blue-600 transition hover:bg-blue-50"
            >
              Explore Categories
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700"
            alt="Mobile Accessories"
            className="w-full max-w-md rounded-xl shadow-lg"
          />
        </div>

      </div>
    </section>
  );
}