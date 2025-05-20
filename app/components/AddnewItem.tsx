"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  description: string;
}

const App: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    // ... existing menu items
  ]);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newItem, setNewItem] = useState<MenuItem>({
    id: menuItems.length + 1,
    name: '',
    category: 'Burgers',
    price: 0,
    stock: 'In Stock',
    image: '',
    description: '',
  });

  const categories = ['Burgers', 'Pizza', 'Salads', 'Desserts', 'Pasta'];

  const handleAddNewItem = () => {
    setMenuItems([...menuItems, newItem]);
    setIsAddCardOpen(false);
    setNewItem({
      id: menuItems.length + 1,
      name: '',
      category: 'Burgers',
      price: 0,
      stock: 'In Stock',
      image: '',
      description: '',
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Main Content Area */}
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
            <button
              onClick={() => setIsAddCardOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button flex items-center space-x-2 cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-plus"></i>
              <span>Add New Item</span>
            </button>
          </div>
          {/* Add New Item Card */}
          {isAddCardOpen && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="new-item-name" className="block text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    id="new-item-name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="new-item-price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    id="new-item-price"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="new-item-category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="new-item-category"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="new-item-status" className="block text-sm font-medium text-gray-700">Stock Status</label>
                  <select
                    id="new-item-status"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="new-item-description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="new-item-description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="flex-shrink-0 px-4 py-4 flex justify-end border-t border-gray-200">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-button shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3 cursor-pointer whitespace-nowrap"
                    onClick={() => setIsAddCardOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-blue-600 py-2 px-4 border border-transparent rounded-button shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer whitespace-nowrap"
                    onClick={handleAddNewItem}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;