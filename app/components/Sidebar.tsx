"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Home, ShoppingCart, Users, Utensils, Tags, Wrench } from 'lucide-react';
import Logout from '../components/Logout';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface SidebarProps {
  activePath?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  console.log("user", currentUser)
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/management', icon: Utensils, label: 'Management' },
    { path: '/category', icon: Tags, label: 'Categories' },
    {path: '/subcategory', icon: Wrench, label: "Subcategories"},
    { path: '/order', icon: ShoppingCart, label: 'Orders' },
    { path: '/user', icon: Users, label: 'Users' },
    // { path: '/setting', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow">
        <button
          className="text-gray-700 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        <span className="text-lg font-bold">Menu</span>
        <div />
      </div>

      {/* Sidebar */}
      <nav
        className={`
          fixed z-30 top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg p-4 flex-shrink-0
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-semibold">Admin Menu</h2>
        </div>

        <div className="mt-4 space-y-1">
          {navItems.map((item) => (
            <Link href={item.path} key={item.path}>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activePath === item.path
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-[-4] left-0 right-0  ">
         <div className="flex items-center space-x-3 p-4 bg-gray-800 text-white rounded-lg">
  {currentUser?.avatar ? (
    <Image
      src={
        currentUser.avatar.startsWith('http') 
          ? currentUser.avatar 
          : `https://res.cloudinary.com/your-cloud-name/image/upload/w_40,h_40,c_fill/${currentUser.avatar}`
      }
      alt="User"
      width={40}
      height={40}
      className="h-10 w-10 rounded-full object-cover"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Admin')}&background=random`;
      }}
    />
  ) : (
    <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
      <span className="text-sm font-medium">
        {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'AU'}
      </span>
    </div>
  )}
  <div className="flex-1">
    <p className="text-sm font-medium">{currentUser?.name || 'Admin User'}</p>
    <p className="text-xs text-gray-400">{currentUser?.email || 'admin@example.com'}</p>
  </div>
  <Logout />
</div>
        </div>
      </nav>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;