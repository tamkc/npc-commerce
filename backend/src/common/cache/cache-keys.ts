export const CacheKeys = {
  PRODUCT_LIST: 'product:list',
  PRODUCT_DETAIL: 'product:detail',
  PRODUCT_SLUG: 'product:slug',
  PRICE_CALCULATION: 'price:calc',
  PROMOTIONS_ACTIVE: 'promotion:active',
  INVENTORY_LEVEL: 'inventory:level',
} as const;

/** TTL values in milliseconds */
export const CacheTTL = {
  PRODUCT: 2 * 60 * 60 * 1000,       // 2 hours
  PRICE: 1 * 60 * 60 * 1000,         // 1 hour
  PROMOTION: 5 * 60 * 1000,          // 5 minutes
  INVENTORY: 30 * 1000,              // 30 seconds
} as const;
