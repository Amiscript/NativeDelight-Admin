// components/CategoryDetails.tsx
import React from 'react';
import Image from 'next/image';
import { Category } from './types';

interface CategoryDetailsProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (dateString: string) => string;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  category,
  onEdit,
  onDelete,
  formatDate,
}) => {
  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 mb-4 md:mb-0 md:pr-4">
          <Image 
            src={category.image.url} 
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
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button text-sm"
            >
              <i className="fas fa-edit mr-2"></i>
              Edit Category
            </button>
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-button text-sm"
            >
              <i className="fas fa-trash-alt mr-2"></i>
              Delete Category
            </button>
          </div>
        </div>
      </div>
      <div>
        <h5 className="text-sm font-medium text-gray-700 mb-1">Subcategories</h5>
        <ul className="list-disc list-inside text-sm text-gray-900">
          {category.subcategories && category.subcategories.length > 0 ? (
            category.subcategories.map(sub => (
              <li key={sub._id}>
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
  );
};

export default CategoryDetails;