"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import OrderStats from '../components/orderComp/OrderStats';
import OrderFilters from '../components/orderComp/orderFilter';
import OrderTable from '../components/orderComp/OrderTable';
import StatusUpdatePanel from '../components/orderComp/StatusUapdate';
import CancelOrderModal from '../components/orderComp/CancelOrderModal';
import { Order, DateRange} from '../components/orderComp/types';
import { getOrderHistory } from '@/lib/api';

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState<DateRange>({ start: '', end: '' });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [currentEditOrder, setCurrentEditOrder] = useState<Order | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

    const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<any | null>(null);
  const [orderStats, seetOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    processingOrders: 0,
  });

  console.log(error)
  useEffect(() => {
    try {
      const fetchOrderHistory = async () => {
        const response = await getOrderHistory();
        if (response && response.data) {
          setOrders(response.data?.orders || []);
          seetOrderStats({
            totalOrders: response.data.pagination.totalOrders,
            pendingOrders: response.data.pagination?.pendingOrders || 0,
            cancelledOrders: response.data.pagination?.cancelledOrders || 0,
            completedOrders: response.data?.pagination?.completedOrders || 0,
            processingOrders: response.data?.pagination?.processingOrders || 0,
          })
        }
      };
      fetchOrderHistory();
    } catch (error) {
      setError(error)
    }
  }, [])


  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusUpdate = (order: Order) => {
    setCurrentEditOrder({ ...order });
    setIsQuickEditOpen(true);
  };

  const handleSaveStatus = (updatedOrder: Order) => {
    setOrders(orders.map(order =>
      order._id === updatedOrder._id ? updatedOrder : order
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
        order._id === cancelOrderId ? { ...order, status: "Cancelled" } : order
      ));
      setIsCancelModalOpen(false);
      setCancelOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const orderDate = new Date(order.time).toISOString().split('T')[0];
      matchesDate = orderDate >= dateRange.start && orderDate <= dateRange.end;
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

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
            totalOrders={orderStats.totalOrders}
            pendingOrders={orderStats.pendingOrders}
            preparingOrders={orderStats.completedOrders}
            deliveredOrders={orderStats.completedOrders}
            cancelledOrders={orderStats.cancelledOrders}
            processingOrders={orderStats.processingOrders}
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