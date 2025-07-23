import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import api from '@/services/api';

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

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatar: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  users: User[];
  avatarUploading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  users: [],
  avatarUploading: false,
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
      state.user = {
        id: action.payload.user.id,
        email: action.payload.user.email,
        name: action.payload.user.name,
        role: action.payload.user.role,
        avatar: action.payload.user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(action.payload.user.name),
      };
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
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
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
    avatarUploadFailure(state) {
      state.avatarUploading = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  avatarUploadStart,
  avatarUploadSuccess,
  avatarUploadFailure,
} = authSlice.actions;

// Thunk actions
export const uploadAvatar = (userId: string, file: File): AppThunk => async (dispatch) => {
  try {
    dispatch(avatarUploadStart());
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    dispatch(avatarUploadSuccess({
      userId,
      avatarUrl: response.data.avatarUrl,
    }));
    
    return response.data.avatarUrl;
  } catch (error) {
    dispatch(avatarUploadFailure());
    throw error;
  }
};

export const fetchUsers = (): AppThunk => async (dispatch) => {
  try {
    const response = await api.get('/users');
    dispatch(setUsers(response.data));
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
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
    let avatarUrl = '';
    
    // First upload avatar if provided
    if (userData.avatarFile) {
      const formData = new FormData();
      formData.append('avatar', userData.avatarFile);
      
      const uploadResponse = await api.post('/uploads/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      avatarUrl = uploadResponse.data.url;
    }

    // Then create the user
    const response = await api.post('/users', {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status || 'active',
      password: userData.password || 'defaultPassword', // In production, generate a random one
      avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`,
    });

    dispatch(addUser(response.data));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add user');
  }
};

export const editUser = (
  id: string, 
  userData: Partial<{
    name: string;
    email: string;
    role: Role;
    status: Status;
    avatarFile: File;
  }>
): AppThunk => async (dispatch) => {
  try {
    let avatarUrl: string | undefined;
    
    // Handle avatar upload if file is provided
    if (userData.avatarFile) {
      const formData = new FormData();
      formData.append('avatar', userData.avatarFile);
      
      const uploadResponse = await api.post('/uploads/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      avatarUrl = uploadResponse.data.url;
    }

    // Update user data
    const updateData = {
      ...userData,
      ...(avatarUrl ? { avatar: avatarUrl } : {}),
    };
    delete updateData.avatarFile; // Remove the file from the payload
    
    const response = await api.put(`/users/${id}`, updateData);
    dispatch(updateUser(response.data));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

export const removeUser = (id: string): AppThunk => async (dispatch) => {
  try {
    await api.delete(`/users/${id}`);
    dispatch(deleteUser(id));
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

export const changeUserStatus = (
  id: string, 
  status: Status
): AppThunk => async (dispatch) => {
  try {
    await api.patch(`/users/${id}/status`, { status });
    dispatch(updateUserStatus({ id, status }));
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update user status');
  }
};

export const logoutUser = (): AppThunk => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(logout());
};

export default authSlice.reducer;