
// import { Category, MenuItem } from '@/app/components/ManagementComp/types';
// import axios, { AxiosInstance } from 'axios';

// const api: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://native-admin-dashboard-backend.onrender.com',
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });


// interface CategoriesResponse {
//   categories: Category[];
//   totalCategories: number;
//   totalActiveCategories: number;
//   mostOrderedCategory: {name: string; totalOrdered: number; _id: string};
//   createdAt: Date;
//   itemsCount: number
// }


// export interface MenuItemsResponse {
//   products: MenuItem[];
//   summary: {
//     totalProducts: number;
//     totalActive: number;
//     totalInStock: number;
//     totalOutOfStock: number;
//   };
// }

// // Fetch all menu items 
// export const getMenuItems = async (): Promise<MenuItemsResponse> => {
//   try {
//     const response = await api.get('/product');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching menu items:', error);
//     throw error;
//   }
// };

// // Fetch all categories
// export const getCategories = async (): Promise<Category[]> => {
//   try {
//     const response = await api.get('/category');
//     return response.data?.categories || [];
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     throw error;
//   }
// };


// // Add more API functions as needed (e.g., for placing orders)
// export const placeOrder = async (cartItems: any) => {
//   try {
//     const response = await api.post('/api/orders', { items: cartItems });
//     return response.data;
//   } catch (error) {
//     console.error('Error placing order:', error);
//     throw error;
//   }
// };

// export const addcategory = async (data: FormData) => {
//   console.log("submit data", data)
//   try {
//      const response = await api.post("/category/create", data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data
//   } catch (error) {
//     throw error 
//   }
// }

// export const updateCategory = async ({categoryId, data}: {categoryId: string, data: FormData}) => {
//   try {
//     const response = await api.patch(`/category/${categoryId}`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating category:', error);
//     throw error;
//   }
// }

// export const getcategoriesData = async (): Promise<CategoriesResponse> => {
//     try{
//         const response = await api.get('/category');
//         return response.data;
//     }catch(error) {
//         console.error('Error fetching categories:', error);
//         throw error;
//     }
// }

// export const getOrderHistory = async () => {
//   try {
//     const response = await api.get('/order');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching order history:', error);
//     throw error;
//   }
// };

// export const updateOrderStatus = async (orderId: string, status: string) => {
//   try {
//     const response = await api.patch(`/order/${orderId}`, { status });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating order status:', error);
//     throw error;
//   }
// };

// export const updateProduct = async ({ id, data }: { id: string; data: FormData }) => {
//   try {
//     console.log("Updating product with ID:", id);
//     console.log("FormData payload:", Object.fromEntries(data));
//     const response = await api.patch(`/product/${id}`, data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log("Update product response:", response.data);
//     return response.data;
//   } catch (error: any) {
//     console.error("Error updating product:", {
//       message: error.message,
//       response: error.response?.data,
//       status: error.response?.status,
//       headers: error.response?.headers,
//     });
//     throw new Error(`Failed to update product: ${error.message}`);
//   }
// };

// export const createMenuItem = async (data: FormData) => {
//   try {
//     console.log("FormData payload  creatae :", Object.fromEntries(data));

//     const response = await api.post("/product/create", data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log("Create menu item response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating menu item:", error);
//     throw error;
//   }
// };

// export const deleteProduct = async (id: string) => {
//   try {
//     const response = api.delete(`/product/${id}`)
//     return response
//   } catch (error) {
//     throw error 
//   }
// }

// export const fetchSubcategories = async () => {
//   try {
//     const response = await api.get("/subcategory")
//     return response.data
//   } catch (error) {
//     throw error
//   }
// }

// export default api;


import { Category, MenuItem } from '@/app/components/ManagementComp/types';
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const getAuthToken = (): string | null => {
  // Adjust this based on where your token is stored (e.g., localStorage, sessionStorage, or cookies)
  return localStorage.getItem('token') || null;
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://native-admin-dashboard-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the Bearer token in every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();
    if (token) {
      // Ensure headers are initialized
      config.headers = config.headers || {};
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized request. Redirecting to login or refreshing token...');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Adjust based on your login route
    }
    return Promise.reject(error);
  }
);

interface CategoriesResponse {
  categories

: Category[];
  totalCategories: number;
  totalActiveCategories: number;
  mostOrderedCategory: { name: string; totalOrdered: number; _id: string };
  createdAt: Date;
  itemsCount: number;
}

export interface MenuItemsResponse {
  products: MenuItem[];
  summary: {
    totalProducts: number;
    totalActive: number;
    totalInStock: number;
    totalOutOfStock: number;
  };
}

// Fetch all menu items
export const getMenuItems = async (): Promise<MenuItemsResponse> => {
  try {
    const response = await api.get('/product');
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

// Fetch all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/category');
    return response.data?.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch categories data
export const getCategoriesData = async (): Promise<CategoriesResponse> => {
  try {
    const response = await api.get('/category');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories data:', error);
    throw error;
  }
};

// Place an order
export const placeOrder = async (cartItems: any) => {
  try {
    const response = await api.post('/api/orders', { items: cartItems });
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// Add a new category
export const addCategory = async (data: FormData) => {
  try {
    console.log('Submit data:', Object.fromEntries(data));
    const response = await api.post('/category/create', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Update a category
export const updateCategory = async ({ categoryId, data }: { categoryId: string; data: FormData }) => {
  try {
    const response = await api.patch(`/category/${categoryId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Fetch order history
export const getOrderHistory = async () => {
  try {
    const response = await api.get('/order');
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.patch(`/order/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async ({ id, data }: { id: string; data: FormData }) => {
  try {
    console.log('Updating product with ID:', id);
    console.log('FormData payload:', Object.fromEntries(data));
    const response = await api.patch(`/product/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update product response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating product:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

// Create a new menu item
export const createMenuItem = async (data: FormData) => {
  try {
    console.log('FormData payload create:', Object.fromEntries(data));
    const response = await api.post('/product/create', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Create menu item response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/product/${id}`);
    console.log("delete product item", response)
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Fetch subcategories
export const fetchSubcategories = async () => {
  try {
    const response = await api.get('/subcategory');
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

export default api;