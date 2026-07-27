type ProductFiltersProps = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

const categories = [
  "All",
  "Phone Cases",
  "Chargers",
  "Earbuds",
  "Power Banks",
  "Smart Watches",
];

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            selectedCategory === category
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-blue-50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}