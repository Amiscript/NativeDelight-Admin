
import { Category, MenuItem } from '@/app/components/ManagementComp/types';
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});


// interface summary{
//   totalProducts: number;
//   activeItems: number;
//   inStockItems: number;
//   outOfStockItems: number;
// }

interface CategoriesResponse {
  categories: Category[];
  totalCategories: number;
  totalActiveCategories: number;
  mostOrderedCategory: {name: string; totalOrdered: number; _id: string};
  createdAt: Date;
  itemsCount: number
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


// Add more API functions as needed (e.g., for placing orders)
export const placeOrder = async (cartItems: any) => {
  try {
    const response = await api.post('/api/orders', { items: cartItems });
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const addcategory = async (data: FormData) => {
  console.log("submit data", data)
  try {
     const response = await api.post("/category/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data
  } catch (error) {
    throw error 
  }
}

export const updateCategory = async ({categoryId, data}: {categoryId: string, data: FormData}) => {
  try {
    const response = await api.patch(`/category/${categoryId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export const getcategoriesData = async (): Promise<CategoriesResponse> => {
    try{
        const response = await api.get('/category');
        return response.data;
    }catch(error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export const getOrderHistory = async () => {
  try {
    const response = await api.get('/order');
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.patch(`/order/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const updateProduct = async ({ id, data }: { id: string; data: FormData }) => {
  try {
    console.log("Updating product with ID:", id);
    console.log("FormData payload:", Object.fromEntries(data));
    const response = await api.patch(`/product/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Update product response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating product:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

export const createMenuItem = async (data: FormData) => {
  try {
    console.log("FormData payload  creatae :", Object.fromEntries(data));

    const response = await api.post("/product/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Create menu item response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = api.delete(`/product/${id}`)
    return response
  } catch (error) {
    throw error 
  }
}

export const fetchSubcategories = async () => {
  try {
    const response = await api.get("/subcategory")
    return response.data
  } catch (error) {
    throw error
  }
}

export default api;