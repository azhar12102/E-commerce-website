import Hero from "./components/home/hero";
import FeaturedCategories from "./components/home/featuredcategories";
export default function Home() {
  return (
    <main className="mx-auto max-w-7xl p-10">
      <Hero/>
      <FeaturedCategories/>
    </main>
  );
}
