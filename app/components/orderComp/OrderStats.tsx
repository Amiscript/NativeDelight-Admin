import React from 'react';

interface OrderStatsProps {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  processingOrders: number;
}

const OrderStats: React.FC<OrderStatsProps> = ({
  totalOrders,
  pendingOrders,
  preparingOrders,
  deliveredOrders,
  cancelledOrders,
  processingOrders,
}) => {

 return (
    <div className="px-4 sm:px-6 lg:px-8 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center min-w-0">
          <div className="rounded-full bg-blue-100 p-3 mr-4 flex-shrink-0">
            <i className="fas fa-shopping-cart text-blue-600 text-xl"></i>
          </div>
          <div className="truncate">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h3 className="text-xl font-bold truncate">{totalOrders}</h3> 
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center min-w-0">
          <div className="rounded-full bg-yellow-100 p-3 mr-4 flex-shrink-0">
            <i className="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
          <div className="truncate">
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <h3 className="text-xl font-bold truncate">{pendingOrders}</h3>
          </div>
        </div>

        {/* Processing Orders */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center min-w-0">
          <div className="rounded-full bg-orange-100 p-3 mr-4 flex-shrink-0">
            <i className="fas fa-fire text-orange-600 text-xl"></i>
          </div>
          <div className="truncate">
            <p className="text-gray-500 text-sm">Processing Orders</p>
            <h3 className="text-xl font-bold truncate">{processingOrders}</h3>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center min-w-0">
          <div className="rounded-full bg-green-100 p-3 mr-4 flex-shrink-0">
            <i className="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
          <div className="truncate">
            <p className="text-gray-500 text-sm">Delivered Orders</p>
            <h3 className="text-xl font-bold truncate">{deliveredOrders}</h3>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center min-w-0">
          <div className="rounded-full bg-red-100 p-3 mr-4 flex-shrink-0">
            <i className="fas fa-times-circle text-red-600 text-xl"></i>
          </div>
          <div className="truncate">
            <p className="text-gray-500 text-sm">Cancelled Orders</p>
            <h3 className="text-xl font-bold truncate">{cancelledOrders}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;