export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'NOT_PAID'
  | 'AWAITING'
  | 'CAPTURED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

export type FulfillmentStatus =
  | 'NOT_FULFILLED'
  | 'PARTIALLY_FULFILLED'
  | 'FULFILLED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'RETURNED';

export interface Order {
  id: string;
  displayId: number;
  customerId: string;
  currencyCode: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  email: string;
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  shippingAddress: ShippingAddress | null;
  billingAddress: ShippingAddress | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  title: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  variant?: {
    product?: {
      title: string;
      slug: string;
      images: { url: string; altText: string | null }[];
    };
  };
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: string;
  phone?: string;
}

export interface CheckoutRequest {
  cartId: string;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  shippingMethodId?: string;
  email?: string;
}
