export default function Newsletter() {
  return (
    <section className="bg-blue-600 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center text-white">
        <h2 className="text-4xl font-bold">
          Stay Updated
        </h2>

        <p className="mt-4 text-blue-100">
          Subscribe to receive exclusive offers, discounts, and the latest
          mobile accessories directly in your inbox.
        </p>

        <form className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-lg px-5 py-4 text-gray-900 outline-none focus:ring-4 focus:ring-blue-300"
          />

          <button
            type="submit"
            className="rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 transition hover:bg-gray-100"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}