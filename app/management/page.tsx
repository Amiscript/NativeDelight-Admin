"use client";

import React, { useState } from "react";
import Image from "next/image";
// import { format } from 'date-fns';
import {
  // Bell,
  // Settings as SettingsIcon,
  LogOut,
  // Upload,
  // ChevronRight,
  // Save,
  // Home
} from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  subCategory?: string; // <-- Add this line
  price: number;
  stock: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
  description: string;
}

// 1. Change subCategories to be an object of arrays of objects
interface SubCategory {
  id: number;
  name: string;
}

const subCategories: { [key: string]: SubCategory[] } = {
  Burgers: [
    { id: 1, name: "Beef Burgers" },
    { id: 2, name: "Chicken Burgers" },
    { id: 3, name: "Veggie Burgers" },
  ],
  Pizza: [
    { id: 4, name: "Margherita" },
    { id: 5, name: "Pepperoni" },
    { id: 6, name: "BBQ Chicken" },
  ],
  Salads: [
    { id: 7, name: "Caesar" },
    { id: 8, name: "Greek" },
    { id: 9, name: "Garden" },
  ],
  Desserts: [
    { id: 10, name: "Brownies" },
    { id: 11, name: "Ice Cream" },
    { id: 12, name: "Cakes" },
  ],
  Pasta: [
    { id: 13, name: "Alfredo" },
    { id: 14, name: "Bolognese" },
    { id: 15, name: "Carbonara" },
  ],
};

const categories = ["All", "Burgers", "Pizza", "Salads", "Desserts", "Pasta"];

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    category: "Burgers",
    price: 12.99,
    stock: "In Stock",
    image:
      "https://public.readdy.ai/ai/img_res/f2d1c74d64489b64476350553be4a38e.jpg",
    description:
      "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce.",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 14.99,
    stock: "In Stock",
    image:
      "https://public.readdy.ai/ai/img_res/910319bc9cc0e339d24b4fa22800fe5b.jpg",
    description: "Traditional pizza with tomato sauce, fresh mozzarella, and basil.",
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Salads",
    price: 9.99,
    stock: "Low Stock",
    image:
      "https://public.readdy.ai/ai/img_res/aa33ecaa22a914d1408b3a50da001629.jpg",
    description:
      "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan.",
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 6.99,
    stock: "Out of Stock",
    image:
      "https://public.readdy.ai/ai/img_res/47fd27ebb3e4ed6f3e7ea25556c361ed.jpg",
    description: "Rich chocolate brownie with walnuts and a fudgy center.",
  },
  {
    id: 5,
    name: "Chicken Alfredo",
    category: "Pasta",
    price: 15.99,
    stock: "In Stock",
    image:
      "https://public.readdy.ai/ai/img_res/d41e462e3c6035e22ec983120ae5aab9.jpg",
    description: "Fettuccine pasta with creamy alfredo sauce and grilled chicken.",
  },
];

const App: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<MenuItem>({
    id: Date.now(),
    name: "",
    category: "",
    subCategory: "", // <-- Add this line
    price: 0,
    stock: "In Stock",
    image: "",
    description: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState<MenuItem | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  // 2. Add state to manage subcategory order for the selected category
  const [subCategoryOrder, setSubCategoryOrder] = useState<{ [key: string]: SubCategory[] }>(subCategories);

  // Move subcategory up or down in the order
  const moveSubcategory = (category: string, subId: number, direction: 'up' | 'down') => {
    setSubCategoryOrder(prev => {
      const arr = prev[category] ? [...prev[category]] : [];
      const idx = arr.findIndex(sub => sub.id === subId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx > 0) {
        [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      } else if (direction === 'down' && idx < arr.length - 1) {
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      }
      return { ...prev, [category]: arr };
    });
  };

  const handleAddNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMenuItems([...menuItems, { ...newItem, id: Date.now() }]);
    setIsAddModalOpen(false);
    setNewItem({
      id: Date.now(),
      name: "",
      category: "",
      subCategory: "", // <-- Add this line
      price: 0,
      stock: "In Stock",
      image: "",
      description: "",
    });
  };

  // Open edit modal with item
  // const handleEditModalOpen = (item: MenuItem) => {
  //   setEditItem({ ...item });
  //   setIsEditModalOpen(true);
  // };

  // Save edit modal changes
  const handleEditModalSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editItem) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? editItem : item
        )
      );
      setIsEditModalOpen(false);
      setEditItem(null);
    }
  };

  const handleEditModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editItem) return;
    const { name, value } = e.target;
    setEditItem({
      ...editItem,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleEdit = (item: MenuItem) => {
    setCurrentEditItem({ ...item });
    setIsQuickEditOpen(true);
  };

  const handleSave = () => {
    if (currentEditItem) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === currentEditItem.id ? currentEditItem : item
        )
      );
      setIsQuickEditOpen(false);
      setCurrentEditItem(null);
    }
  };

  const handleDelete = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleVisibility = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              stock:
                item.stock === "In Stock"
                  ? "Out of Stock"
                  : "In Stock",
            }
          : item
      )
    );
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalItems = menuItems.length;
  const activeItems = menuItems.filter((item) => item.stock === "In Stock").length;
  const outOfStockItems = menuItems.filter((item) => item.stock === "Out of Stock").length;
  const lowStockItems = menuItems.filter((item) => item.stock === "Low Stock").length;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

   const [sidebarOpen, setSidebarOpen] = React.useState(false);
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
        <span className="text-lg font-bold">Menu Management</span>
        <div />
      </div>

      {/* Sidebar */}
      <nav
        className={`
          fixed z-30 top-0 left-0 h-full w-64  bg-gray-800 text-white shadow-lg p-4 flex-shrink-0
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <div className="flex items-center space-x-2 mb-8">
          <h1 className="text-xl font-bold">Menu Management</h1>
        </div>
        <div className="space-y-2">
          <a href="/dashboard">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Dashboard</span>
            </button>
          </a>
          <a href="/category">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Category</span>
            </button>
          </a>
          <a href="/order">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Order</span>
            </button>
          </a>
          <a href="/user">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Users</span>
            </button>
          </a>
          <a href="/setting">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Settings</span>
            </button>
          </a>
        </div>
        <div className="absolute left-4 right-4 text-white bottom-4 lg:static lg:mt-auto">
          <div className="flex items-center space-x-3 p-4 rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Admin"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-white">admin@example.com</p>
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
      <div className="flex-1 lg:ml-0  mt-16 lg:mt-0">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-gray-600">{currentDate}</div>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button flex items-center space-x-2 cursor-pointer whitespace-nowrap"
              onClick={() => setIsAddModalOpen(true)}
            >
              <i className="fas fa-plus"></i>
              <span>Add New Item</span>
            </button>
          </div>
          {/* Add New Item Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] flex flex-col">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
                <h2 className="text-lg font-semibold mb-4">Add New Menu Item</h2>
                <form
                  onSubmit={handleAddNewItem}
                  className="space-y-4 overflow-y-auto"
                  style={{ maxHeight: "70vh" }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newItem.name}
                      onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newItem.price}
                      onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newItem.category}
                      onChange={e => {
                        setNewItem({ ...newItem, category: e.target.value, subCategory: "" });
                      }}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.filter(cat => cat !== "All").map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  {/* 4. In Add/Edit Menu Item Modal, show subcategories in the current order with move buttons */}
                  {newItem.category && subCategoryOrder[newItem.category] && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                      <div className="flex flex-col gap-1">
                        {subCategoryOrder[newItem.category].map((sub, idx, arr) => (
                          <div key={sub.id} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="subCategory"
                              checked={newItem.subCategory === sub.name}
                              onChange={() => setNewItem({ ...newItem, subCategory: sub.name })}
                            />
                            <span>{sub.name}</span>
                            <button
                              type="button"
                              className="text-xs px-1"
                              disabled={idx === 0}
                              onClick={() => moveSubcategory(newItem.category, sub.id, 'up')}
                              title="Move Up"
                            >▲</button>
                            <button
                              type="button"
                              className="text-xs px-1"
                              disabled={idx === arr.length - 1}
                              onClick={() => moveSubcategory(newItem.category, sub.id, 'down')}
                              title="Move Down"
                            >▼</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Status</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newItem.stock}
                      onChange={e => setNewItem({ ...newItem, stock: e.target.value as MenuItem["stock"] })}
                      required
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newItem.description}
                      onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setNewItem({ ...newItem, image: ev.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <span className="text-xs text-gray-400 text-center">or paste an image URL below</span>
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newItem.image}
                        onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                      />
                      {newItem.image && (
                        <Image
                          src={newItem.image}
                          alt="Preview"
                          className="mt-2 h-24 w-24 object-cover rounded-md border"
                          width={96}
                          height={96}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-button"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button"
                    >
                      Add Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <i className="fas fa-utensils text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Menu Items</p>
                <h3 className="text-2xl font-bold">{totalItems}</h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Items</p>
                <h3 className="text-2xl font-bold">{activeItems}</h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <i className="fas fa-times-circle text-red-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Out of Stock</p>
                <h3 className="text-2xl font-bold">{outOfStockItems}</h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Low Stock</p>
                <h3 className="text-2xl font-bold">{lowStockItems}</h3>
              </div>
            </div>
          </div>
          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category-filter"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Menu Items Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.name} width={40} height={40} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.category}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.subCategory || "—"}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₦{item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.stock === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : item.stock === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Edit Icon */}
                        <button
                          onClick={() =>{ handleEdit(item)
                          
                            setIsEditModalOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          title="Edit"
                        >
                          <span className="hidden sm:inline">Edit</span>
                          <i className="fas fa-edit ml-1"></i>
                        </button>
                        {/* Delete Icon */}
                        <button
                          onClick={() => {
                            setDeleteModalItem(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          title="Delete"
                        >
                          <span className="text-red-600">Delete</span>
                          <i className="fas fa-trash-alt"> </i>
                        </button>
                        {/* Visibility Icon */}
                        <button
                          onClick={() => toggleVisibility(item.id)}
                          className={`${item.stock === "In Stock" ? "text-green-600 hover:text-green-900" : "text-gray-400 hover:text-gray-600"} cursor-pointer`}
                          title="Toggle Stock"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && deleteModalItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <h2 className="text-lg font-semibold mb-4 text-center">Delete Menu Item</h2>
                  <p className="mb-6 text-center text-gray-700">
                    Are you sure you want to delete <span className="font-bold">{deleteModalItem.name}</span>?
                    This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-button"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-button"
                      onClick={() => {
                        handleDelete(deleteModalItem.id);
                        setIsDeleteModalOpen(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {/* Quick Edit Panel */}
      {isQuickEditOpen && currentEditItem && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsQuickEditOpen(false)}></div>
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Edit Menu Item</h2>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setIsQuickEditOpen(false)}
                  >
                    <span className="sr-only">Close panel</span>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="flex-1 px-4 sm:px-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentEditItem.name}
                      onChange={e => setCurrentEditItem({ ...currentEditItem, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentEditItem.price}
                      onChange={e => setCurrentEditItem({ ...currentEditItem, price: parseFloat(e.target.value) })}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentEditItem.category}
                      onChange={e => setCurrentEditItem({ ...currentEditItem, category: e.target.value, subCategory: "" })}
                    >
                      {categories.filter(cat => cat !== "All").map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  {/* 4. In Add/Edit Menu Item Modal, show subcategories in the current order with move buttons */}
                  {currentEditItem.category && subCategoryOrder[currentEditItem.category] && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                      <div className="flex flex-col gap-1">
                        {subCategoryOrder[currentEditItem.category].map((sub, idx, arr) => (
                          <div key={sub.id} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="subCategory"
                              checked={currentEditItem.subCategory === sub.name}
                              onChange={() => setCurrentEditItem({ ...currentEditItem, subCategory: sub.name })}
                            />
                            <span>{sub.name}</span>
                            <button
                              type="button"
                              className="text-xs px-1"
                              disabled={idx === 0}
                              onClick={() => moveSubcategory(currentEditItem.category, sub.id, 'up')}
                              title="Move Up"
                            >▲</button>
                            <button
                              type="button"
                              className="text-xs px-1"
                              disabled={idx === arr.length - 1}
                              onClick={() => moveSubcategory(currentEditItem.category, sub.id, 'down')}
                              title="Move Down"
                            >▼</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Status</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentEditItem.stock}
                      onChange={e => setCurrentEditItem({ ...currentEditItem, stock: e.target.value as MenuItem["stock"] })}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentEditItem.description}
                      onChange={e => setCurrentEditItem({ ...currentEditItem, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Image</label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setCurrentEditItem(item => item ? { ...item, image: ev.target?.result as string } : item);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <span className="text-xs text-gray-400 text-center">or paste an image URL below</span>
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={currentEditItem.image}
                        onChange={e => setCurrentEditItem({ ...currentEditItem, image: e.target.value })}
                      />
                      {currentEditItem.image && (
                        <Image
                          src={currentEditItem.image}
                          alt={currentEditItem.name}
                          className="mt-2 h-24 w-24 object-cover rounded-md border"
                          width={96}
                          height={96}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 px-4 py-4 flex justify-end border-t border-gray-200">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-button shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3 cursor-pointer whitespace-nowrap"
                  onClick={() => setIsQuickEditOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-button shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer whitespace-nowrap"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </section>
        </div>
      )}
      {/* Edit Modal */}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsEditModalOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Menu Item</h2>
            <form onSubmit={handleEditModalSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  name="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={editItem.name}
                  onChange={handleEditModalChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
                <input
                  type="number"
                  name="price"
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={editItem.price}
                  onChange={handleEditModalChange}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={editItem.category}
                  onChange={e => {
                    handleEditModalChange(e);
                    setEditItem(editItem => editItem ? { ...editItem, subCategory: "" } : editItem);
                  }}
                  required
                >
                  {categories.filter(cat => cat !== "All").map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              {/* 4. In Add/Edit Menu Item Modal, show subcategories in the current order with move buttons */}
              {editItem.category && subCategoryOrder[editItem.category] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                  <div className="flex flex-col gap-1">
                    {subCategoryOrder[editItem.category].map((sub, idx, arr) => (
                      <div key={sub.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="subCategory"
                          checked={editItem.subCategory === sub.name}
                          onChange={() => setEditItem({ ...editItem, subCategory: sub.name })}
                        />
                        <span>{sub.name}</span>
                        <button
                          type="button"
                          className="text-xs px-1"
                          disabled={idx === 0}
                          onClick={() => moveSubcategory(editItem.category, sub.id, 'up')}
                          title="Move Up"
                        >▲</button>
                        <button
                          type="button"
                          className="text-xs px-1"
                          disabled={idx === arr.length - 1}
                          onClick={() => moveSubcategory(editItem.category, sub.id, 'down')}
                          title="Move Down"
                        >▼</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Status</label>
                <select
                  name="stock"
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={editItem.stock}
                  onChange={handleEditModalChange}
                  required
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={editItem.description}
                  onChange={handleEditModalChange}
                  required
                ></textarea>
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Item Image</label>
                <div className="flex flex-col gap-2">
                  <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setEditItem(editItem => editItem ? { ...editItem, image: ev.target?.result as string } : editItem);
                    };
                    reader.readAsDataURL(file);
                    }
                  }}
                  />
                    <span className="text-xs text-gray-400 text-center">or paste an image URL below</span>
                    <input
                    type="text"
                    placeholder="Image URL"
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={editItem.image}
                    onChange={e =>
                      setEditItem(editItem =>
                      editItem ? { ...editItem, image: e.target.value } : editItem
                      )
                    }
                    />
                    <span className="text-xs text-gray-400 text-center">or upload an image file</span>
                    <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setEditItem(editItem =>
                        editItem ? { ...editItem, image: ev.target?.result as string } : editItem
                        );
                      };

                      
                      reader.readAsDataURL(file);
                      }
                    }}
                    />
                    {editItem.image && (
                    <Image
                      src={editItem.image}
                      alt={editItem.name}
                      className="mt-2 h-24 w-24 object-cover rounded-md border"
                      width={96}
                      height={96}
                    />
                    )}
                </div>
                </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-button"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
