type SortDropdownProps = {
  sortBy: string;
  setSortBy: (value: string) => void;
};

export default function SortDropdown({
  sortBy,
  setSortBy,
}: SortDropdownProps) {
  return (
    <div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
      >
        <option value="default">Sort By</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rating</option>
        <option value="discount">Highest Discount</option>
      </select>
    </div>
  );
}