import FeatureCard from "../ui/Featuredcard"; 
import { features } from "../Data/features";

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Why Choose Us
          </h2>

          <p className="mt-3 text-gray-600">
            We provide premium products with excellent customer service.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}