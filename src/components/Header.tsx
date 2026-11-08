import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold">
            KORVIL
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/about" className="hover:text-gray-300 transition-colors">
              Sobre
            </Link>
            <Link to="/features" className="hover:text-gray-300 transition-colors">
              Funcionalidades
            </Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">
              Contato
            </Link>
          </nav>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="md:hidden p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/features"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
