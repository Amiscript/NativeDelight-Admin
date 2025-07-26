export interface SubCategory {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  stock: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
  description: string;
}