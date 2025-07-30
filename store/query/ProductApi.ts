import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

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

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['MenuItem', 'Category', 'SubCategory'],
  endpoints: (builder) => ({
    // Menu Items
    getMenuItems: builder.query<MenuItem[], void>({
      query: () => '/items',
      providesTags: ['MenuItem'],
    }),
    getMenuItem: builder.query<MenuItem, number>({
      query: (id) => `/items/${id}`,
      providesTags: (result, error, id) => [{ type: 'MenuItem', id }],
    }),
    addMenuItem: builder.mutation<MenuItem, Partial<MenuItem>>({
      query: (body) => ({
        url: '/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MenuItem'],
    }),
    updateMenuItem: builder.mutation<MenuItem, Partial<MenuItem> & Pick<MenuItem, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/items/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MenuItem', id }],
    }),
    deleteMenuItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuItem'],
    }),
    toggleMenuItemStock: builder.mutation<MenuItem, number>({
      query: (id) => ({
        url: `/items/${id}/toggle-stock`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'MenuItem', id }],
    }),

    // Categories
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation<Category, { name: string }>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // Subcategories
    getSubcategories: builder.query<SubCategory[], string>({
      query: (category) => `/subcategories?category=${category}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'SubCategory' as const, id })),
              'SubCategory',
            ]
          : ['SubCategory'],
    }),
    addSubcategory: builder.mutation<SubCategory, { name: string; category: string }>({
      query: (body) => ({
        url: '/subcategories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubCategory'],
    }),
    updateSubcategoryOrder: builder.mutation<
      SubCategory[],
      { id: number; direction: 'up' | 'down' }
    >({
      query: ({ id, direction }) => ({
        url: `/subcategories/${id}/order`,
        method: 'PATCH',
        body: { direction },
      }),
      invalidatesTags: ['SubCategory'],
    }),
    deleteSubcategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubCategory'],
    }),

    // Stats
    getMenuStats: builder.query<{
      totalItems: number;
      activeItems: number;
      outOfStockItems: number;
      lowStockItems: number;
    }, void>({
      query: () => '/stats',
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useGetMenuItemQuery,
  useAddMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useToggleMenuItemStockMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubcategoriesQuery,
  useAddSubcategoryMutation,
  useUpdateSubcategoryOrderMutation,
  useDeleteSubcategoryMutation,
  useGetMenuStatsQuery,
} = productApi;