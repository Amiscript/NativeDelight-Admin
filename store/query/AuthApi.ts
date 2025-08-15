// store/api/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

interface User {
  id: string;
  name: string;
  email: string;
  role:  'manager' | 'staff';
  status: 'active' | 'inactive';
  avatar?: string;
  lastLogin?: string;
 
}

 export interface ApiError {
  status: number;
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
}




interface UserResponse {
  user: User;
  message: string;
}



interface UsersResponse {
  data: User[];
  
  users: User[];
  count: number;
   pagination: {
    currentPage: number;
    totalPages: number;
    totalNonAdminUsers: number;
    limit: number;
  };
  stats: {
    totalUsers: number;
    totalAdmins: number;
    totalActiveUsers: number;
    totalInactiveUsers: number;
  };
}

interface ChangePasswordRequest {
  password: string;
}


interface LoginResponse {
  token: string;
  user: User;
  message: string;

}

interface AddUserRequest {
  name: string;
  email: string;
  role:  'admin'|'manager' | 'staff';
  status: 'active' | 'inactive';
  avatarFile?: File;
  // password: string;
}

export const authApi = createApi({ 
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
      getUsers: builder.query<UsersResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/users',
        params: { page, limit },
      }),
      providesTags: ['User'],
    }),
    
    addUser: builder.mutation<UserResponse, FormData>({
      query: (formData) => ({
          url: '/add-user',
          method: 'POST',
          body: formData,
        
      }),
     transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<UserResponse, { id: string; data: Partial<AddUserRequest> }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value instanceof File ? value : String(value));
          }
        });

        return {
          url: `/users/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ['User'],
    }),

     changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (data) => ({
        url: '/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
logout: builder.mutation<void, void>({
  query: () => ({
    url: '/logout',
    method: 'POST',
  }),
  // This will invalidate all cached data
  invalidatesTags: ['User'],
}),


  }),
});

export const {
  useLoginMutation,
  useGetUsersQuery,
   useLogoutMutation,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
} = authApi;