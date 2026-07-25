import Hero from "./components/home/hero";
import FeaturedCategories from "./components/home/featuredcategories";
import FeaturedProducts from "./components/home/featuredproducts";
export default function Home() {
  return (
    <main className="mx-auto max-w-7xl p-10">
      <Hero/>
      <FeaturedCategories/>
      <FeaturedProducts/>

    </main>
  );
}
