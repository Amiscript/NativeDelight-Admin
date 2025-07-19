import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import api from '@/services/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: { url: string };
  category: {
    name: string;
    subcategory?: string;
  };
  status: string;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action: PayloadAction<Product[]>) {
      state.loading = false;
      state.products = action.payload;
    },
    fetchProductSuccess(state, action: PayloadAction<Product>) {
      state.loading = false;
      state.product = action.payload;
    },
    productOperationFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createProductSuccess(state, action: PayloadAction<Product>) {
      state.loading = false;
      state.products.push(action.payload);
    },
    updateProductSuccess(state, action: PayloadAction<Product>) {
      state.loading = false;
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.product?._id === action.payload._id) {
        state.product = action.payload;
      }
    },
    deleteProductSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.products = state.products.filter(p => p._id !== action.payload);
      if (state.product?._id === action.payload) {
        state.product = null;
      }
    },
    clearProductError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductSuccess,
  productOperationFailure,
  createProductSuccess,
  updateProductSuccess,
  deleteProductSuccess,
  clearProductError,
} = productSlice.actions;

export const fetchProducts = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchProductsStart());
    const response = await api.get('/product');
    dispatch(fetchProductsSuccess(response.data.products));
  } catch (error: any) {
    dispatch(productOperationFailure(error.response?.data?.message || 'Failed to fetch products'));
  }
};

export const fetchProduct = (id: string): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchProductsStart());
    const response = await api.get(`/product/${id}`);
    dispatch(fetchProductSuccess(response.data.product));
  } catch (error: any) {
    dispatch(productOperationFailure(error.response?.data?.message || 'Failed to fetch product'));
  }
};

export const createProduct =
  (productData: FormData): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchProductsStart());
      const response = await api.post('/product/create', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(createProductSuccess(response.data.product));
      return response.data;
    } catch (error: any) {
      dispatch(productOperationFailure(error.response?.data?.message || 'Failed to create product'));
      throw error;
    }
  };

export const updateProduct =
  (id: string, productData: FormData): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchProductsStart());
      const response = await api.patch(`/product/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(updateProductSuccess(response.data.product));
      return response.data;
    } catch (error: any) {
      dispatch(productOperationFailure(error.response?.data?.message || 'Failed to update product'));
      throw error;
    }
  };

export const deleteProduct =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(fetchProductsStart());
      await api.delete(`/product/${id}`);
      dispatch(deleteProductSuccess(id));
    } catch (error: any) {
      dispatch(productOperationFailure(error.response?.data?.message || 'Failed to delete product'));
      throw error;
    }
  };

export default productSlice.reducer;