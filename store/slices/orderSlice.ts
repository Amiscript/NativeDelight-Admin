import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import api from '@/services/api';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  email: string;
  items: OrderItem[];
  address: string;
  phone: string;
  paymentType: string;
  status: string;
  reference: string;
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  paymentData: any | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  paymentData: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrderStart(state) {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess(state, action: PayloadAction<{ order: Order; paymentData: any }>) {
      state.loading = false;
      state.orders.push(action.payload.order);
      state.paymentData = action.payload.paymentData;
    },
    orderOperationFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrderError(state) {
      state.error = null;
    },
    clearPaymentData(state) {
      state.paymentData = null;
    },
  },
});

export const {
  createOrderStart,
  createOrderSuccess,
  orderOperationFailure,
  clearOrderError,
  clearPaymentData,
} = orderSlice.actions;

export const createOrder =
  (orderData: {
    items: Array<{ productId: string; quantity: number }>;
    amount: number;
    address: string;
    email: string;
    phone: string;
    metadata?: any;
  }): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(createOrderStart());
      const response = await api.post('/order/checkout', orderData);
      dispatch(
        createOrderSuccess({
          order: response.data.order,
          paymentData: response.data.data,
        })
      );
      return response.data;
    } catch (error: any) {
      dispatch(orderOperationFailure(error.response?.data?.message || 'Failed to create order'));
      throw error;
    }
  };

export default orderSlice.reducer;