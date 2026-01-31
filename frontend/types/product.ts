export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  handle: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isGiftCard: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
  images: ProductImage[];
  categories: Category[];
  tags: Tag[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  weight: number | null;
  weightUnit: string;
  manageInventory: boolean;
  position: number;
  metadata: Record<string, unknown> | null;
  optionValues: OptionValue[];
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  position: number;
  isActive: boolean;
}

export interface Tag {
  id: string;
  name: string;
}

export interface OptionValue {
  id: string;
  value: string;
  option: {
    id: string;
    name: string;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  tag?: string;
  status?: string;
}
