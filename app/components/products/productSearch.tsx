type ProductSearchProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function ProductSearch({
  searchTerm,
  setSearchTerm,
}: ProductSearchProps) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600"
      />
    </div>
  );
}