import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu } from 'lucide-react';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <header className={`flex items-center justify-between px-4 py-2 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center space-x-2">
        <Link href="/" aria-label="Home">
          <a className="text-xl font-bold">KORVIL</a>
        </Link>
      </div>

      <nav aria-label="Main navigation" className="hidden md:flex space-x-4">
        <Link href="/about"><a className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">About</a></Link>
        <Link href="/features"><a className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Features</a></Link>
        <Link href="/contact"><a className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Contact</a></Link>
      </nav>

      <div className="flex items-center space-x-2">
        <button
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Desativar modo escuro' : 'Ativar modo escuro'}
          className="p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          aria-label="Abrir menu de navegação"
          className="p-2 rounded md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
