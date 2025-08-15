// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../store/slices/authSlice';
import productReducer from '../store/slices/productSlice';
import categoryReducer from '../store/slices/categorySlice';
import orderReducer from '../store/slices/orderSlice';
import dashboardReducer from '../store/slices/dashboardSlice';
import { authApi } from '../store/query/AuthApi';
import { dashboardApi } from '../store/query/DashboardApi';
import { productApi } from '../store/query/ProductApi';
import { orderApi } from '../store/query/OrderApi';
import { categoryApi } from '../store/query/CategoryApi';

   
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
      dashboard: dashboardReducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
    
      [authApi.reducerPath]: authApi.reducer,
    },
    preloadedState: {
      auth: getInitialAuthState(),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(authApi.middleware,  orderApi.middleware, categoryApi.middleware, dashboardApi.middleware, productApi.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];