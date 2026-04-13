
import React from 'react';
import { Screen } from '../types';

interface NavbarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'discover', label: 'Destinations' },
    { id: 'community', label: 'Community' },
    { id: 'tribe', label: 'Trips' },
    { id: 'wiki', label: 'Stories' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
      <div 
        className="serif text-2xl font-bold cursor-pointer" 
        onClick={() => onNavigate('feed')}
      >
        Offbeat Atlas
      </div>
      
      <div className="flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Screen)}
            className={`text-sm font-medium transition-colors ${
              currentScreen === item.id ? 'text-green-800' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {item.label}
          </button>
        ))}
        {currentScreen === 'profile' ? (
           <img 
            src="https://picsum.photos/id/64/40/40" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-gray-200"
          />
        ) : (
          <button 
            onClick={() => onNavigate('login')}
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
