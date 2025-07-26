import React from 'react';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <i className="fas fa-times"></i>
        </button>
        <h2 className="text-lg font-semibold mb-4 text-center">Cancel Order</h2>
        <p className="mb-6 text-center text-gray-700">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-button"
            onClick={onClose}
          >
            No, Keep Order
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-button"
            onClick={onConfirm}
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;