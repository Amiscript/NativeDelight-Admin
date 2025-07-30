// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../store/slices/authSlice';
import productReducer from '../store/slices/productSlice';
import categoryReducer from '../store/slices/categorySlice';
import orderReducer from '../store/slices/orderSlice';
import { authApi } from '../store/query/AuthApi';
// import { productApi } from '../store/query/productApi';
import { orderApi } from '../store/query/OrderApi';
import { categoryApi } from '../store/query/CategoryApi';

// Helper function to safely get initial state
const getInitialAuthState = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    };
  }

  return {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
  };
};

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      products: productReducer,
      categories: categoryReducer,
      orders: orderReducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
    
      [authApi.reducerPath]: authApi.reducer,
    },
    preloadedState: {
      auth: getInitialAuthState(),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(authApi.middleware,  orderApi.middleware, categoryApi.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];