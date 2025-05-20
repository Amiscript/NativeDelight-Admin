"use client";

import Image from "next/image";
import React from 'react';
import { format } from 'date-fns';
import {
  Search,
  Bell,
  Package,
  LogOut,
  TrendingUp,
  ShoppingCart,
  Star,
  ArrowUp,
  ArrowDown,
  BarChart2,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

// Mock data for charts
const salesData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const categoryData = [
  { name: 'Main Course', value: 400 },
  { name: 'Appetizers', value: 300 },
  { name: 'Desserts', value: 300 },
  { name: 'Beverages', value: 200 },
];

const hourlyData = [
  { hour: '11:00', orders: 15 },
  { hour: '12:00', orders: 30 },
  { hour: '13:00', orders: 45 },
  { hour: '14:00', orders: 25 },
  { hour: '15:00', orders: 20 },
  { hour: '16:00', orders: 35 },
];

const popularItems = [
  { name: 'Margherita Pizza', orders: 145 },
  { name: 'Chicken Wings', orders: 120 },
  { name: 'Caesar Salad', orders: 98 },
  { name: 'Chocolate Cake', orders: 87 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
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
        <span className="text-lg font-bold">Dashboard</span>
        <div />
      </div>

      {/* Sidebar */}
      <nav
        className={`
          fixed z-30 top-0 left-0 h-full w-64  bg-gray-900  shadow-lg p-4 flex-shrink-0
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <div className="flex items-center space-x-2  bg-gray-900 mb-8">
          <BarChart2 className="h-8 w-8 text-white" />
          <h1 className="text-xl  text-white font-bold">Dashboard</h1>
        </div>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-white hover:bg-gray-700 rounded-lg">
            <BarChart2 className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          <a href="/management">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Management</span>
            </button>
          </a>
          <a href="/category">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Category</span>
            </button>
          </a>
          <a href="/order">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Order</span>
            </button>
          </a>
          <a href="/user">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Users</span>
            </button>
          </a>
          <a href="/setting">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700">
              <span>Settings</span>
            </button>
          </a>
        </div>
        <div className="absolute left-4 right-4  bg-gray-900  text-white bottom-4 lg:static lg:mt-auto">
          <div className="flex items-center space-x-3 p-4 rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Admin"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
            <button>
              <LogOut className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-500 hidden sm:inline">{format(new Date(), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative">
              {/* <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span> */}
            </button>
          </div>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Todays Revenue</p>
                <h3 className="text-2xl font-bold">₦3,240</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="h-6 w-6 text-green-600">₦</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold">156</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">8%</span>
              <span className="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Average Order</p>
                <h3 className="text-2xl font-bold">₦24.50</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">3%</span>
              <span className="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>

          {/* <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Customer Rating</p>
                <h3 className="text-2xl font-bold">4.8/5.0</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">4%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div> */}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <h3 className="text-lg font-medium">Sales Performance</h3>
              <select className="border rounded-lg px-3 py-1 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <h3 className="text-lg font-medium">Category Performance</h3>
              <select className="border rounded-lg px-3 py-1 text-sm">
                <option>By Revenue</option>
                <option>By Orders</option>
              </select>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Hourly Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-6">Hourly Orders</h3>
            <div className="h-48 md:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-6">Popular Items</h3>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">{index + 1}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-500">{item.orders} orders</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-6">Inventory Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">Low stock: Chicken Wings (5 left)</span>
              </div>
              <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">Out of stock: Mozzarella Cheese</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-600 bg-blue-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">Reorder needed: Tomato Sauce</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Manage Menu</span>
              <Plus className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Update items and prices</p>
          </button>
          <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">View Orders</span>
              <ShoppingCart className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Process pending orders</p>
          </button>
          <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Update Inventory</span>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Manage stock levels</p>
          </button>
          <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Customer Feedback</span>
              <Star className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">View recent reviews</p>
          </button>
        </div> */}
      </div>
    </div>
  );
}