export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  options: Record<string, string>;
  images: ProductImage[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  thumbnail?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  categories: Category[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "newest" | "title_asc" | "title_desc";
  page?: number;
  limit?: number;
}
