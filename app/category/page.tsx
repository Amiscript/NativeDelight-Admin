// app/page.tsx
"use client";
import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import CategoryStats from '../components/CategoryComponent.tsx/CategoryStats';
import CategoryFilters from '../components/CategoryComponent.tsx/CategoryFilters';
import CategoryGrid from '../components/CategoryComponent.tsx/CategoryGrid';
import CategoryList from '../components/CategoryComponent.tsx/CategoryList';
import AddCategoryModal from '../components/CategoryComponent.tsx/Modal/AddCategoryModal';
import EditCategoryModal from '../components/CategoryComponent.tsx/Modal/EditCategoryModal ';
import DeleteModal from '../components/CategoryComponent.tsx/Modal/DeleteModal';
import { Category, ViewMode } from '../components/CategoryComponent.tsx/types';

const CategoriesPage: React.FC = () => {
  // Sample data - in a real app, this would likely come from an API
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
      name: "Appetizers",
      description: "Small dishes served before the main course.",
      itemsCount: 18,
      status: "Active",
      createdAt: "2025-02-10T08:15:00",
      image: "https://public.readdy.ai/ai/img_res/45c327ef6bff0f87588204daf02466c2.jpg",
      subcategories: [
        { id: 3, name: "Cold Appetizers", description: "Chilled starters" },
        { id: 4, name: "Hot Appetizers", description: "Warm starters" }
      ]
    },
    {
      id: 3,
      name: "Desserts",
      description: "Sweet courses served at the end of a meal.",
      itemsCount: 15,
      status: "Active",
      createdAt: "2025-01-20T14:45:00",
      image: "https://public.readdy.ai/ai/img_res/60d227ef6bff0f87588204daf02466c2.jpg",
      subcategories: [
        { id: 5, name: "Cakes", description: "Baked desserts" },
        { id: 6, name: "Ice Cream", description: "Frozen desserts" }
      ]
    },
    {
      id: 4,
      name: "Beverages",
      description: "Drinks of all kinds.",
      itemsCount: 32,
      status: "Active",
      createdAt: "2025-03-01T11:20:00",
      image: "https://public.readdy.ai/ai/img_res/75e127ef6bff0f87588204daf02466c2.jpg",
      subcategories: [
        { id: 7, name: "Alcoholic", description: "Contains alcohol" },
        { id: 8, name: "Non-Alcoholic", description: "No alcohol content" }
      ]
    }
  ]);

  // State management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  // Helper functions
  const toggleCategoryDetails = (categoryId: number) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
  };

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
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

  const handleSaveNewCategory = (newCategory: Omit<Category, 'id' | 'createdAt' | 'itemsCount'>) => {
    const categoryToAdd: Category = {
      ...newCategory,
      id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      itemsCount: 0,
      createdAt: new Date().toISOString()
    };
    setCategories([...categories, categoryToAdd]);
    setIsAddModalOpen(false);
  };

  const handleSaveEditedCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter and sort categories
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

  // Statistics calculations
  const totalCategories = categories.length;
  const activeCategories = categories.filter(category => category.status === 'Active').length;
  const mostUsedCategory = [...categories].sort((a, b) => b.itemsCount - a.itemsCount)[0];
  const unusedCategories = categories.filter(category => category.itemsCount === 0).length;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleExport = () => {
    const csvRows = [
      ['ID', 'Name', 'Description', 'Items Count', 'Status', 'Created At', 'Image', 'Subcategories'],
      ...sortedCategories.map(cat =>
        [
          cat.id,
          `"${cat.name.replace(/"/g, '""')}"`,
          `"${cat.description.replace(/"/g, '""')}"`,
          cat.itemsCount,
          cat.status,
          cat.createdAt,
          cat.image,
          cat.subcategories?.map(sub => `${sub.name}: ${sub.description}`).join('; ') || ''
        ].join(',')
      ),
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categories.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentDate={currentDate}
      />

      <main className="p-4 md:p-6 flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>Add New Category</span>
          </button>
        </div>

        <CategoryStats
          totalCategories={totalCategories}
          activeCategories={activeCategories}
          mostUsedCategory={mostUsedCategory}
          unusedCategories={unusedCategories}
        />

        <CategoryFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={handleExport}
        />

        {viewMode === 'grid' ? (
          <CategoryGrid
            categories={sortedCategories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onToggleDetails={toggleCategoryDetails}
          />
        ) : (
          <CategoryList
            categories={sortedCategories}
            expandedCategoryId={expandedCategoryId}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onToggleDetails={toggleCategoryDetails}
            formatDate={formatDate}
          />
        )}
      </main>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewCategory}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={editingCategory}
        onSave={handleSaveEditedCategory}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
      />
    </AppLayout>
  );
};

export default CategoriesPage;