// components/Header.tsx
import React from 'react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentDate: string;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, currentDate }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-6 py-3 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <div className="text-gray-600">{currentDate}</div>
          <div className="relative cursor-pointer">
            {/* Notification bell could go here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


