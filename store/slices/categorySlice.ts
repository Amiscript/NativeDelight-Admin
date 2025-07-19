import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import api from '@/services/api';

interface Subcategory {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  status: string;
  image: { url: string };
  subcategories: Subcategory[];
  subcategoryCount: number;
}

interface CategoryState {
  categories: Category[];
  category: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.loading = false;
      state.categories = action.payload;
    },
    fetchCategorySuccess(state, action: PayloadAction<Category>) {
      state.loading = false;
      state.category = action.payload;
    },
    categoryOperationFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createCategorySuccess(state, action: PayloadAction<Category>) {
      state.loading = false;
      state.categories.push(action.payload);
    },
    updateCategorySuccess(state, action: PayloadAction<Category>) {
      state.loading = false;
      const index = state.categories.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      if (state.category?._id === action.payload._id) {
        state.category = action.payload;
      }
    },
    deleteCategorySuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.categories = state.categories.filter(c => c._id !== action.payload);
      if (state.category?._id === action.payload) {
        state.category = null;
      }
    },
    clearCategoryError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategorySuccess,
  categoryOperationFailure,
  createCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
  clearCategoryError,
} = categorySlice.actions;

export const fetchCategories = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchCategoriesStart());
    const response = await api.get('/category');
    dispatch(fetchCategoriesSuccess(response.data));
  } catch (error: any) {
    dispatch(categoryOperationFailure(error.response?.data?.message || 'Failed to fetch categories'));
  }
};

export const fetchCategory = (id: string): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchCategoriesStart());
    const response = await api.get(`/category/${id}`);
    dispatch(fetchCategorySuccess(response.data[0]));
  } catch (error: any) {
    dispatch(categoryOperationFailure(error.response?.data?.message || 'Failed to fetch category'));
  }
};

export const createCategory =
  (categoryData: FormData): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchCategoriesStart());
      const response = await api.post('/category/create', categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(createCategorySuccess(response.data));
      return response.data;
    } catch (error: any) {
      dispatch(categoryOperationFailure(error.response?.data?.message || 'Failed to create category'));
      throw error;
    }
  };

export const updateCategory =
  (id: string, categoryData: FormData): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchCategoriesStart());
      const response = await api.patch(`/category/${id}`, categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(updateCategorySuccess(response.data.data));
      return response.data;
    } catch (error: any) {
      dispatch(categoryOperationFailure(error.response?.data?.message || 'Failed to update category'));
      throw error;
    }
  };

export const deleteCategory =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchCategoriesStart());
      await api.delete(`/category/${id}`);
      dispatch(deleteCategorySuccess(id));
    } catch (error: any) {
      dispatch(categoryOperationFailure(error.response?.data?.message || 'Failed to delete category'));
      throw error;
    }
  };

export default categorySlice.reducer;