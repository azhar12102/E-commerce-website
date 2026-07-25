import Hero from "./components/home/hero";
import FeaturedCategories from "./components/home/featuredcategories";
import FeaturedProducts from "./components/home/featuredproducts";
import PromoBanner from "./components/home/promobanner";
import WhyChooseUs from "./components/home/WhyChooseUs";
import TopBrands from "./components/home/topbrands";
import Newsletter from "./components/home/newsletter";
export default function Home() {
  return (
    <main className="mx-auto max-w-7xl p-10">
      <Hero/>
      <FeaturedCategories/>
      <FeaturedProducts/>
      <PromoBanner/>
      <WhyChooseUs/>
      <TopBrands/>
      <Newsletter/>
    </main>
  );
}
