import React from 'react';
import { Order } from './types';

interface OrderFiltersProps {
  searchTerm: string;
  statusFilter: string;
  dateRange: { start: string; end: string };
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  filteredOrders: Order[];
}

const OrderFilters: React.FC<OrderFiltersProps> = ({

  statusFilter,
  dateRange,
  
  onStatusFilterChange,
  onDateRangeChange,
  filteredOrders,
}) => {
  const handleExport = () => {
    const csvRows = [
      ['Order ID', 'Customer', 'Order Time', 'Items', 'Total', 'Status'],
      ...filteredOrders.map(order => [
        order._id,
        order.customer,
        formatDateTime(order.time),
        order.items.map(item => `${item.quantity}x ${item.name}`).join('; '),
        order.total.toFixed(2),
        order.status
      ])
    ];
    const csvContent = csvRows.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status-filter"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          
          {/* Date Range Filters */}
          <div>
            <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              id="date-from"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={dateRange.start}
              onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              id="date-to"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={dateRange.end}
              onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
        
        {/* Export Button */}
        <div className="flex items-center space-x-3">
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-button flex items-center space-x-1 cursor-pointer whitespace-nowrap"
            onClick={handleExport}
          >
            <i className="fas fa-download"></i>
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;