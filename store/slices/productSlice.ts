
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  stock: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

interface SubCategory {
  id: number;
  name: string;
  category: string;
  order: number;
}

interface Category {
  id: number;
  name: string;
}
interface ProductState {
  menuItems: MenuItem[];
  currentMenuItem: MenuItem | null;
  categories: Category[];
  subcategories: SubCategory[];
  currentCategory: string | null;
  stats: {
    totalItems: number;
    activeItems: number;
    outOfStockItems: number;
    lowStockItems: number;
  } | null;
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    subCategory?: string;
    stock?: string;
    search?: string;
  };
}
const initialState: ProductState = {
  menuItems: [],
  currentMenuItem: null,
  categories: [],
  subcategories: [],
  currentCategory: null,
  stats: null,
  loading: false,
  error: null,
  filters: {},
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Menu Items
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuItems = action.payload;
    },
    setCurrentMenuItem: (state, action: PayloadAction<MenuItem | null>) => {
      state.currentMenuItem = action.payload;
    },
    addMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.menuItems.unshift(action.payload);
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.menuItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.menuItems[index] = action.payload;
      }
      if (state.currentMenuItem?.id === action.payload.id) {
        state.currentMenuItem = action.payload;
      }
    },
    deleteMenuItem: (state, action: PayloadAction<number>) => {
      state.menuItems = state.menuItems.filter(item => item.id !== action.payload);
      if (state.currentMenuItem?.id === action.payload) {
        state.currentMenuItem = null;
      }
    },
    toggleMenuItemStock: (state, action: PayloadAction<number>) => {
      const item = state.menuItems.find(item => item.id === action.payload);
      if (item) {
        item.stock = item.stock === 'In Stock' ? 'Out of Stock' : 'In Stock';
      }
      if (state.currentMenuItem?.id === action.payload) {
        state.currentMenuItem.stock = state.currentMenuItem.stock === 'In Stock' 
          ? 'Out of Stock' 
          : 'In Stock';
      }
    },

    // Categories
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    deleteCategory: (state, action: PayloadAction<number>) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    },

    // Subcategories
    setSubcategories: (state, action: PayloadAction<SubCategory[]>) => {
      state.subcategories = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<string | null>) => {
      state.currentCategory = action.payload;
    },
    addSubcategory: (state, action: PayloadAction<SubCategory>) => {
      state.subcategories.push(action.payload);
    },
    updateSubcategoryOrder: (state, action: PayloadAction<{id: number; direction: 'up' | 'down'}>) => {
      const { id, direction } = action.payload;
      const index = state.subcategories.findIndex(sub => sub.id === id);
      if (index === -1) return;
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= state.subcategories.length) return;
      // Swap the order values
      const tempOrder = state.subcategories[index].order;
      state.subcategories[index].order = state.subcategories[swapWith].order;
      state.subcategories[swapWith].order = tempOrder;
      // Swap the array positions
      [state.subcategories[index], state.subcategories[swapWith]] = [state.subcategories[swapWith], state.subcategories[index]];
    },
    deleteSubcategory: (state, action: PayloadAction<number>) => {
      state.subcategories = state.subcategories.filter(sub => sub.id !== action.payload);
    },

    // Stats
    setStats: (state, action: PayloadAction<{
      totalItems: number;
      activeItems: number;
      outOfStockItems: number;
      lowStockItems: number;
    }>) => {
      state.stats = action.payload;
    },

    // Filters
    setFilters: (state, action: PayloadAction<{
      category?: string;
      subCategory?: string;
      stock?: string;
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

    // Utility
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetProductState: () => initialState,
  },
});

export const {
  setMenuItems,
  setCurrentMenuItem,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemStock,
  setCategories,
  addCategory,
  deleteCategory,
  setSubcategories,
  setCurrentCategory,
  addSubcategory,
  updateSubcategoryOrder,
  deleteSubcategory,
  setStats,
  setFilters,
  resetFilters,
  setLoading,
  setError,
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer;