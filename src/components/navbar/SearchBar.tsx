import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, onSubmit }) => {
  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="hidden md:flex flex-1 max-w-lg mx-8">
      <form onSubmit={onSubmit} className="w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-20 py-3 bg-gray-50 border border-gray-50 rounded focus:outline-none focus:bg-white focus:border-gray-300 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-600 hover:bg-pink-700 text-white p-1.5 rounded transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;