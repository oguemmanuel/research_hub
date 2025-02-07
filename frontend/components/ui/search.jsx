import { useState } from 'react';

const Search = () => {
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) {
      alert("Please enter a search query!");
      return;
    }

    setIsSubmitting(true);
    // Simulate a search request with a timeout
    setTimeout(() => {
      alert(`Searching for: ${query}`);
      setIsSubmitting(false);
    }, 1000);  // Replace this with actual search logic
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Search papers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full max-w-md"
      />
      <button
        onClick={handleSearch}
        disabled={isSubmitting}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default Search;
