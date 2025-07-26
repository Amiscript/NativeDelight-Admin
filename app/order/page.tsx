"use client";
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import OrderStats from '../components/orderComp/OrderStats';
import OrderFilters from '../components/orderComp/orderFilter';
import OrderTable from '../components/orderComp/OrderTable';
import StatusUpdatePanel from '../components/orderComp/StatusUapdate';
import CancelOrderModal from '../components/orderComp/CancelOrderModal';
import { Order, DateRange, OrderItem } from '../components/orderComp/types';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-2504",
      customer: "John Smith",
      time: "2025-04-03T09:15:00",
      items: [
        { name: "Classic Cheeseburger", quantity: 2, price: 12.99 },
        { name: "French Fries", quantity: 1, price: 4.99 },
        { name: "Chocolate Milkshake", quantity: 1, price: 5.99 }
      ],
      total: 36.96,
      status: "Pending"
    },
    {
      id: "ORD-2503",
      customer: "Emma Johnson",
      time: "2025-04-03T08:45:00",
      items: [
        { name: "Margherita Pizza", quantity: 1, price: 14.99 },
        { name: "Caesar Salad", quantity: 1, price: 9.99 },
        { name: "Iced Tea", quantity: 2, price: 2.99 }
      ],
      total: 30.96,
      status: "Preparing"
    },
    {
      id: "ORD-2502",
      customer: "Michael Brown",
      time: "2025-04-03T08:20:00",
      items: [
        { name: "Chicken Alfredo", quantity: 1, price: 15.99 },
        { name: "Garlic Bread", quantity: 1, price: 3.99 },
        { name: "Tiramisu", quantity: 1, price: 7.99 }
      ],
      total: 27.97,
      status: "Ready"
    },
    {
      id: "ORD-2501",
      customer: "Sarah Wilson",
      time: "2025-04-03T07:50:00",
      items: [
        { name: "Vegetarian Wrap", quantity: 1, price: 10.99 },
        { name: "Sweet Potato Fries", quantity: 1, price: 5.99 },
        { name: "Lemonade", quantity: 1, price: 3.49 }
      ],
      total: 20.47,
      status: "Delivered"
    },
    {
      id: "ORD-2500",
      customer: "David Lee",
      time: "2025-04-02T19:30:00",
      items: [
        { name: "BBQ Burger", quantity: 1, price: 13.99 },
        { name: "Onion Rings", quantity: 1, price: 4.99 },
        { name: "Chocolate Brownie", quantity: 1, price: 6.99 }
      ],
      total: 25.97,
      status: "Delivered"
    },
    {
      id: "ORD-2499",
      customer: "Lisa Garcia",
      time: "2025-04-02T19:15:00",
      items: [
        { name: "Pepperoni Pizza", quantity: 1, price: 16.99 },
        { name: "Buffalo Wings", quantity: 1, price: 11.99 },
        { name: "Soda", quantity: 2, price: 2.49 }
      ],
      total: 33.96,
      status: "Delivered"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState<DateRange>({ start: '', end: '' });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [currentEditOrder, setCurrentEditOrder] = useState<Order | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusUpdate = (order: Order) => {
    setCurrentEditOrder({ ...order });
    setIsQuickEditOpen(true);
  };

  const handleSaveStatus = (updatedOrder: Order) => {
    setOrders(orders.map(order =>
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setIsQuickEditOpen(false);
    setCurrentEditOrder(null);
  };

  const handlePrintReceipt = (orderId: string) => {
    alert(`Printing receipt for order ${orderId}`);
  };

  const handleCancelOrder = (orderId: string) => {
    setCancelOrderId(orderId);
    setIsCancelModalOpen(true);
  };

  const confirmCancelOrder = () => {
    if (cancelOrderId) {
      setOrders(orders.map(order =>
        order.id === cancelOrderId ? { ...order, status: "Cancelled" } : order
      ));
      setIsCancelModalOpen(false);
      setCancelOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const orderDate = new Date(order.time).toISOString().split('T')[0];
      matchesDate = orderDate >= dateRange.start && orderDate <= dateRange.end;
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const preparingOrders = orders.filter(order => order.status === 'Preparing').length;
  const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <Sidebar activePath="/order" />

      {/* Main Content */}
      <div className="flex-1 lg:ml-20">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-6 py-3 gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search orders or customers..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-gray-600">{currentDate}</div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
          </div>

          <OrderStats 
            totalOrders={totalOrders}
            pendingOrders={pendingOrders}
            preparingOrders={preparingOrders}
            deliveredOrders={deliveredOrders}
          />

          <OrderFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            dateRange={dateRange}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onDateRangeChange={setDateRange}
            filteredOrders={filteredOrders}
          />

          <OrderTable
            orders={filteredOrders}
            expandedOrderId={expandedOrderId}
            onToggleDetails={toggleOrderDetails}
            onStatusUpdate={handleStatusUpdate}
            onPrintReceipt={handlePrintReceipt}
            onCancelOrder={handleCancelOrder}
            formatDateTime={formatDateTime}
          />
        </main>
      </div>

      {isQuickEditOpen && currentEditOrder && (
        <StatusUpdatePanel
          order={currentEditOrder}
          onClose={() => setIsQuickEditOpen(false)}
          onSave={handleSaveStatus}
          formatDateTime={formatDateTime}
        />
      )}

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={confirmCancelOrder}
      />
    </div>
  );
};

export default OrdersPage;