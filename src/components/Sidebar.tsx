import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings, User, LogOut } from 'lucide-react';

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <Home size={20} /> },
  { label: 'Profile', to: '/profile', icon: <User size={20} /> },
  { label: 'Settings', to: '/settings', icon: <Settings size={20} /> },
  { label: 'Logout', to: '/logout', icon: <LogOut size={20} /> },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col" aria-label="Sidebar navigation">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-semibold">KORVIL</h1>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mx-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`
            }
          >
            <span className="mr-3" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};