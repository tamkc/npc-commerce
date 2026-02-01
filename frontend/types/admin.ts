/* ── Admin-specific types aligned with backend Prisma models ── */

// ── Enums ──

export type UserRole = "ADMIN" | "CUSTOMER";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
export type PaymentStatus =
  | "NOT_PAID"
  | "AWAITING"
  | "CAPTURED"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";
export type FulfillmentStatus =
  | "NOT_FULFILLED"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "SHIPPED"
  | "DELIVERED"
  | "RETURNED";
export type PaymentRecordStatus =
  | "PENDING"
  | "REQUIRES_ACTION"
  | "CAPTURED"
  | "CANCELED"
  | "FAILED";
export type PriceListType = "SALE" | "OVERRIDE";
export type PriceListStatus = "ACTIVE" | "DRAFT";
export type PromotionType =
  | "PERCENTAGE"
  | "FIXED"
  | "FREE_SHIPPING"
  | "BUY_X_GET_Y";
export type PromotionConditionType =
  | "MIN_ORDER_AMOUNT"
  | "SPECIFIC_PRODUCTS"
  | "SPECIFIC_CATEGORIES"
  | "CUSTOMER_GROUP"
  | "MIN_QUANTITY";
export type SalesChannelType = "WEB" | "MOBILE" | "POS";
export type ApiKeyType = "STORE" | "ADMIN";

// ── Users ──

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

// ── Products ──

export interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  handle: string | null;
  status: ProductStatus;
  isGiftCard: boolean;
  metadata: Record<string, unknown> | null;
  variants: AdminProductVariant[];
  images: AdminProductImage[];
  categories: AdminCategory[];
  tags: AdminTag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  title: string;
  slug: string;
  description?: string;
  handle?: string;
  status?: ProductStatus;
  isGiftCard?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

// ── Product Variants ──

export interface AdminProductVariant {
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
  position: number;
  manageInventory: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVariantPayload {
  title: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  weight?: number;
  weightUnit?: string;
  manageInventory?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateVariantPayload extends Partial<CreateVariantPayload> {}

// ── Product Images ──

export interface AdminProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  position: number;
  createdAt: string;
}

// ── Categories ──

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  position: number;
  isActive: boolean;
  children?: AdminCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  position?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

// ── Tags ──

export interface AdminTag {
  id: string;
  name: string;
}

// ── Orders ──

export interface AdminOrder {
  id: string;
  displayId: number;
  customerId: string;
  customer?: AdminCustomer;
  salesChannelId: string | null;
  regionId: string | null;
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
  shippingAddress: Record<string, unknown>;
  billingAddress: Record<string, unknown>;
  metadata: Record<string, unknown> | null;
  items: AdminOrderItem[];
  payments: AdminPayment[];
  fulfillments: AdminFulfillment[];
  notes: AdminOrderNote[];
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderItem {
  id: string;
  orderId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AdminOrderNote {
  id: string;
  orderId: string;
  authorId: string | null;
  content: string;
  isPrivate: boolean;
  createdAt: string;
}

// ── Customers ──

export interface AdminCustomer {
  id: string;
  userId: string;
  user?: AdminUser;
  phone: string | null;
  customerGroupId: string | null;
  customerGroup?: AdminCustomerGroup | null;
  metadata: Record<string, unknown> | null;
  addresses: AdminAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCustomerPayload {
  phone?: string;
  customerGroupId?: string | null;
  metadata?: Record<string, unknown>;
}

// ── Customer Groups ──

export interface AdminCustomerGroup {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerGroupPayload {
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCustomerGroupPayload
  extends Partial<CreateCustomerGroupPayload> {}

// ── Addresses ──

export interface AdminAddress {
  id: string;
  customerId: string;
  label: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Payments ──

export interface AdminPayment {
  id: string;
  orderId: string;
  provider: string;
  externalId: string | null;
  amount: number;
  currencyCode: string;
  status: PaymentRecordStatus;
  capturedAt: string | null;
  canceledAt: string | null;
  metadata: Record<string, unknown> | null;
  refunds: AdminRefund[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminRefund {
  id: string;
  paymentId: string;
  externalId: string | null;
  amount: number;
  reason: string | null;
  createdAt: string;
}

// ── Fulfillments ──

export interface AdminFulfillment {
  id: string;
  orderId: string;
  stockLocationId: string;
  shippingMethodId: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  items: AdminFulfillmentItem[];
  shippedAt: string | null;
  deliveredAt: string | null;
  canceledAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFulfillmentItem {
  id: string;
  fulfillmentId: string;
  orderItemId: string;
  quantity: number;
}

export interface CreateFulfillmentPayload {
  orderId: string;
  stockLocationId: string;
  shippingMethodId?: string;
  items: { orderItemId: string; quantity: number }[];
}

// ── Shipping Methods ──

export interface AdminShippingMethod {
  id: string;
  regionId: string;
  name: string;
  price: number;
  minOrderAmount: number | null;
  maxOrderAmount: number | null;
  isActive: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingMethodPayload {
  regionId: string;
  name: string;
  price: number;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  isActive?: boolean;
}

export interface UpdateShippingMethodPayload
  extends Partial<CreateShippingMethodPayload> {}

// ── Inventory ──

export interface AdminInventoryLevel {
  id: string;
  variantId: string;
  stockLocationId: string;
  variant?: AdminProductVariant;
  stockLocation?: AdminStockLocation;
  onHand: number;
  reserved: number;
  available: number;
  lowStockThreshold: number | null;
  updatedAt: string;
}

export interface CreateInventoryPayload {
  variantId: string;
  stockLocationId: string;
  onHand: number;
  reserved?: number;
  lowStockThreshold?: number;
}

export interface UpdateInventoryPayload {
  onHand?: number;
  reserved?: number;
  lowStockThreshold?: number;
}

// ── Stock Locations ──

export interface AdminStockLocation {
  id: string;
  name: string;
  code: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  countryCode: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockLocationPayload {
  name: string;
  code: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  isActive?: boolean;
}

export interface UpdateStockLocationPayload
  extends Partial<CreateStockLocationPayload> {}

// ── Promotions ──

export interface AdminPromotion {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  type: PromotionType;
  value: number;
  currencyCode: string | null;
  usageLimit: number;
  usageCount: number;
  perCustomerLimit: number | null;
  minOrderAmount: number | null;
  isAutomatic: boolean;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  conditions: AdminPromotionCondition[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminPromotionCondition {
  id: string;
  promotionId: string;
  type: PromotionConditionType;
  operator: string;
  value: unknown;
  createdAt: string;
}

export interface CreatePromotionPayload {
  name: string;
  code?: string;
  description?: string;
  type: PromotionType;
  value: number;
  currencyCode?: string;
  usageLimit?: number;
  perCustomerLimit?: number;
  minOrderAmount?: number;
  isAutomatic?: boolean;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
}

export interface UpdatePromotionPayload
  extends Partial<CreatePromotionPayload> {}

// ── Price Lists ──

export interface AdminPriceList {
  id: string;
  name: string;
  description: string | null;
  type: PriceListType;
  status: PriceListStatus;
  startsAt: string | null;
  endsAt: string | null;
  prices: AdminPriceListPrice[];
  customerGroups: AdminCustomerGroup[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminPriceListPrice {
  id: string;
  priceListId: string;
  variantId: string;
  currencyCode: string;
  amount: number;
  minQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceListPayload {
  name: string;
  description?: string;
  type?: PriceListType;
  status?: PriceListStatus;
  startsAt?: string;
  endsAt?: string;
}

export interface UpdatePriceListPayload
  extends Partial<CreatePriceListPayload> {}

// ── Regions ──

export interface AdminRegion {
  id: string;
  name: string;
  currencyCode: string;
  taxInclusivePricing: boolean;
  metadata: Record<string, unknown> | null;
  countries: AdminRegionCountry[];
  taxRates: AdminTaxRate[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminRegionCountry {
  regionId: string;
  countryCode: string;
}

export interface CreateRegionPayload {
  name: string;
  currencyCode: string;
  taxInclusivePricing?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateRegionPayload extends Partial<CreateRegionPayload> {}

// ── Currencies ──

export interface AdminCurrency {
  code: string;
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurrencyPayload {
  code: string;
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits?: number;
}

export interface UpdateCurrencyPayload extends Partial<CreateCurrencyPayload> {}

// ── Exchange Rates ──

export interface AdminExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  updatedAt: string;
}

// ── Tax Rates ──

export interface AdminTaxRate {
  id: string;
  regionId: string;
  name: string;
  code: string | null;
  rate: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaxRatePayload {
  regionId: string;
  name: string;
  code?: string;
  rate: number;
  isDefault?: boolean;
}

export interface UpdateTaxRatePayload extends Partial<CreateTaxRatePayload> {}

// ── Sales Channels ──

export interface AdminSalesChannel {
  id: string;
  name: string;
  description: string | null;
  type: SalesChannelType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalesChannelPayload {
  name: string;
  description?: string;
  type?: SalesChannelType;
  isActive?: boolean;
}

export interface UpdateSalesChannelPayload
  extends Partial<CreateSalesChannelPayload> {}

// ── API Keys ──

export interface AdminApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  type: ApiKeyType;
  userId: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface CreateApiKeyPayload {
  name: string;
  type: ApiKeyType;
  expiresAt?: string;
}

// ── Paginated Response ──

export interface AdminPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Dashboard Stats ──

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: AdminOrder[];
  lowStockItems: AdminInventoryLevel[];
}
