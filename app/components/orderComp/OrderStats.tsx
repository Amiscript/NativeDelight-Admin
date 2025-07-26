import React from 'react';

interface OrderStatsProps {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  deliveredOrders: number;
}

const OrderStats: React.FC<OrderStatsProps> = ({
  totalOrders,
  pendingOrders,
  preparingOrders,
  deliveredOrders,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {/* Total Orders */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-blue-100 p-3 mr-4">
          <i className="fas fa-shopping-cart text-blue-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h3 className="text-2xl font-bold">{totalOrders}</h3>
        </div>
      </div>
      
      {/* Pending Orders */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-yellow-100 p-3 mr-4">
          <i className="fas fa-clock text-yellow-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Pending Orders</p>
          <h3 className="text-2xl font-bold">{pendingOrders}</h3>
        </div>
      </div>
      
      {/* Preparing Orders */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-orange-100 p-3 mr-4">
          <i className="fas fa-fire text-orange-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">In Preparation</p>
          <h3 className="text-2xl font-bold">{preparingOrders}</h3>
        </div>
      </div>
      
      {/* Delivered Orders */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="rounded-full bg-green-100 p-3 mr-4">
          <i className="fas fa-check-circle text-green-600 text-xl"></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Delivered Orders</p>
          <h3 className="text-2xl font-bold">{deliveredOrders}</h3>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;