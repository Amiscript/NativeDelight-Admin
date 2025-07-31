// store/query/DashboardApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

interface OverviewStats {
  todayRevenue: number;
  totalOrders: number;
  averageOrder: number;
  revenueChange: number;
  ordersChange: number;
  averageOrderChange: number;
}

interface SalesData {
  name: string;
  value: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface HourlyData {
  hour: string;
  orders: number;
}

interface PopularItem {
  name: string;
  orders: number;
}

interface InventoryAlert {
  id: number;
  name: string;
  stock: 'low' | 'out' | 'reorder';
  quantity?: number;
}

interface DashboardData {
  overview: OverviewStats;
  sales: SalesData[];
  categories: CategoryData[];
  hourly: HourlyData[];
  popularItems: PopularItem[];
  alerts: InventoryAlert[];
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, {
      period?: 'week' | 'month' | 'quarter';
      categoryType?: 'revenue' | 'orders';
    }>({
      query: (params) => ({
        url: '/',
        params: {
          period: params.period,
          category_type: params.categoryType,
        },
      }),
      providesTags: ['Dashboard'],
    }),
    refreshDashboard: builder.mutation<DashboardData, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Dashboard'],
    }),
    exportDashboardData: builder.mutation<{ url: string }, {
      period?: 'week' | 'month' | 'quarter';
      format?: 'csv' | 'pdf';
    }>({
      query: (params) => ({
        url: '/export',
        method: 'POST',
        body: params,
      }),
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useRefreshDashboardMutation,
  useExportDashboardDataMutation,
} = dashboardApi;