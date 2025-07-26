// components/CategoryList.tsx
import React from 'react';
import Image from 'next/image';
import { Category } from './types';

interface CategoryListProps {
  categories: Category[];
  expandedCategoryId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
  onToggleDetails: (categoryId: number) => void;
  formatDate: (dateString: string) => string;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  expandedCategoryId,
  onEdit,
  onDelete,
  onToggleDetails,
  formatDate,
}) => {
  return (
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
              <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onToggleDetails(category.id)}>
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
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(category.createdAt)}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(category);
                        }}
                        className="text-blue-600 hover:text-blue-900"
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
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                              {category.name} Details
                            </h4>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(category);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button text-sm"
                              >
                                <i className="fas fa-edit mr-2"></i>
                                Edit Category
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(category.id);
                                }}
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
                              category.subcategories.map((sub) => (
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
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{categories.length}</span> of{' '}
            <span className="font-medium">{categories.length}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <i className="fas fa-chevron-left"></i>
            </a>
            <a
              href="#"
              aria-current="page"
              className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <i className="fas fa-chevron-right"></i>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;