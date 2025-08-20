
export interface Category{
  _id: string;
  name: string;
  subcategory: string
  price: number;
  image: {url: string};
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  itemsCount: number
}

// types.ts

export interface SubCategory {
  id: string; // Use string to match backend's _id
  name: string;
}
export interface NewMenuItem {
  id:  string;
  name: string;
  category: string; // Store category name (e.g., "Pizzas pot") or _id if your backend expects it
  subCategory: string; // Store subcategory name (e.g., "Foods")
  price: number;
  status: "active" | "inactive";
  stock: "In Stock" | "Low Stock" | "Out of Stock"; // Adjust based on frontend needs
  image: string;
  description: string; 
}

export interface MenuItem {
  id?: string; 
  name: string;
  category: string; // Store category name (e.g., "Pizzas pot") or _id if your backend expects it
  subCategory: string; // Store subcategory name (e.g., "Foods")
  subCategoryName: string;
  price: number;
  status: "active" | "inactive";
  stock: "In Stock" | "Low Stock" | "Out of Stock"; // Adjust based on frontend needs
  image: string;
  description: string;
  categoryName: string
}

export interface DeletMenuItem{
  id: string
}


export interface ProductSummary{
  summary: {
    totalItems: 0,
    activeItems: 0,
    outOfStockItems: 0,
    inStockItems: 0,
  },
};
