
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface DashboardState {
  overview: OverviewStats | null;
  sales: SalesData[];
  categories: CategoryData[];
  hourly: HourlyData[];
  popularItems: PopularItem[];
  alerts: InventoryAlert[];
  loading: boolean;
  error: string | null;
  filters: {
    period: 'week' | 'month' | 'quarter';
    categoryType: 'revenue' | 'orders';
  };
}

const initialState: DashboardState = {
  overview: null,
  sales: [],
  categories: [],
  hourly: [],
  popularItems: [],
  alerts: [],
  loading: false,
  error: null,
  filters: {
    period: 'week',
    categoryType: 'revenue',
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData: (state, action: PayloadAction<{
      overview: OverviewStats;
      sales: SalesData[];
      categories: CategoryData[];
      hourly: HourlyData[];
      popularItems: PopularItem[];
      alerts: InventoryAlert[];
    }>) => {
      state.overview = action.payload.overview;
      state.sales = action.payload.sales;
      state.categories = action.payload.categories;
      state.hourly = action.payload.hourly;
      state.popularItems = action.payload.popularItems;
      state.alerts = action.payload.alerts;
    },
    setPeriodFilter: (state, action: PayloadAction<'week' | 'month' | 'quarter'>) => {
      state.filters.period = action.payload;
    },
    setCategoryTypeFilter: (state, action: PayloadAction<'revenue' | 'orders'>) => {
      state.filters.categoryType = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetDashboardState: () => initialState,
  },
});

export const {
  setDashboardData,
  setPeriodFilter,
  setCategoryTypeFilter,
  setLoading,
  setError,
  resetDashboardState,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;