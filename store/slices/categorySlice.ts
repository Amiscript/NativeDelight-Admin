
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface SubCategory {
  id: number;
  name: string;
  description?: string;
  order: number;
}

interface  Category {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  image: string;
  itemsCount: number;
  createdAt: string;
  subcategories?: SubCategory[];
}



interface CategoryState {
  currentCategory: Category | null;
  subcategories: SubCategory[];
  loading: boolean;
  error: string | null;
  stats: {
    totalCategories: number;
    activeCategories: number;
    mostUsedCategory: Category | null;
    unusedCategories: number;
  } | null;
}

const initialState: CategoryState = {
  currentCategory: null,
  subcategories: [],
  loading: false,
  error: null,
  stats: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<Category | null>) => {
      state.currentCategory = action.payload;
    },
    setSubcategories: (state, action: PayloadAction<SubCategory[]>) => {
      state.subcategories = action.payload;
    },
    addSubcategory: (state, action: PayloadAction<SubCategory>) => {
      state.subcategories.push(action.payload);
    },
    updateSubcategory: (state, action: PayloadAction<SubCategory>) => {
      const index = state.subcategories.findIndex(
        (sub) => sub.id === action.payload.id
      );
      if (index !== -1) {
        state.subcategories[index] = action.payload;
      }
    },
    removeSubcategory: (state, action: PayloadAction<number>) => {
      state.subcategories = state.subcategories.filter(
        (sub) => sub.id !== action.payload
      );
    },
    reorderSubcategories: (state, action: PayloadAction<SubCategory[]>) => {
      state.subcategories = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStats: (
      state,
      action: PayloadAction<{
        totalCategories: number;
        activeCategories: number;
        mostUsedCategory: Category | null;
        unusedCategories: number;
      }>
    ) => {
      state.stats = action.payload;
    },
    resetCategoryState: () => initialState,
  },
});

export const {
  setCurrentCategory,
  setSubcategories,
  addSubcategory,
  updateSubcategory,
  removeSubcategory,
  reorderSubcategories,
  setLoading,
  setError,
  setStats,
  resetCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;