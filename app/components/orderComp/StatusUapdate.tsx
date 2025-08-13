
import React, { useState } from 'react';
import { Order } from './types';
import { updateOrderStatus } from '@/lib/api';

interface StatusUpdatePanelProps {
  order: Order;
  onClose: () => void;
  onSave: (updatedOrder: Order) => void;
  formatDateTime: (dateTimeString: string) => string;
}

const StatusUpdatePanel: React.FC<StatusUpdatePanelProps> = ({
  order,
  onClose,
  onSave,
  formatDateTime,
}) => {
  const [updatedOrder, setUpdatedOrder] = useState<Order>({ ...order });
  const [notes, setNotes] = useState<string>(''); // State for notes
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State for loading

  console.log(updatedOrder, "updated order");

  // Handle status change in dropdown
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdatedOrder({ ...updatedOrder, status: e.target.value });
    setError(null); // Clear any previous errors
  };

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!updatedOrder.status) {
      setError('Please select a status.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await updateOrderStatus(updatedOrder._id, updatedOrder.status);
      const updatedOrderFromServer = response; // Assuming response.data is the updated order
      setUpdatedOrder(updatedOrderFromServer);
      onSave(updatedOrderFromServer); // Call onSave with the updated order
      onClose(); // Close the panel after successful update
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Update Order Status</h2>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="flex-1 px-4 sm:px-6">
                {error && (
                  <div className="mb-4 text-sm text-red-600">{error}</div>
                )}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order ID</label>
                    <div className="mt-1 text-sm text-gray-900">{updatedOrder._id}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                    <div className="mt-1 text-sm text-gray-900">{updatedOrder.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order Time</label>
                    <div className="mt-1 text-sm text-gray-900">{formatDateTime(updatedOrder.time)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <div className="mt-1 text-sm text-gray-900">₦{updatedOrder.total.toFixed(2)}</div>
                  </div>
                  <div>
                    <label htmlFor="order-status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="order-status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={updatedOrder.status}
                      onChange={handleStatusChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="processing">Processing</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status-notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <textarea
                      id="status-notes"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Add notes about this status change..."
                      value={notes}
                      onChange={handleNotesChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 px-4 py-4 flex justify-end border-t border-gray-200">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3 cursor-pointer whitespace-nowrap"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer whitespace-nowrap ${
                    updatedOrder.status && !isSubmitting
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleSubmit}
                  disabled={!updatedOrder.status || isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatusUpdatePanel;