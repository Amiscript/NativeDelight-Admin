"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import {

  // Settings as SettingsIcon,
  LogOut,
  // Upload,
 
} from 'lucide-react';


interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  time: string;
  items: OrderItem[];
  total: number;
  status: string;
}

const App: React.FC = () => {
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
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [currentEditOrder, setCurrentEditOrder] = useState<Order | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusUpdate = (order: Order) => {
    setCurrentEditOrder({ ...order });
    setIsQuickEditOpen(true);
  };

  const handleSaveStatus = () => {
    if (currentEditOrder) {
      setOrders(orders.map(order =>
        order.id === currentEditOrder.id ? currentEditOrder : order
      ));
      setIsQuickEditOpen(false);
      setCurrentEditOrder(null);
    }
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
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow">
        <button
          className="text-gray-700 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        <span className="text-lg font-bold">Orders</span>
        <div />
      </div>

      {/* Sidebar */}
      <nav
        className={`
          fixed z-30 top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg p-4 flex-shrink-0
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-semibold">Order Menu</h2>
          {/* <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <i className="fas fa-user text-white"></i>
            </div>
            <div>
              <h2 className="font-semibold">Admin User</h2>
              <p className="text-xs text-gray-400">Restaurant Manager</p>
            </div>
          </div> */}
        </div>
        <nav className="mt-4">
          <div className="px-4 py-2 text-xs text-gray-400 uppercase">Main</div>
          <a href="/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-tachometer-alt w-6"></i>
            <span>Dashboard</span>
          </a>
          <a href="/management" data-readdy="true" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-utensils w-6"></i>
            <span>Management</span>
          </a>
          {/* <a href="/order" className="flex items-center px-4 py-3 bg-gray-700 text-white cursor-pointer">
            <i className="fas fa-shopping-cart w-6"></i>
            <span>Orders</span>
          </a> */}
          <a href="/category" data-readdy="true" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-tags w-6"></i>
            <span>Categories</span>
          </a>
          <a href="/user" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-users w-6"></i>
            <span>Users</span>
          </a>
          <a href="/setting" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
            <i className="fas fa-cog w-6"></i>
            <span>Settings</span>
          </a>

          <div className="absolute bottom-[-1] left-0 right-0">
                    <div className="flex items-center space-x-3 p-4 bg-gray-800 text-white rounded-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                        alt="Admin"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-x  text-white">admin@example.com</p>
                      </div>
                      <button>
                        <LogOut className="h-5 w-5 text-gray-50" />
                      </button>
                    </div>
                  </div>
        </nav>
      </nav>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
            {/* <a
              href="https://readdy.ai/home/35216cf9-9af5-4e71-be5b-dd547ed47c7a/793edefd-bdd3-4f9f-b46a-f59649c7b0e6"
              data-readdy="true"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button flex items-center space-x-2 cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-utensils"></i>
              <span>Go to Menu Management</span>
            </a> */}
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <i className="fas fa-shopping-cart text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold">{totalOrders}</h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <i className="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <h3 className="text-2xl font-bold">{pendingOrders}</h3>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <i className="fas fa-fire text-orange-600 text-xl"></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">In Preparation</p>
                <h3 className="text-2xl font-bold">{preparingOrders}</h3>
              </div>
            </div>
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

          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status-filter"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Orders</option>
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    id="date-from"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    id="date-to"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-button flex items-center space-x-1 cursor-pointer whitespace-nowrap">
                  <i className="fas fa-download"></i>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      const csvRows = [
                        ['Order ID', 'Customer', 'Order Time', 'Items', 'Total', 'Status'],
                        ...filteredOrders.map(order => [
                          order.id,
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
                    }}
                  >
                    Export
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
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
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleOrderDetails(order.id)}>
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
                            onClick={() => handleStatusUpdate(order)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            title="Update Status"
                            
                          >
                            Update Status
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handlePrintReceipt(order.id)}
                            className="text-gray-600 hover:text-gray-900 cursor-pointer"
                            title="Print Receipt"
                          >
                            Print
                            <i className="fas fa-print"></i>
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Cancel Order"
                          >
                            Cancel
                            <i className="fas fa-times-circle"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
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
                                  {order.items.map((item, index) => (
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
                                      ₦{order.total.toFixed(2)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button text-sm cursor-pointer whitespace-nowrap flex items-center"
                                onClick={() => handlePrintReceipt(order.id)}
                                type="button"
                              >
                                <i className="fas fa-print mr-2"></i>
                                Print Receipt
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-2">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                  <span className="font-medium">{filteredOrders.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="sr-only">Previous</span>
                    <i className="fas fa-chevron-left"></i>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="sr-only">Next</span>
                    <i className="fas fa-chevron-right"></i>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Status Update Panel */}
      {isQuickEditOpen && currentEditOrder && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsQuickEditOpen(false)}></div>
            <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Update Order Status</h2>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                        onClick={() => setIsQuickEditOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 px-4 sm:px-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Order ID</label>
                        <div className="mt-1 text-sm text-gray-900">{currentEditOrder.id}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Customer</label>
                        <div className="mt-1 text-sm text-gray-900">{currentEditOrder.customer}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Order Time</label>
                        <div className="mt-1 text-sm text-gray-900">{formatDateTime(currentEditOrder.time)}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                        <div className="mt-1 text-sm text-gray-900">₦{currentEditOrder.total.toFixed(2)}</div>
                      </div>
                      <div>
                        <label htmlFor="order-status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          id="order-status"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={currentEditOrder.status}
                          onChange={(e) => setCurrentEditOrder({ ...currentEditOrder, status: e.target.value })}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="status-notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                        <textarea
                          id="status-notes"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Add notes about this status change..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                    <div className="flex-shrink-0 px-4 py-4 flex justify-end border-t border-gray-200">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-button shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3 cursor-pointer whitespace-nowrap"
                      onClick={() => setIsQuickEditOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-4 border border-transparent rounded-button shadow-sm text-sm font-medium text-white cursor-pointer whitespace-nowrap
                      ${currentEditOrder?.status ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-gray-400 cursor-not-allowed'}
                      `}
                      onClick={handleSaveStatus}
                      disabled={!currentEditOrder?.status}
                      style={{ display: 'inline-block' }}
                    >
                      Update Status
                    </button>
                    </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsCancelModalOpen(false)}
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
                onClick={() => setIsCancelModalOpen(false)}
              >
                No, Keep Order
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-button"
                onClick={confirmCancelOrder}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
