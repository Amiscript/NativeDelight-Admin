import React from 'react';
import { Order } from './types';
import OrderDetails from './OrderDetails';

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  onToggleDetails: (orderId: string) => void;
  onStatusUpdate: (order: Order) => void;
  onPrintReceipt: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  formatDateTime: (dateTimeString: string) => string;
}

const OrderRow: React.FC<OrderRowProps> = ({
  order,
  isExpanded,
  onToggleDetails,
  onStatusUpdate,
  onPrintReceipt,
  onCancelOrder,
  formatDateTime,
}) => {
  return (
    <React.Fragment>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onToggleDetails(order.id)}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{order.id}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{order.customer}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{formatDateTime(order.time)}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            <span className="text-gray-500 ml-1">
              ({order.items.map(item => item.name.split(' ')[0]).join(', ')})
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">₦{order.total.toFixed(2)}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'Preparing' ? 'bg-orange-100 text-orange-800' :
            order.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {order.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onStatusUpdate(order)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="Update Status"
            >
              Update Status
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => onPrintReceipt(order.id)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
              title="Print Receipt"
            >
              Print
              <i className="fas fa-print"></i>
            </button>
            <button
              onClick={() => onCancelOrder(order.id)}
              className="text-red-600 hover:text-red-900 cursor-pointer"
              title="Cancel Order"
            >
              Cancel
              <i className="fas fa-times-circle"></i>
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={7} className="px-6 py-4">
            <OrderDetails 
              items={order.items} 
              total={order.total} 
              onPrintReceipt={() => onPrintReceipt(order.id)} 
            />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default OrderRow;