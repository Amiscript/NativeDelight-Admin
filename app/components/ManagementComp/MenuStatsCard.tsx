import React from "react";

interface MenuStatsCardsProps {
  totalItems: number;
  activeItems: number;
  outOfStockItems: number;
  lowStockItems: number;
}

const MenuStatsCards: React.FC<MenuStatsCardsProps> = ({
  totalItems,
  activeItems,
  outOfStockItems,
  lowStockItems
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-blue-100 p-3 mr-4">
          <i className="fas fa-utensils text-blue-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Menu Items</p>
          <h3 className="text-2xl font-bold">{totalItems}</h3>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-green-100 p-3 mr-4">
          <i className="fas fa-check-circle text-green-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Active Items</p>
          <h3 className="text-2xl font-bold">{activeItems}</h3>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-red-100 p-3 mr-4">
          <i className="fas fa-times-circle text-red-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Out of Stock</p>
          <h3 className="text-2xl font-bold">{outOfStockItems}</h3>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-yellow-100 p-3 mr-4">
          <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Low Stock</p>
          <h3 className="text-2xl font-bold">{lowStockItems}</h3>
        </div>
      </div>
    </div>
  );
};

export default MenuStatsCards;