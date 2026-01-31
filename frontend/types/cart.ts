export interface Cart {
  id: string;
  customerId: string | null;
  regionId: string | null;
  salesChannelId: string | null;
  email: string | null;
  currencyCode: string;
  discountCode: string | null;
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  items: CartItem[];
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  variant: {
    id: string;
    title: string;
    sku: string | null;
    price: number;
    product: {
      id: string;
      title: string;
      slug: string;
      images: { url: string; altText: string | null }[];
    };
  };
}

export interface AddCartItemRequest {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ApplyDiscountRequest {
  code: string;
}
