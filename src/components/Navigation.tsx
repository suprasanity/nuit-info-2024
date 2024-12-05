import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Droplets, Search, User } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { SearchBar } from './SearchBar';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">Race for Water</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 hover:bg-blue-800 rounded-md">
                Accueil
              </Link>
              <Link to="/modele-interactif" className="px-3 py-2 hover:bg-blue-800 rounded-md">
                Modèle Interactif
              </Link>
              <Link to="/media" className="px-3 py-2 hover:bg-blue-800 rounded-md">
                Média
              </Link>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-blue-800 rounded-md"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="p-2 hover:bg-blue-800 rounded-md"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 hover:bg-blue-800 rounded-md">
              Accueil
            </Link>
            <Link to="/modele-interactif" className="block px-3 py-2 hover:bg-blue-800 rounded-md">
              Modèle Interactif
            </Link>
            <Link to="/media" className="block px-3 py-2 hover:bg-blue-800 rounded-md">
              Média
            </Link>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-full text-left px-3 py-2 hover:bg-blue-800 rounded-md"
            >
              Rechercher
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full text-left px-3 py-2 hover:bg-blue-800 rounded-md"
            >
              Se connecter
            </button>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
};