// types.ts
export interface SubCategory {
  id: number;
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  itemsCount: number;
  status: string;
  createdAt: string;
  image: string;
  subcategories?: SubCategory[];
}

export type ModalMode = 'add' | 'edit';
export type ViewMode = 'grid' | 'list';