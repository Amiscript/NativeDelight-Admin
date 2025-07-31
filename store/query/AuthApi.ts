// store/api/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  avatar?: string;
  lastLogin?: string;
 
}
interface UsersResponse {
  data: User[];
  users: User[];
  count: number;
}


interface LoginResponse {
  token: string;
  user: User;
}

interface AddUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  avatarFile?: File;
  password: string;
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
    getUsers: builder.query<UsersResponse, void>({
      query: ( ) => '/users',
      providesTags: ['User'],
    }),
    addUser: builder.mutation<User, AddUserRequest>({
      query: (userData) => {
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('role', userData.role);
        formData.append('status', userData.status);
        formData.append('password', userData.password);
        
        if (userData.avatarFile) {
          formData.append('avatar', userData.avatarFile);
        }

        return {
          url: '/add-user',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<AddUserRequest> }>({
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
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
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
} = authApi;