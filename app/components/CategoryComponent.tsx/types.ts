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


// ```typescript
// export type ViewMode = 'grid' | 'list';

// export interface Category {
//   _id: string;
//   name: string;
//   description: string;
//   itemsCount: number;
//   status: 'active' | 'inactive';
//   createdAt: string;
//   image: { url: string; id?: string };
//   subcategories?: string[]; // Array of subcategory names as strings
// }

// export interface CategoriesStats {
//   totalCategories: number;
//   totalActiveCategories: number;
//   mostOrderedCategory: {
//     name: string;
//     totalOrdered: number;
//     _id: string;
//   };
// }

// export interface AddNewCategory extends Omit<Category, '_id' | 'createdAt' | 'itemsCount'> {
//   image: string; // Base64 or empty string for new categories
// }
// ```