// store/query/DashboardApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

interface SalesByDay {
  day: string;
  totalSales: number;
}

interface TopItem {
  name: string;
  totalOrdered: number;
}

interface DashboardData {
  dailyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByDay: SalesByDay[];
  topItems: TopItem[];
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/order`,
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
      period?: 'day' | 'month' | 'year';
    }>({
      query: (params) => ({
        url: '/statistics',
        params: {
          period: params.period,
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
      period?: 'day' | 'month' | 'year';
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