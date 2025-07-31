"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Home, Settings, ShoppingCart, Users, Utensils, Tags } from 'lucide-react';
import Logout from '../components/Logout';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useGetUsersQuery } from '../../store/query/AuthApi';

interface SidebarProps {
  activePath?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { token, user: authUser } = useSelector((state: RootState) => state.auth);
  
  // Fetch users data
  const { data: usersResponse } = useGetUsersQuery(undefined, {
    skip: !token,
  });

  // Define a User type for better type safety
  interface User {
    id: string | number;
    name?: string;
    email?: string;
    avatar?: string;
    // add other properties as needed
  }

  // Safely get the users array
  const users: User[] = Array.isArray((usersResponse)?.users)
    ? (usersResponse).users
    : [];
  
  // Find current user or fall back to authUser
  const currentUser = Array.isArray(users) 
    ? users.find((u: User) => u.id === authUser?.id) || authUser
    : authUser;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/management', icon: Utensils, label: 'Management' },
    { path: '/category', icon: Tags, label: 'Categories' },
    { path: '/order', icon: ShoppingCart, label: 'Orders' },
    { path: '/user', icon: Users, label: 'Users' },
    { path: '/setting', icon: Settings, label: 'Settings' },
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

        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex items-center space-x-3 p-4 bg-gray-800 text-white rounded-lg">
            <Image
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
              alt="User"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
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