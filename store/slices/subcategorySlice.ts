import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import api from '@/services/api';

interface Subcategory {
  _id: string;
  name: string;
  status: string;
}

interface SubcategoryState {
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
}

const initialState: SubcategoryState = {
  subcategories: [],
  loading: false,
  error: null,
};

const subcategorySlice = createSlice({
  name: 'subcategories',
  initialState,
  reducers: {
    createSubcategoryStart(state) {
      state.loading = true;
      state.error = null;
    },
    createSubcategorySuccess(state, action: PayloadAction<Subcategory>) {
      state.loading = false;
      state.subcategories.push(action.payload);
    },
    subcategoryOperationFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSubcategoryError(state) {
      state.error = null;
    },
  },
});

export const {
  createSubcategoryStart,
  createSubcategorySuccess,
  subcategoryOperationFailure,
  clearSubcategoryError,
} = subcategorySlice.actions;

export const createSubcategory =
  (name: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(createSubcategoryStart());
      const response = await api.post('/subcategory/create', { name });
      dispatch(createSubcategorySuccess(response.data));
      return response.data;
    } catch (error: any) {
      dispatch(subcategoryOperationFailure(error.response?.data?.message || 'Failed to create subcategory'));
      throw error;
    }
  };

export default subcategorySlice.reducer;