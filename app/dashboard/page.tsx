"use client";
import Sidebar from '../components/Sidebar';
import React from 'react';
import { format } from 'date-fns';
import {
  Search,
  TrendingUp,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  RefreshCw,

} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  useGetDashboardDataQuery,
  useRefreshDashboardMutation,
} from '../../store/query/DashboardApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const [period, setPeriod] = React.useState<'day' | 'month' | 'year'>('day');
  
  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardDataQuery({ period });
     

  const [refreshDashboard] = useRefreshDashboardMutation();
 

  const handleRefresh = async () => {
    try {
      await refreshDashboard().unwrap();
      refetch();
    } catch (error) {
      console.log('Failed to refresh dashboard:', error);
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        <Sidebar activePath="/dashboard" />
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <div>Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        <Sidebar activePath="/dashboard" />
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <div>Error loading dashboard data</div>
          <button 
            onClick={() => refetch()}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    dailyRevenue,
    totalOrders,
    averageOrderValue,
    salesByDay,
    topItems
  } = dashboardData;

  // Calculate percentage changes (these would typically come from your API)
  const revenueChange = 12; // Example value
  const ordersChange = 8; 
  const avgOrderChange = -3; 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar activePath="/dashboard" />

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
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRefresh}
              className="flex items-center space-x-1 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <div className="relative group">
            
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
               
              </div>
            </div>
          </div>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Today Revenue</p>
                <h3 className="text-2xl font-bold">₦{dailyRevenue.toLocaleString()}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="h-6 w-6 text-green-600">₦</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              {revenueChange >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={revenueChange >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                {Math.abs(revenueChange)}%
              </span>
             
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold">{totalOrders}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              {ordersChange >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={ordersChange >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                {Math.abs(ordersChange)}%
              </span>
           
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Average Order</p>
                <h3 className="text-2xl font-bold">₦{averageOrderValue.toLocaleString()}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              {avgOrderChange >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={avgOrderChange >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                {Math.abs(avgOrderChange)}%
              </span>
              {/* <span className="text-gray-500 ml-2">vs yesterday</span> */}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <h3 className="text-lg font-medium">Sales Performance</h3>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'day' | 'month' | 'year')}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                <option value="day">Today</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalSales" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Items Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <h3 className="text-lg font-medium">Top Selling Items</h3>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'day' | 'month' | 'year')}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                <option value="day">Today</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={topItems}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="totalOrdered"
                  >
                    {topItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {topItems.map((item, index) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

    
      </div>
    </div>
  );
}