import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="py-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="w-full px-4 py-2 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </form>
    </div>
  );
};