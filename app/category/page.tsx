"use client";
import React, { useState } from 'react';
import Image from 'next/image'
import {
  // Bell,
  // Settings as SettingsIcon,
  LogOut,
  // Upload,
  // ChevronRight,
  // Save,
  // Home
} from 'lucide-react';

// 1. Update the Category interface to include subcategories
interface SubCategory {
  id: number;
  name: string;
  description: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  itemsCount: number;
  status: string;
  createdAt: string;
  image: string;
  subcategories?: SubCategory[]; // <-- Add this line
}

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Main Dishes",
      description: "Primary menu items including entrees and main course options.",
      itemsCount: 24,
      status: "Active",
      createdAt: "2025-03-15T10:30:00",
      image: "https://public.readdy.ai/ai/img_res/30e227ef6bff0f87588204daf02466c2.jpg",
      subcategories: [
        { id: 1, name: "Rice Dishes", description: "All rice-based main dishes." },
        { id: 2, name: "Pasta Dishes", description: "All pasta-based main dishes." }
      ]
    },
    {
      id: 2,
      name: "Main Dishes",
      description: "Primary menu items including entrees and main course options.",
      itemsCount: 24,
      status: "Active",
      createdAt: "2025-03-15T10:30:00",
      image: "https://public.readdy.ai/ai/img_res/30e227ef6bff0f87588204daf02466c2.jpg"
    },
    {
      id: 3,
      name: "Main Dishes",
      description: "Primary menu items including entrees and main course options.",
      itemsCount: 24,
      status: "Active",
      createdAt: "2025-03-15T10:30:00",
      image: "https://public.readdy.ai/ai/img_res/30e227ef6bff0f87588204daf02466c2.jpg"
    },
    {
      id: 4,
      name: "Main Dishes",
      description: "Primary menu items including entrees and main course options.",
      itemsCount: 24,
      status: "Active",
      createdAt: "2025-03-15T10:30:00",
      image: "https://public.readdy.ai/ai/img_res/30e227ef6bff0f87588204daf02466c2.jpg"
    },
    // ... other categories
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  // 2. Add subcategory state for modal
  const [newSubcategory, setNewSubcategory] = useState<Partial<SubCategory>>({ name: '', description: '' });

  const toggleCategoryDetails = (categoryId: number) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
  };

  const handleAddCategory = () => {
    setCurrentCategory({
      name: '',
      description: '',
      status: 'Active',
      image: ''
     });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentCategory({ ...category });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteCategoryId(categoryId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (deleteCategoryId !== null) {
      setCategories(categories.filter(category => category.id !== deleteCategoryId));
      setIsDeleteModalOpen(false);
      setDeleteCategoryId(null);
    }
  };

  // 3. Add subcategory handlers
  const handleAddSubcategory = () => {
    if (!currentCategory) return;
    if (!newSubcategory.name) return;
    const updatedSubcategories = [
      ...(currentCategory.subcategories || []),
      {
        id: Date.now(),
        name: newSubcategory.name || '',
        description: newSubcategory.description || ''
      }
    ];
    setCurrentCategory({
      ...currentCategory,
      subcategories: updatedSubcategories
    });
    setNewSubcategory({ name: '', description: '' });
  };

  const handleDeleteSubcategory = (subId: number) => {
    if (!currentCategory || !currentCategory.subcategories) return;
    setCurrentCategory({
      ...currentCategory,
      subcategories: currentCategory.subcategories.filter(sub => sub.id !== subId)
    });
  };

  // 1. Add a function to move a subcategory up or down
  const moveSubcategory = (subId: number, direction: 'up' | 'down') => {
    if (!currentCategory || !currentCategory.subcategories) return;
    const idx = currentCategory.subcategories.findIndex(sub => sub.id === subId);
    if (idx === -1) return;
    const newSubcategories = [...currentCategory.subcategories];
    if (direction === 'up' && idx > 0) {
      [newSubcategories[idx - 1], newSubcategories[idx]] = [newSubcategories[idx], newSubcategories[idx - 1]];
    }
    if (direction === 'down' && idx < newSubcategories.length - 1) {
      [newSubcategories[idx + 1], newSubcategories[idx]] = [newSubcategories[idx], newSubcategories[idx + 1]];
    }
    setCurrentCategory({
      ...currentCategory,
      subcategories: newSubcategories
    });
  };

  const handleSaveCategory = () => {
    if (!currentCategory) return;
    if (modalMode === 'add') {
      const newCategory: Category = {
        ...currentCategory,
        id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        itemsCount: 0,
        createdAt: new Date().toISOString(),
        name: currentCategory.name || '',
        description: currentCategory.description || '',
        status: currentCategory.status || 'Active',
        image: currentCategory.image || '',
        subcategories: currentCategory.subcategories || []
      } as Category;
      setCategories([...categories, newCategory]);
    } else if (currentCategory && currentCategory.id !== undefined) {
      setCategories(categories.map(category =>
        category.id === currentCategory.id ? { ...category, ...currentCategory } : category
      ));
    }
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortOption === 'Name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'Items Count') {
      return b.itemsCount - a.itemsCount;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const totalCategories = categories.length;
  const activeCategories = categories.filter(category => category.status === 'Active').length;
  const mostUsedCategory = [...categories].sort((a, b) => b.itemsCount - a.itemsCount)[0];
  const unusedCategories = categories.filter(category => category.itemsCount === 0).length;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow">
        <button
          className="text-gray-700 focus:outline-none"
          onClick={() => {
            document.getElementById('sidebar')?.classList.toggle('translate-x-0');
            document.getElementById('sidebar-overlay')?.classList.toggle('hidden');
          }}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-lg font-bold">Categories</span>
        <div />
      </div>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`
          fixed z-30 top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg p-4 flex-shrink-0
          transition-transform duration-200
          -translate-x-full
          lg:translate-x-0 lg:static lg:block
        `}
        style={{ willChange: 'transform' }}
      >
        <div className="p-4 border-b bg-gray-900">
          <h2 className="font-semibold">Category Menu </h2>
          <div className="flex items-center space-x-3">
            {/* <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
              <i className="fas fa-user text-white"></i>
            </div> */}
            {/* <div>
              <h2 className="font-semibold">Admin User</h2>
              <p className="text-xs text-gray-400">Restaurant Manager</p>
            </div> */}
          </div>
        </div>
        <nav className="mt-4">
          <div className="px-4 py-2 text-xs text-gray-400 uppercase">Main</div>
          <a href="/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-tachometer-alt w-6"></i>
            <span>Dashboard</span>
          </a>
          <a href="/management" data-readdy="true" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-utensils w-6"></i>
            <span>Management</span>
          </a>
          <a href="/order" data-readdy="true" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-shopping-cart w-6"></i>
            <span>Orders</span>
          </a>
          {/* <a href="/category" className="flex items-center px-4 py-3 bg-gray-700 text-white cursor-pointer">
            <i className="fas fa-tags w-6"></i>
            <span>Categories</span>
          </a> */}
          <a href="user" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-users w-6"></i>
            <span>Users</span>
          </a>
          <a href="setting" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-cog w-6"></i>
            <span>Settings</span>
          </a>
          <div className="absolute bottom-[-1] left-0 right-0">
                    <div className="flex items-center space-x-3 p-4 bg-gray-900 text-white rounded-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                        alt="Admin"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-x  text-white">admin@example.com</p>
                      </div>
                      <button>
                        <LogOut className="h-5 w-5 text-gray-50" />
                      </button>
                    </div>
                  </div>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden hidden"
        id="sidebar-overlay"
        onClick={() => {
          document.getElementById('sidebar')?.classList.remove('translate-x-0');
          document.getElementById('sidebar-overlay')?.classList.add('hidden');
        }}
      />

      {/* Main Content */}
      <div className=" lg:ml-30 flex flex-col justify-around">
        <header className="bg-white shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-6 py-3 gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-gray-600">{currentDate}</div>
              <div className="relative cursor-pointer">
                {/* <i className="fas fa-bell text-gray-600 text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> */}
              </div>
              <div className="relative cursor-pointer">
                {/* <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 cursor-pointer whitespace-nowrap !rounded-button">
                  <span>Quick Actions</span>
                  <i className="fas fa-chevron-down text-xs"></i>
                </button> */}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 !rounded-button flex items-center space-x-2 cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-plus"></i>
              <span>Add New Category</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <i className="fas fa-tags text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Categories</p>
                <h3 className="text-2xl font-bold">{totalCategories}</h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Categories</p>
                <h3 className="text-2xl font-bold">{activeCategories}</h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <i className="fas fa-star text-purple-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Most Used Category</p>
                <h3 className="text-xl font-bold truncate">{mostUsedCategory?.name || 'N/A'}</h3>
                <p className="text-xs text-gray-500">{mostUsedCategory ? `${mostUsedCategory.itemsCount} items` : ''}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Unused Categories</p>
                <h3 className="text-2xl font-bold">{unusedCategories}</h3>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-4">
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status-filter"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sort-option" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    id="sort-option"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="Name">Name</option>
                    <option value="Items Count">Items Count</option>
                    <option value="Date Created">Date Created</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button 
                    className={`px-3 py-2 flex items-center ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'} cursor-pointer whitespace-nowrap`}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="fas fa-th-large text-gray-600"></i>
                  </button>
                  <button 
                    className={`px-3 py-2 flex items-center ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'} cursor-pointer whitespace-nowrap`}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="fas fa-list text-gray-600"></i>
                  </button>
                </div>
                {/* Export Button */}
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 !rounded-button flex items-center space-x-1 cursor-pointer whitespace-nowrap"
                  onClick={() => {
                  // Export categories as CSV
                  const csvRows = [
                    ['ID', 'Name', 'Description', 'Items Count', 'Status', 'Created At', 'Image'],
                    ...sortedCategories.map(cat =>
                    [
                      cat.id,
                      `"${cat.name.replace(/"/g, '""')}"`,
                      `"${cat.description.replace(/"/g, '""')}"`,
                      cat.itemsCount,
                      cat.status,
                      cat.createdAt,
                      cat.image
                    ].join(',')
                    )
                  ];
                  const csvContent = csvRows.join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'categories.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                  }}
                >
                  <i className="fas fa-download"></i>
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Responsive Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
              {sortedCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => toggleCategoryDetails(category.id)}
                >
                  <div className="h-32 overflow-hidden">
                    <Image
                      src={category.image} 
                      alt={category.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                    {/* 5. Show subcategories in grid/list/details
                    // In the grid view card, after description: */}
                    <p className="text-xs text-gray-500 mb-1">
                      {category.subcategories && category.subcategories.length > 0
                        ? `Subcategories: ${category.subcategories.map(sub => sub.name).join(', ')}`
                        : 'No subcategories'}
                    </p>
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
                      <div className="text-sm text-gray-500">
                        <i className="fas fa-utensils mr-1"></i> {category.itemsCount} items
                      </div>
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => handleEditCategory(category, e)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap"
                          title="Edit Category"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button 
                          onClick={(e) => handleDeleteCategory(category.id, e)}
                          className="text-red-600 hover:text-red-800 cursor-pointer whitespace-nowrap"
                          title="Delete Category"
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-x-auto mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      {/* <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subcategories
                      </th> */}
                      <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedCategories.map((category) => (
                      <React.Fragment key={category.id}>
                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleCategoryDetails(category.id)}>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <Image
                                  src={category.image} 
                                  alt={category.name}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-full object-cover object-top"
                                />
                              </div>
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm text-gray-900 line-clamp-1">{category.description}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{category.itemsCount}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {category.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(category.createdAt)}</div>
                          </td>
                          {/* <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-700">
                              {category.subcategories && category.subcategories.length > 0
                                ? category.subcategories.map(sub => sub.name).join(', ')
                                : '—'}
                            </div>
                          </td> */}
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => handleEditCategory(category, e)}
                                className="text-blue-600 hover:text-blue-900 cursor-pointer whitespace-nowrap"
                                title="Edit Category"
                              >
                                <i className="fas fa-edit"></i> Edit
                              </button>
                              <button
                                onClick={(e) => handleDeleteCategory(category.id, e)}
                                className="text-red-600 hover:text-red-800 cursor-pointer whitespace-nowrap"
                                title="Delete Category"
                              >
                                <i className="fas fa-trash-alt"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedCategoryId === category.id && (
                          <tr className="bg-gray-50">
                            <td colSpan={6} className="px-4 sm:px-6 py-4">
                              <div className="border-t border-gray-200 pt-4">
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-1/4 mb-4 md:mb-0 md:pr-4">
                                    <Image 
                                      src={category.image} 
                                      alt={category.name}
                                      width={100}
                                      height={48}
                                      className="w-full h-48 object-cover object-top rounded-lg"
                                    />
                                  </div>
                                  <div className="md:w-3/4">
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">{category.name} Details</h4>
                                    <p className="text-sm text-gray-700 mb-4">{category.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-1">Status</h5>
                                        <p className="text-sm text-gray-900">{category.status}</p>
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-1">Created On</h5>
                                        <p className="text-sm text-gray-900">{formatDate(category.createdAt)}</p>
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-1">Total Items</h5>
                                        <p className="text-sm text-gray-900">{category.itemsCount} items</p>
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-1">Usage</h5>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                          <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${Math.min(100, (category.itemsCount / 30) * 100)}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col xs:flex-row xs:justify-end xs:space-x-3 mt-4 gap-2">
                                      <button
                                        onClick={(e) => handleEditCategory(category, e)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 !rounded-button text-sm cursor-pointer whitespace-nowrap"
                                      >
                                        <i className="fas fa-edit mr-2"></i>
                                        Edit Category
                                      </button>
                                      <button
                                        onClick={(e) => handleDeleteCategory(category.id, e)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 !rounded-button text-sm cursor-pointer whitespace-nowrap"
                                      >
                                        <i className="fas fa-trash-alt mr-2"></i>
                                        Delete Category
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                {/* In the expanded details row: */}
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Subcategories</h5>
                                  <ul className="list-disc list-inside text-sm text-gray-900">
                                    {category.subcategories && category.subcategories.length > 0 ? (
                                      category.subcategories.map(sub => (
                                        <li key={sub.id}>
                                          <span className="font-semibold">{sub.name}</span>
                                          {sub.description ? `: ${sub.description}` : ''}
                                        </li>
                                      ))
                                    ) : (
                                      <li>No subcategories</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-2">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedCategories.length}</span> of{' '}
                    <span className="font-medium">{sortedCategories.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="sr-only">Previous</span>
                      <i className="fas fa-chevron-left"></i>
                    </a>
                    <a
                      href="#"
                      aria-current="page"
                      className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="sr-only">Next</span>
                      <i className="fas fa-chevron-right"></i>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">
                        {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
                      </h2>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                        onClick={() => setIsModalOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 px-4 sm:px-6">
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">Category Name</label>
                        <input
                          type="text"
                          id="category-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={currentCategory?.name || ''}
                          onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label htmlFor="category-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          id="category-description"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={currentCategory?.description || ''}
                          onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category Image</label>
                        <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          {currentCategory?.image ? (
                            <div className="relative">
                              <Image
                                src={currentCategory.image}
                                alt="Category preview"
                                width={128}
                                height={128}
                                className="h-32 w-32 object-cover object-top rounded-md"
                              />
                              <button
                                type="button"
                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none cursor-pointer"
                                onClick={() => setCurrentCategory({ ...currentCategory, image: '' })}
                              >
                                <i className="fas fa-times text-xs"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-500 cursor-pointer">
                              <i className="fas fa-cloud-upload-alt text-2xl"></i>
                            </div>
                          )}
                          <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <input
                              type="text"
                              placeholder="Paste image URL"
                              className="block border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={currentCategory?.image || ''}
                              onChange={e => setCurrentCategory({ ...currentCategory, image: e.target.value })}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              className="block border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setCurrentCategory({ ...currentCategory, image: reader.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="category-status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          id="category-status"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={currentCategory?.status || 'Active'}
                          onChange={(e) => setCurrentCategory({...currentCategory, status: e.target.value})}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      {/* 6. In the Add/Edit Modal, add subcategory management UI before the Save/Cancel buttons: */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subcategories</label>
                        <div className="space-y-2">
                          {(currentCategory?.subcategories || []).map((sub, idx, arr) => (
                            <div key={sub.id} className="flex items-center space-x-2">
                              <span className="text-sm font-semibold">{sub.name}</span>
                              <span className="text-xs text-gray-500">{sub.description}</span>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 text-xs"
                                disabled={idx === 0}
                                onClick={() => moveSubcategory(sub.id, 'up')}
                                title="Move Up"
                              >
                                <i className="fas fa-arrow-up"></i>
                              </button>
                              <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700 text-xs"
                                disabled={idx === arr.length - 1}
                                onClick={() => moveSubcategory(sub.id, 'down')}
                                title="Move Down"
                              >
                                <i className="fas fa-arrow-down"></i>
                              </button>
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 text-xs"
                                onClick={() => handleDeleteSubcategory(sub.id)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                          <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <input
                              type="text"
                              placeholder="Subcategory name"
                              className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                              value={newSubcategory.name || ''}
                              onChange={e => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="Description"
                              className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                              value={newSubcategory.description || ''}
                              onChange={e => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                            />
                            <button
                              type="button"
                              className="bg-green-600 text-white px-2 py-1 rounded-md text-xs"
                              onClick={handleAddSubcategory}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-4 py-4 flex flex-col sm:flex-row justify-end gap-2 border-t border-gray-200">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-button shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer whitespace-nowrap"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-blue-600 py-2 px-4 border border-transparent rounded-button shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer whitespace-nowrap"
                      onClick={handleSaveCategory}
                    >
                      {modalMode === 'add' ? 'Add Category' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <span className="sr-only">Close</span>
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">Delete Category</h2>
            <p className="mb-6 text-center text-gray-700">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-button"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-button"
                onClick={confirmDeleteCategory}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;