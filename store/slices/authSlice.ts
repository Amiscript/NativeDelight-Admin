import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import api from '@/services/api';

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: any; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

export const login =
  (email: string, password: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      const user = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role,
      };
      localStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    }
  };

export const createUser =
  (userData: { name: string; email: string; password: string; role: string }): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/auth/create', userData);
      const { token } = response.data;
      const user = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role,
      };
      localStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'User creation failed'));
    }
  };

export const addNewUser =
  (userData: { name: string; email: string; role: string }): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/auth/add-user', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add user');
    }
  };

export const logoutUser = (): AppThunk => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(logout());
};

export default authSlice.reducer;