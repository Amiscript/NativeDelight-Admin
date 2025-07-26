// components/CategoryGrid.tsx
import React from 'react';
import Image from 'next/image';
import { Category } from './types';

interface CategoryGridProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
  onToggleDetails: (categoryId: number) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onEdit,
  onDelete,
  onToggleDetails,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onToggleDetails(category.id)}
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
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {category.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
            <p className="text-xs text-gray-500 mb-1">
              {category.subcategories && category.subcategories.length > 0
                ? `Subcategories: ${category.subcategories.map((sub) => sub.name).join(', ')}`
                : 'No subcategories'}
            </p>
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
              <div className="text-sm text-gray-500">
                <i className="fas fa-utensils mr-1"></i> {category.itemsCount} items
              </div>
              <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(category);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Category"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category.id);
                  }}
                  className="text-red-600 hover:text-red-800"
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
  );
};

export default CategoryGrid;