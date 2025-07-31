import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

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

interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  mostUsedCategory: Category | null;
  unusedCategories: number;
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Category', 'SubCategory'],
  endpoints: (builder) => ({
    // Get all categories with optional filters
    getCategories: builder.query<Category[], { 
      status?: string; 
      sort?: string;
      search?: string;
    }>({
      query: (params) => ({
        url: '/',
        params: {
          status: params.status,
          sort: params.sort,
          search: params.search
        }
      }),
      providesTags: ['Category'],
    }),

    // Get a single category by ID
    getCategory: builder.query<Category, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // Create a new category
    createCategory: builder.mutation<Category, FormData>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
    }),

    // Update a category
    updateCategory: builder.mutation<Category, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),

    // Delete a category
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // Toggle category status
    toggleCategoryStatus: builder.mutation<Category, number>({
      query: (id) => ({
        url: `/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // Get category statistics
    getCategoryStats: builder.query<CategoryStats, void>({
      query: () => '/stats',
    }),

    // Export categories
    exportCategories: builder.mutation<{ url: string }, { 
      status?: string; 
      sort?: string;
    }>({
      query: (params) => ({
        url: '/export',
        method: 'POST',
        body: params,
      }),
    }),

    // Subcategory endpoints
    addSubcategory: builder.mutation<SubCategory, { 
      categoryId: number; 
      name: string; 
      description?: string 
    }>({
      query: ({ categoryId, ...body }) => ({
        url: `/${categoryId}/subcategories`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubCategory'],
    }),

    updateSubcategory: builder.mutation<SubCategory, { 
      categoryId: number;
      subcategoryId: number;
      name: string;
      description?: string;
    }>({
      query: ({ categoryId, subcategoryId, ...body }) => ({
        url: `/${categoryId}/subcategories/${subcategoryId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['SubCategory'],
    }),

    deleteSubcategory: builder.mutation<void, { 
      categoryId: number;
      subcategoryId: number;
    }>({
      query: ({ categoryId, subcategoryId }) => ({
        url: `/${categoryId}/subcategories/${subcategoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubCategory'],
    }),

    reorderSubcategories: builder.mutation<void, { 
      categoryId: number;
      subcategoryIds: number[];
    }>({
      query: ({ categoryId, ...body }) => ({
        url: `/${categoryId}/subcategories/reorder`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubCategory'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useToggleCategoryStatusMutation,
  useGetCategoryStatsQuery,
  useExportCategoriesMutation,
  useAddSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useReorderSubcategoriesMutation,
} = categoryApi;