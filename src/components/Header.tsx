import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu } from "lucide-react";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const classList = document.documentElement.classList;
    if (darkMode) {
      classList.add("dark");
    } else {
      classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            KORVIL
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="md:hidden p-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
