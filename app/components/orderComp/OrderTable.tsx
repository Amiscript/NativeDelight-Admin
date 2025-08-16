import React from 'react';
import { Order } from './types';
import OrderRow from './OrderRow';

interface OrderTableProps {
  orders: Order[];
  expandedOrderId: string | null;
  onToggleDetails: (orderId: string) => void;
  onStatusUpdate: (order: Order) => void;
  onPrintReceipt: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  formatDateTime: (dateTimeString: string) => string;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  expandedOrderId,
  onToggleDetails,
  onStatusUpdate,
  onPrintReceipt,
  onCancelOrder,
  formatDateTime,
}) => {

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              isExpanded={expandedOrderId === order._id}
              onToggleDetails={onToggleDetails}
              onStatusUpdate={onStatusUpdate}
              onPrintReceipt={onPrintReceipt}
              onCancelOrder={onCancelOrder}
              formatDateTime={formatDateTime}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;