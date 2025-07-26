"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MenuItemTable from "../components/ManagementComp/MeuItemTable";
import MenuStatsCards from "../components/ManagementComp/MenuStatsCard";
import MenuFilters from "../components/ManagementComp/MenuFilter";
import MenuItemForm from "../components/ManagementComp/MenuItemForm";
import DeleteConfirmationModal from "../components/ManagementComp/DeleteModal";
import { MenuItem, SubCategory } from "../components/ManagementComp/types";

// Initial data
const categories = ["All", "Burgers", "Pizza", "Salads", "Desserts", "Pasta"];

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

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    category: "Burgers",
    subCategory: "Beef Burgers",
    price: 12.99,
    stock: "In Stock",
    image: "https://public.readdy.ai/ai/img_res/f2d1c74d64489b64476350553be4a38e.jpg",
    description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce.",
  },
  // Add other initial menu items...
];

const MenuManagementPage: React.FC = () => {
  // State management
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState<MenuItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [subCategoryOrder, setSubCategoryOrder] = useState<{ [key: string]: SubCategory[] }>(subCategories);

  // New item state
  const [newItem, setNewItem] = useState<MenuItem>({
    id: Date.now(),
    name: "",
    category: "",
    subCategory: "",
    price: 0,
    stock: "In Stock",
    image: "",
    description: "",
  });

  // Helper functions
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

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    setMenuItems([...menuItems, { ...newItem, id: Date.now() }]);
    setIsAddModalOpen(false);
    setNewItem({
      id: Date.now(),
      name: "",
      category: "",
      subCategory: "",
      price: 0,
      stock: "In Stock",
      image: "",
      description: "",
    });
  };

  const handleEditModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      setMenuItems(prev => prev.map(item => item.id === editItem.id ? editItem : item));
      setIsEditModalOpen(false);
      setEditItem(null);
    }
  };

  const handleDelete = (id: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    setIsDeleteModalOpen(false);
  };

  const toggleVisibility = (id: number) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              stock: item.stock === "In Stock" ? "Out of Stock" : "In Stock",
            }
          : item
      )
    );
  };

  // Filtered items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Statistics
  const totalItems = menuItems.length;
  const activeItems = menuItems.filter(item => item.stock === "In Stock").length;
  const outOfStockItems = menuItems.filter(item => item.stock === "Out of Stock").length;
  const lowStockItems = menuItems.filter(item => item.stock === "Low Stock").length;

  // Current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar activePath="/management" />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 mt-16 lg:mt-0">
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
          
          {/* Statistics Cards */}
          <MenuStatsCards
            totalItems={totalItems}
            activeItems={activeItems}
            outOfStockItems={outOfStockItems}
            lowStockItems={lowStockItems}
          />
          
          {/* Filter Controls */}
          <MenuFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentDate={currentDate}
          />
          
          {/* Menu Items Table */}
          <MenuItemTable
            items={filteredItems}
            onEdit={(item) => {
              setEditItem({ ...item });
              setIsEditModalOpen(true);
            }}
            onDelete={(item) => {
              setDeleteModalItem(item);
              setIsDeleteModalOpen(true);
            }}
            onToggleStock={toggleVisibility}
          />
        </main>
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
            <MenuItemForm
              item={newItem}
              categories={categories.filter(cat => cat !== "All")}
              subCategories={subCategoryOrder}
              onItemChange={setNewItem}
              onMoveSubcategory={moveSubcategory}
              onSubmit={handleAddNewItem}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </div>
        </div>
      )}
      
      {/* Edit Item Modal */}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] flex flex-col">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsEditModalOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Menu Item</h2>
            <MenuItemForm
              item={editItem}
              categories={categories.filter(cat => cat !== "All")}
              subCategories={subCategoryOrder}
              onItemChange={setEditItem}
              onMoveSubcategory={moveSubcategory}
              onSubmit={handleEditModalSave}
              onCancel={() => setIsEditModalOpen(false)}
              isEditing={true}
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        item={deleteModalItem}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteModalItem && handleDelete(deleteModalItem.id)}
      />
    </div>
  );
};

export default MenuManagementPage;