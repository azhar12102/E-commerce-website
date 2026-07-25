import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-16 text-center text-white shadow-xl">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            🔥 Limited Time Offer
          </span>

          <h2 className="mt-6 text-4xl font-bold">
            Up to 50% OFF
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Discover premium mobile accessories with exclusive discounts.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-700 transition hover:bg-gray-100"
          >
            Shop Now
          </Link>

        </div>
      </div>
    </section>
  );
}