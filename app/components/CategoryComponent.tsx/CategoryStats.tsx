// components/CategoryStats.tsx
import React from 'react';
import { Category } from './types';

interface CategoryStatsProps {
  totalCategories: number;
  activeCategories: number;
  mostUsedCategory: Category | null;
  unusedCategories: number;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({
  totalCategories,
  activeCategories,
  mostUsedCategory,
  unusedCategories,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {/* Total Categories Card */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-blue-100 p-3 mr-4">
          <i className="fas fa-tags text-blue-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Categories</p>
          <h3 className="text-2xl font-bold">{totalCategories}</h3>
        </div>
      </div>

      {/* Active Categories Card */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-green-100 p-3 mr-4">
          <i className="fas fa-check-circle text-green-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Active Categories</p>
          <h3 className="text-2xl font-bold">{activeCategories}</h3>
        </div>
      </div>

      {/* Most Used Category Card */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-purple-100 p-3 mr-4">
          <i className="fas fa-star text-purple-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Most Used Category</p>
          <h3 className="text-xl font-bold truncate">{mostUsedCategory?.name || 'N/A'}</h3>
          <p className="text-xs text-gray-500">
            {mostUsedCategory ? `${mostUsedCategory.itemsCount} items` : ''}
          </p>
        </div>
      </div>

      {/* Unused Categories Card */}
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
  );
};

export default CategoryStats;