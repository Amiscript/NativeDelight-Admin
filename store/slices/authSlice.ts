import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import api from '@/services/api';

// Define more specific types
type Role = 'admin' | 'manager' | 'staff';
type Status = 'active' | 'inactive';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastLogin: string;
  avatar: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
}

interface AuthError {
  message: string;
  details?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
    [key: string]: string | undefined;
  };
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: AuthError | null;
  users: User[];
  avatarUploading: boolean;
  usersLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  users: [],
  avatarUploading: false,
  usersLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<AuthError>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.users = [];
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.usersLoading = false;
    },
    setUsersLoading(state, action: PayloadAction<boolean>) {
      state.usersLoading = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    updateUser(state, action: PayloadAction<User>) {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    updateUserStatus(state, action: PayloadAction<{id: string; status: Status}>) {
      const user = state.users.find(user => user.id === action.payload.id);
      if (user) {
        user.status = action.payload.status;
      }
    },
    avatarUploadStart(state) {
      state.avatarUploading = true;
    },
    avatarUploadSuccess(state, action: PayloadAction<{userId: string; avatarUrl: string}>) {
      state.avatarUploading = false;
      const user = state.users.find(user => user.id === action.payload.userId);
      if (user) {
        user.avatar = action.payload.avatarUrl;
      }
      if (state.user && state.user.id === action.payload.userId) {
        state.user.avatar = action.payload.avatarUrl;
      }
    },
    avatarUploadFailure(state, action: PayloadAction<AuthError>) {
      state.avatarUploading = false;
      state.error = action.payload;
    },
    changePasswordSuccess(state) {
      state.loading = false;
    },
    changePasswordFailure(state, action: PayloadAction<AuthError>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Action creators
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setUsers,
  setUsersLoading,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  avatarUploadStart,
  avatarUploadSuccess,
  avatarUploadFailure,
  changePasswordSuccess,
  changePasswordFailure,
} = authSlice.actions;

// Helper function to handle API errors
const handleApiError = (error: any): AuthError => {
  const defaultError = {
    message: 'Authentication failed',
    details: 'Please try again later',
    code: 'UNKNOWN_ERROR'
  };
  if (error.response) {
    return {
      ...defaultError,
      ...error.response.data,
      code: error.response.data.error?.code || 'API_ERROR',
      message: error.response.data.message || 'Request failed',
      details: error.response.data.error?.details,
      fieldErrors: error.response.data.errors
    };
  } else if (error.request) {
    return {
      ...defaultError,
      message: 'Network error',
      details: 'Could not connect to server',
    };
  } else {
    return {
      ...defaultError,
      message: 'Request error',
      details: error.message
    };
  }
};

// Thunk actions
export const loginUser = (
  credentials: { email: string; password: string }
): AppThunk => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    const response = await api.post('/auth/login', credentials);
    
    localStorage.setItem('token', response.data.token);
    
    dispatch(loginSuccess({
      user: response.data.user,
      token: response.data.token
    }));
    
    return response.data;
  } catch (error: any) {
    const errorPayload = handleApiError(error);
    dispatch(loginFailure(errorPayload));
    throw errorPayload;
  }
};

export const createUser = (
  userData: { 
    name: string; 
    email: string; 
    role: Role; 
    password: string;
  }
): AppThunk => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await api.post('/auth/create', userData);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const fetchUsers = (page = 1, limit = 10): AppThunk => async (dispatch) => {
  try {
    dispatch(setUsersLoading(true));
    const response = await api.get('/auth/users', {
      params: { page, limit }
    });
    dispatch(setUsers(response.data.users));
    return response.data;
  } catch (error: any) {
    dispatch(setUsersLoading(false));
    throw handleApiError(error);
  }
};

export const addNewUser = (
  userData: { 
    name: string; 
    email: string; 
    role: Role; 
    password?: string;
    status?: Status;
    avatarFile?: File;
  }
): AppThunk => async (dispatch) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await api.post('/auth/add-user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch(addUser(response.data));
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const removeUser = (id: string): AppThunk => async (dispatch) => {
  try {
    await api.delete(`/auth/users/${id}`);
    dispatch(deleteUser(id));
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const changeUserPassword = (
  currentPassword: string,
  newPassword: string
): AppThunk => async (dispatch) => {
  try {
    dispatch(loginStart());
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    dispatch(changePasswordSuccess());
  } catch (error: any) {
    const errorPayload = handleApiError(error);
    dispatch(changePasswordFailure(errorPayload));
    throw errorPayload;
  }
};

export const logoutUser = (): AppThunk => async (dispatch) => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    localStorage.removeItem('token');
    dispatch(logout());
  }
};

export default authSlice.reducer;