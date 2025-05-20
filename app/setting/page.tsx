"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  // Bell,
  Settings as SettingsIcon,
  LogOut,
  Upload,
  ChevronRight,
  Save,
  Home
} from 'lucide-react';

type Section = 'profile' | 'payment' | 'users' | 'notifications' | 'menu' | 'system';

const App: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<Section | null>('profile');
  const [restaurantName, setRestaurantName] = useState('The Grand Restaurant');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '09:00', close: '22:00' },
    tuesday: { open: '09:00', close: '22:00' },
    wednesday: { open: '09:00', close: '22:00' },
    thursday: { open: '09:00', close: '22:00' },
    friday: { open: '09:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '22:00' }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSectionToggle = (section: Section) => {
    setExpandedSection(prevSection => (prevSection === section ? null : section));
  };

  const handleSave = (section: Section) => {
    console.log(`Saving ${section} settings...`);
  };

  const SettingsSection: React.FC<{
    title: string;
    icon: React.ElementType;
    section: Section;
    children: React.ReactNode;
  }> = ({ title, icon: Icon, section, children }) => (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <button
        className="w-full px-6 py-4 flex items-center justify-between text-left"
        onClick={() => handleSectionToggle(section)}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronRight
          className={`h-5 w-5 text-gray-400 transform transition-transform ${
            expandedSection === section ? 'rotate-90' : ''
          }`}
        />
      </button>
      {expandedSection === section && (
        <div className="px-6 pb-6">
          {children}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleSave(section)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
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
        <span className="text-lg font-bold">Settings</span>
        <div />
      </div>

      {/* Sidebar */}
      <nav
        className={`
          fixed z-30 top-0 left-0 h-full w-64 bg-gray-900 text-white  shadow-lg p-4 flex-shrink-0
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <div className="flex items-center space-x-2 mb-8">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
        <a href="/dashboard">
          <button className="w-full flex items-center space-x-3 px-4 py-2  text-white rounded-lg hover:bg-gray-500">
            <span>Dashboard</span>
          </button>
        </a>
        <a href="/management">
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-white rounded-lg hover:bg-gray-500">
            <span>Management</span>
          </button>
        </a>
        <a href="/category">
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-white rounded-lg hover:bg-gray-500">
            <span>Category</span>
          </button>
        </a>
        <a href="/order">
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-white rounded-lg hover:bg-gray-500">
            <span>Order</span>
          </button>
        </a>
        <div className="space-y-2">
          <a href="/user">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-white rounded-lg hover:bg-gray-500">
              <span>Users</span>
            </button>
          </a>
        </div>
        <div className="absolute bottom-[-1]   bg-gray-900 left-0 right-0">
          <div className="flex items-center space-x-3 p-4  rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Admin"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
            <button>
              <LogOut className="h-5 w-5 text-gray-500" />
            </button>
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

      {/* Main Content */}
      <div className="flex-1 lg:ml-20 p-4 md:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <Home className="h-4 w-4" />
              <ChevronRight className="h-4 w-4" />
              <span>Settings</span>
            </div>
            <span className="text-gray-500">{format(new Date(), 'MMMM d, yyyy')}</span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <SettingsSection title="Restaurant Profile" icon={Home} section="profile">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Logo
                </label>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                    Upload New Logo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Operating Hours
                </label>
                {Object.entries(operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-3">
                    <span className="w-24 text-sm capitalize">{day}</span>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => setOperatingHours({
                        ...operatingHours,
                        [day]: { ...hours, open: e.target.value }
                      })}
                      className="border rounded-lg px-3 py-1 mt-1 sm:mt-0"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => setOperatingHours({
                        ...operatingHours,
                        [day]: { ...hours, close: e.target.value }
                      })}
                      className="border rounded-lg px-3 py-1 mt-1 sm:mt-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
};

export default App;