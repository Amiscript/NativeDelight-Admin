// types.ts
export interface SubCategory {
  _id: string;
  name?: string;
  description?: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  itemsCount: number;
  status: string;
  createdAt: string;
  image: {url: string};
  subcategories?: any[];  
  itemCount?: number;
}

export interface AddNewCategory {
  name: string;
  description: string;
  itemsCount: number;
  status: string;
  createdAt: string;
  image: string | URL;
  subcategories?: any[];  
}

export interface CategoryData {
  _id: string;
  name: string;
  description: string;
  itemsCount: number;
  status: string;
  image: any
  subcategories: SubCategory[];  
  createdAt: string

}

export interface CategoriesResponse {
  categories: Category[];
  totalCategories: number;
  totalActiveCategories: number;
  mostOrderedCategory: string | null;
}

export interface CategoriesStats {
  totalCategories: number;
  totalActiveCategories: number;
  mostOrderedCategory: MostOrderedCategory | null;
}

interface MostOrderedCategory {
  name: string;
  totalOrdered: number;
  _id: string;
}

export type ModalMode = 'add' | 'edit';
export type ViewMode = 'grid' | 'list';