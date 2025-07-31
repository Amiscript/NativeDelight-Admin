// store/slices/orderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


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

// interface UpdateOrderStatusPayload {
//   id: string;
//   status: Order['status'];
//   notes?: string;
// }




interface OrderState {
  currentOrder: Order | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
  stats: OrderStats | null;
  filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  };
}

const initialState: OrderState = {
  currentOrder: null,
  orders: [],
  loading: false,
  error: null,
  stats: null,
  filters: {},
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status']; notes?: string }>) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index].status = action.payload.status;
        if (action.payload.notes) {
          state.orders[index].notes = action.payload.notes;
        }
      }
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder.status = action.payload.status;
        if (action.payload.notes) {
          state.currentOrder.notes = action.payload.notes;
        }
      }
    },
    cancelOrder: (state, action: PayloadAction<{ id: string; reason?: string }>) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index].status = 'Cancelled';
        if (action.payload.reason) {
          state.orders[index].notes = action.payload.reason;
        }
      }
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder.status = 'Cancelled';
        if (action.payload.reason) {
          state.currentOrder.notes = action.payload.reason;
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStats: (state, action: PayloadAction<OrderStats>) => {
      state.stats = action.payload;
    },
    setFilters: (state, action: PayloadAction<{
      status?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    }>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetFilters: (state) => {
      state.filters = {};
    },
    resetOrderState: () => initialState,
  },
});

export const {
  setCurrentOrder,
  setOrders,
  addOrder,
  updateOrderStatus,
  cancelOrder,
  setLoading,
  setError,
  setStats,
  setFilters,
  resetFilters,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;