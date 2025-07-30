import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer: string;
  time: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  notes?: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenue: number;
}

interface UpdateOrderStatusPayload {
  id: string;
  status: Order['status'];
  notes?: string;
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    // Get all orders with optional filters
    getOrders: builder.query<Order[], { 
      status?: string; 
      startDate?: string; 
      endDate?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/',
        params: {
          status: params.status,
          start_date: params.startDate,
          end_date: params.endDate,
          search: params.search
        }
      }),
      providesTags: ['Order'],
    }),

    // Get a single order by ID
    getOrder: builder.query<Order, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    // Create a new order
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<Order, UpdateOrderStatusPayload>({
      query: ({ id, ...patch }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),

    // Cancel an order
    cancelOrder: builder.mutation<Order, { id: string; reason?: string }>({
      query: ({ id, ...body }) => ({
        url: `/${id}/cancel`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),

    // Get order statistics
    getOrderStats: builder.query<OrderStats, { 
      startDate?: string; 
      endDate?: string;
    }>({
      query: (params) => ({
        url: '/stats',
        params: {
          start_date: params.startDate,
          end_date: params.endDate
        }
      }),
    }),

    // Print receipt
    printReceipt: builder.mutation<{ url: string }, string>({
      query: (id) => ({
        url: `/${id}/receipt`,
        method: 'POST',
      }),
    }),

    // Export orders to CSV
    exportOrders: builder.mutation<{ url: string }, { 
      status?: string; 
      startDate?: string; 
      endDate?: string;
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
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useGetOrderStatsQuery,
  usePrintReceiptMutation,
  useExportOrdersMutation,
} = orderApi;