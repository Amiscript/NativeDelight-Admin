import React from 'react';
import { OrderItem } from './types';

interface OrderDetailsProps {
  items: OrderItem[];
  total: number;
  onPrintReceipt: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ items, total, onPrintReceipt }) => {
  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Order Details</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  ₦{item.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  ₦{(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                Total:
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                ₦{total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button text-sm cursor-pointer whitespace-nowrap flex items-center"
          onClick={onPrintReceipt}
          type="button"
        >
          <i className="fas fa-print mr-2"></i>
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;