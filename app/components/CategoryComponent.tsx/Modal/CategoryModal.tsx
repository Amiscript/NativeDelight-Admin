// components/CategoryModal.tsx (updated)
import React, { useState } from 'react';
import ImageUploader from '../ImageUploader';
import SubcategoryManager from '../SubcategoryManager';
import { Category, ModalMode } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  category: Partial<Category> | null;
  onSave: (category: Partial<Category>) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  mode,
  category,
  onSave,
}) => {
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(category);

  if (!isOpen || !currentCategory) return null;

  const handleChange = (updates: Partial<Category>) => {
    setCurrentCategory({ ...currentCategory, ...updates });
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Modal backdrop and container */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              {/* Modal header */}
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {mode === 'add' ? 'Add New Category' : 'Edit Category'}
                  </h2>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>

              {/* Modal content */}
              <div className="flex-1 px-4 sm:px-6">
                <div className="space-y-6">
                  {/* Name field */}
                  <div>
                    <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                      Category Name
                    </label>
                    <input
                      type="text"
                      id="category-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentCategory.name || ''}
                      onChange={(e) => handleChange({ name: e.target.value })}
                    />
                  </div>

                  {/* Description field */}
                  <div>
                    <label htmlFor="category-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="category-description"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentCategory.description || ''}
                      onChange={(e) => handleChange({ description: e.target.value })}
                    ></textarea>
                  </div>

                  {/* Image uploader */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category Image</label>
                    <ImageUploader
                      imageUrl={currentCategory.image || ''}
                      onImageChange={(url) => handleChange({ image: url })}
                      onImageRemove={() => handleChange({ image: '' })}
                    />
                  </div>

                  {/* Status field */}
                  <div>
                    <label htmlFor="category-status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="category-status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentCategory.status || 'Active'}
                      onChange={(e) => handleChange({ status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Subcategory manager */}
                  <SubcategoryManager
                    subcategories={currentCategory.subcategories || []}
                    onSubcategoriesChange={(subcategories) =>
                      handleChange({ subcategories })
                    }
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex-shrink-0 px-4 py-4 flex flex-col sm:flex-row justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-button shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-button shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => onSave(currentCategory)}
                >
                  {mode === 'add' ? 'Add Category' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryModal;