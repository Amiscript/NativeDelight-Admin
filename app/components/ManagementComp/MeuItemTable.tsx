import React from "react";
import Image from "next/image";
import { MenuItem } from "../ManagementComp/types";

interface MenuItemTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleStock: (id: string) => void;
}

const MenuItemTable: React.FC<MenuItemTableProps> = ({ 
  items, 
  onEdit, 
  onDelete, 
  onToggleStock 
}) => {

  console.log(items, "Menu table items");
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <Image 
                      className="h-10 w-10 rounded-md object-cover" 
                      src={item.image} 
                      alt={item.name} 
                      width={40} 
                      height={40} 
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.categoryName}</div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.subCategory || "—"}</div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">₦{item.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.stock === "In Stock"
                    ? "bg-green-800 text-white"
                    : item.stock === "Low Stock"
                    ? "bg-yellow-800 text-white"
                    : "bg-red-800 text-white"
                }`}>
                  {item.stock}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900 cursor-pointer"
                    title="Edit"
                  >
                    <span className="hidden sm:inline">Edit</span>
                    <i className="fas fa-edit ml-1"></i>
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                    title="Delete"
                  >
                    <span className="text-red-600">Delete</span>
                    <i className="fas fa-trash-alt"> </i>  
                  </button>
                  <button
                    onClick={() => item.id && onToggleStock(item.id)}
                    className={`${item.stock === "In Stock" ? "text-green-600 hover:text-green-900" : "text-gray-400 hover:text-gray-600"} cursor-pointer`}
                    title="Toggle Stock"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuItemTable;