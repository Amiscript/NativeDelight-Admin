// components/CategoryFilters.tsx
import React from 'react';
import { ViewMode } from './types';

interface CategoryFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortOption: string;
  onSortOptionChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onExport: () => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortOptionChange,
  viewMode,
  onViewModeChange,
  onExport,
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort-option" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort-option"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={sortOption}
              onChange={(e) => onSortOptionChange(e.target.value)}
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
              className={`px-3 py-2 flex items-center ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => onViewModeChange('grid')}
            >
              <i className="fas fa-th-large text-gray-600"></i>
            </button>
            <button
              className={`px-3 py-2 flex items-center ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => onViewModeChange('list')}
            >
              <i className="fas fa-list text-gray-600"></i>
            </button>
          </div>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-button flex items-center space-x-1"
            onClick={onExport}
          >
            <i className="fas fa-download"></i>
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;