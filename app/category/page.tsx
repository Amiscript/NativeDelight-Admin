
"use client";
import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import CategoryFilters from '../components/CategoryComponent.tsx/CategoryFilters';
import CategoryGrid from '../components/CategoryComponent.tsx/CategoryGrid';
import CategoryList from '../components/CategoryComponent.tsx/CategoryList';
import AddCategoryModal from '../components/CategoryComponent.tsx/Modal/AddCategoryModal';
import DeleteModal from '../components/CategoryComponent.tsx/Modal/DeleteModal';
import { CategoriesStats, Category, ViewMode, SubCategory, AddNewCategory } from '../components/CategoryComponent.tsx/types';
import { addCategory, fetchSubcategories, getCategoriesData, updateCategory } from '@/lib/api';
import CategoryStats from '../components/CategoryComponent.tsx/CategoryStats';
import EditCategoryModal from '../components/CategoryComponent.tsx/Modal/EditCategoryModal ';
import { toast } from 'react-toastify';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoriesStats>({
    totalCategories: 0,
    totalActiveCategories: 0,
    mostOrderedCategory: { name: '', totalOrdered: 0, _id: '' },
  });

  const toggleCategoryDetails = (categoryId: string) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
  };

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setDeleteCategoryId(categoryId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (deleteCategoryId !== null) {
      setCategories(categories.filter((category) => category._id !== deleteCategoryId));
      setIsDeleteModalOpen(false);
      setDeleteCategoryId(null);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [fetchedCategories, subcategoriesData] = await Promise.all([getCategoriesData(), fetchSubcategories()]);
        setCategories(fetchedCategories.categories || []);
        setCategoryStats({
          totalCategories: fetchedCategories.totalCategories || 0,
          totalActiveCategories: fetchedCategories.totalActiveCategories || 0,
          mostOrderedCategory: {
            name: fetchedCategories.mostOrderedCategory?.name || '',
            totalOrdered: fetchedCategories.mostOrderedCategory?.totalOrdered || 0,
            _id: fetchedCategories.mostOrderedCategory?._id || '',
          },
        });
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  console.log("subcategories data", subcategories);

  const handleSaveNewCategory = async (newCategory: Omit<AddNewCategory, '_id' | 'createdAt' | 'itemsCount'>) => {
    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      formData.append('description', newCategory.description);
      formData.append('status', newCategory.status);
      if (newCategory.image) {
        const response = await fetch(newCategory.image);
        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();
        formData.append('image', blob, 'category-image.jpg');
      }
      if (newCategory.subcategories?.length) {
        formData.append('subcategories', JSON.stringify(newCategory.subcategories));
      }

      // Debug FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      const addedCategory = await addCategory(formData);
      console.log('API response:', addedCategory);
      setCategories([...categories, addedCategory]);
      setIsAddModalOpen(false);
      // Success toast
    toast.success('Category added successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });
    } catch (error) {
      toast.error('Failed to add category. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error adding category:', error);
    }
  };

  const handleSaveEditedCategory = async (updatedCategory: Category) => {
    try {
      const formData = new FormData();
      formData.append('name', updatedCategory.name);
      formData.append('description', updatedCategory.description);
      formData.append('status', updatedCategory.status);
      if (updatedCategory.image.url && updatedCategory.image.url.startsWith('data:')) {
        const response = await fetch(updatedCategory.image.url);
        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();
        formData.append('image', blob, 'category-image.jpg');
      }
      if (updatedCategory.subcategories?.length) {
        formData.append('subcategories', JSON.stringify(updatedCategory.subcategories));
      }

      // Debug FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      const updated = await updateCategory({ categoryId: updatedCategory._id, data: formData });

      console.log('API response:', updated);
      setCategories(categories.map((cat) => (cat._id === updatedCategory._id ? updated : cat)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',     
      year: 'numeric',
    });
  };  

  const filteredCategories = categories.filter((category) => {
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

  const totalCategories = categoryStats.totalCategories;
  const activeCategories = categoryStats.totalActiveCategories;
  const mostUsedCategory = categoryStats.mostOrderedCategory;
  const emptyCategories = categories.filter((category) => category.itemsCount === 0).length;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleExport = () => {
    const csvRows = [
      ['ID', 'Name', 'Description', 'Items Count', 'Status', 'Created At', 'Image', 'Subcategories'],
      ...sortedCategories.map((cat) => [
        cat._id,
        `"${cat.name.replace(/"/g, '""')}"`,
        `"${cat.description.replace(/"/g, '""')}"`,
        cat.itemsCount,
        cat.status,
        cat.createdAt,
        cat.image.url,
        cat.subcategories?.join('; ') || '',
      ].join(',')),
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
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} currentDate={currentDate} />
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
          unusedCategories={emptyCategories}
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
        categories={categories}
        subcategories={subcategories}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={editingCategory}
        subcategories={subcategories}
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